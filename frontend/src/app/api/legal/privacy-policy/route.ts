import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src", "app", "register", "privacy_policy.txt");
    const content = await readFile(filePath, "utf8");
    return NextResponse.json({ ok: true, content });
  } catch {
    return NextResponse.json(
      { ok: false, message: "개인정보 처리방침을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}
