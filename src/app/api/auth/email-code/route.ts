import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const CODE_TTL_MS = 5 * 60 * 1000;

type CodeEntry = {
  code: string;
  expiresAt: number;
};

const globalAny = globalThis as unknown as { __tm_emailCodes?: Map<string, CodeEntry> };
const codesByEmail = (globalAny.__tm_emailCodes ??= new Map<string, CodeEntry>());

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  const from = process.env.SMTP_FROM ?? user;

  const port = portRaw ? Number.parseInt(portRaw, 10) : undefined;
  const secure = process.env.SMTP_SECURE === "true";

  return { host, port, user, pass, from, secure };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = (body.email ?? "").trim();

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, message: "이메일 형식이 올바르지 않습니다." },
        { status: 400 }
      );
    }

    const code = generateSixDigitCode();
    codesByEmail.set(email, { code, expiresAt: Date.now() + CODE_TTL_MS });

    const { host, port, user, pass, from, secure } = getSmtpConfig();

    // If SMTP is not configured, we still generate the code but cannot deliver it.
    // In dev, we log it to the server console so you can test end-to-end UI.
    if (!host || !port || !user || !pass || !from) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[DEV] Email verification code for ${email}: ${code}`);
        return NextResponse.json({
          ok: true,
          delivered: false,
          message: "개발 환경: 서버 콘솔에 인증코드가 출력되었습니다.",
        });
      }

      return NextResponse.json(
        { ok: false, message: "SMTP 설정이 없어 이메일을 발송할 수 없습니다." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 10_000,
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: "[TradeMate] 이메일 인증 코드",
      text: `TradeMate 이메일 인증 코드: ${code}\n\n본인이 요청한 것이 아니라면 이 메일을 무시해주세요.\n(유효시간: 5분)`,
    });

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[email-code] failed", err);
    }

    const message =
      process.env.NODE_ENV !== "production" && err instanceof Error
        ? `요청 처리 중 오류가 발생했습니다: ${err.message}`
        : "요청 처리 중 오류가 발생했습니다.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
