import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ error: "File uploads are not supported on serverless. Please use an external image URL (e.g., from your own image hosting)." }, { status: 400 });
}
