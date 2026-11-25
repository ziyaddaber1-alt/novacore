import { NextResponse } from "next/server";
import { getSettings } from "@/lib/db";
import { validateAdminCredentials } from "@/lib/auth";
import {
  createSessionToken,
  sessionCookieHeader,
  SESSION_TTL_MS,
} from "@/lib/session";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }
  const ok = await validateAdminCredentials(username, password);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = await createSessionToken(username);
  const secure = process.env.NODE_ENV === "production";
  const res = NextResponse.json({ ok: true });
  res.headers.set("set-cookie", sessionCookieHeader(token, secure, SESSION_TTL_MS / 1000));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";
  res.headers.set("set-cookie", sessionCookieHeader("", secure, 0));
  return res;
}
