import crypto from "crypto";

/** Lid ma'lumotlari — Telegram havolasi ichida AES-256-GCM bilan shifrlangan holda saqlanadi */
export type LeadPayload = {
  id: string; // lead / external_id
  n: string; // ism
  p: string; // telefon (998XXXXXXXXX)
  l: string; // joylashuv
  t: number; // lid vaqti (unix sekund)
  ip?: string;
  ua?: string;
  fbp?: string;
  fbc?: string;
  url?: string;
};

function key(): Buffer {
  const secret = process.env.LEAD_SECRET;
  if (!secret || secret.length < 16) throw new Error("LEAD_SECRET o'rnatilmagan");
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptLead(payload: LeadPayload): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, data]).toString("base64url");
}

export function decryptLead(token: string): LeadPayload | null {
  try {
    const buf = Buffer.from(token, "base64url");
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const data = buf.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    const json = Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
    return JSON.parse(json) as LeadPayload;
  } catch {
    return null;
  }
}
