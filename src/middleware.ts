import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUsername } from "./lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";
  const user = await getSessionUsername();

  if (isAdmin) {
    if (!user && !isLogin) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (user && isLogin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
