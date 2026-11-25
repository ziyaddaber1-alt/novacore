import { NextResponse } from "next/server";
import { isAdminAuthenticated, getSessionUsername } from "@/lib/auth";

export async function GET() {
  const authed = await isAdminAuthenticated();
  return NextResponse.json({ authenticated: authed, user: authed ? await getSessionUsername() : null });
}
