import { NextResponse } from "next/server";
import { sessionCookieHeader } from "@/lib/session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";
  res.headers.set("set-cookie", sessionCookieHeader("", secure, 0));
  return res;
}
