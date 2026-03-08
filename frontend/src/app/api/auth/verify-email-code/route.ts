import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CodeEntry = {
  code: string;
  expiresAt: number;
};

// NOTE: This must match the in-memory storage used by the send-code route.
// Because Next.js route handlers are module-scoped, this works in a single running server.
// For production (serverless / multiple instances), replace with a shared store (DB/Redis).
const globalAny = globalThis as unknown as { __tm_emailCodes?: Map<string, CodeEntry> };
const codesByEmail = (globalAny.__tm_emailCodes ??= new Map<string, CodeEntry>());

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; code?: string };
    const email = (body.email ?? "").trim();
    const code = (body.code ?? "").trim();

    const entry = codesByEmail.get(email);
    if (!entry) {
      return NextResponse.json(
        { ok: false, message: "인증번호를 먼저 발송해주세요." },
        { status: 400 }
      );
    }

    if (Date.now() > entry.expiresAt) {
      codesByEmail.delete(email);
      return NextResponse.json(
        { ok: false, message: "인증번호가 만료되었습니다. 다시 발송해주세요." },
        { status: 400 }
      );
    }

    if (entry.code !== code) {
      return NextResponse.json(
        { ok: false, message: "인증번호가 일치하지 않습니다." },
        { status: 400 }
      );
    }

    codesByEmail.delete(email);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
