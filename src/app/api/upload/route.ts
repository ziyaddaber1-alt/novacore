import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });
  const ext = file.name.split(".").pop() || "bin";
  const name = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const full = path.join(uploadsDir, name);
  const bytes = await file.arrayBuffer();
  fs.writeFileSync(full, Buffer.from(bytes));
  return NextResponse.json({ url: `/uploads/${name}` });
}
