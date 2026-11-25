import * as crypto from "crypto";
import * as path from "path";
import { cookies } from "next/headers";
import { getSettings } from "./db";
import { getSessionUsername as sessionUsername } from "./session";

const SESSION_COOKIE = "nova_session";

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(salt + ":" + derivedKey.toString("hex"));
    });
  });
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey.toString("hex") === hash);
    });
  });
}

export async function getSessionUsername(): Promise<string | null> {
  return sessionUsername();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getSessionUsername()) !== null;
}

export async function requireAdmin(): Promise<boolean> {
  return isAdminAuthenticated();
}

export async function validateAdminCredentials(username: string, password: string): Promise<boolean> {
  // 1. Check environment variables first (for production deployment)
  const envUsername = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envUsername && envPassword) {
    if (username === envUsername && password === envPassword) {
      return true;
    }
    return false;
  }

  // 2. Fall back to settings.json
  const settings = await getSettings();
  if (!settings.admin.passwordHash) return false;
  return verifyPassword(password, settings.admin.passwordHash);
}

export { SESSION_COOKIE };
