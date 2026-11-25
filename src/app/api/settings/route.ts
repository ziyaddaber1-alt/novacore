import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    store: settings.store,
    legal: settings.legal,
    webhookUrl: settings.webhookUrl,
    hasPassword: !!settings.admin.passwordHash,
  });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const settings = await getSettings();
  if (body.store) settings.store = { ...settings.store, ...body.store };
  if (body.legal) settings.legal = { ...settings.legal, ...body.legal };
  if (body.webhookUrl !== undefined) settings.webhookUrl = body.webhookUrl;
  if (body.password) {
    const { hashPassword } = await import("@/lib/auth");
    settings.admin.passwordHash = await hashPassword(body.password);
  }
  if (body.username) settings.admin.username = body.username;
  await saveSettings(settings);
  return NextResponse.json({ ok: true });
}
