import { cookies } from "next/headers";

const SESSION_COOKIE = "nova_session";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SECRET = process.env.SESSION_SECRET || "nova-core-dev-secret-change-me";

function b64url(buf: Uint8Array): string {
  let binary = "";
  for (const b of buf) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unb64url(str: string): Uint8Array {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const binary = atob(s);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
  return buf;
}

async function hmacKey(op: KeyUsage) {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey("raw", encoder.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, [op]);
}

export async function createSessionToken(username: string): Promise<string> {
  const encoder = new TextEncoder();
  const payload = JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL_MS });
  const key = await hmacKey("sign");
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${b64url(encoder.encode(payload))}.${b64url(new Uint8Array(sig))}`;
}

export async function getSessionUsername(): Promise<string | null> {
  const store = await cookies();
  const token = (store.get(SESSION_COOKIE)?.value ?? null) as string | null;
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  let payload: string;
  try {
    payload = new TextDecoder().decode(unb64url(payloadB64));
  } catch {
    return null;
  }
  let parsed: { u?: string; exp?: number };
  try {
    parsed = JSON.parse(payload);
  } catch {
    return null;
  }
  if (!parsed.u || !parsed.exp || parsed.exp < Date.now()) return null;
  const key = await hmacKey("verify");
  if (!(await crypto.subtle.verify("HMAC", key, unb64url(sig) as unknown as ArrayBuffer, new TextEncoder().encode(payload)))) return null;
  return parsed.u as string;
}

export function sessionCookieHeader(token: string, secure: boolean, maxAge: number): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

export function clearSessionCookieHeader(secure: boolean): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
