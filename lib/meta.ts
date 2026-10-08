import crypto from "crypto";

const GRAPH_VERSION = "v24.0";

export const sha256 = (v: string) => crypto.createHash("sha256").update(v).digest("hex");

/** Telefonni 998XXXXXXXXX formatiga keltirish */
export function normalizePhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.length === 9) d = "998" + d;
  return d;
}

const clean = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9Ѐ-ӿ]/g, "");

type UserInput = {
  id: string;
  name: string;
  phone: string;
  city: string;
  ip?: string;
  ua?: string;
  fbp?: string;
  fbc?: string;
};

/** Meta talabiga ko'ra barcha shaxsiy ma'lumotlar SHA-256 bilan heshlanadi */
export function buildUserData(u: UserInput) {
  const parts = u.name.trim().split(/\s+/);
  const fn = clean(parts[0] || "");
  const ln = clean(parts.slice(1).join(""));
  const ct = clean(u.city);
  const ph = normalizePhone(u.phone);

  const ud: Record<string, unknown> = {
    external_id: [sha256(u.id)],
    country: [sha256("uz")],
  };
  if (ph) ud.ph = [sha256(ph)];
  if (fn) ud.fn = [sha256(fn)];
  if (ln) ud.ln = [sha256(ln)];
  if (ct) ud.ct = [sha256(ct)];
  if (u.ip) ud.client_ip_address = u.ip;
  if (u.ua) ud.client_user_agent = u.ua;
  if (u.fbp) ud.fbp = u.fbp;
  if (u.fbc) ud.fbc = u.fbc;
  return ud;
}

type CapiEvent = {
  event_name: "Lead" | "Purchase";
  event_id: string;
  event_time: number;
  event_source_url?: string;
  user_data: Record<string, unknown>;
  custom_data?: Record<string, unknown>;
};

export async function sendCapiEvent(ev: CapiEvent) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    console.warn("[CAPI] Pixel ID yoki access token yo'q — hodisa yuborilmadi");
    return { ok: false, error: "CAPI sozlanmagan" };
  }

  const body: Record<string, unknown> = {
    data: [{ ...ev, action_source: "website" }],
  };
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );
    const json = await res.json();
    if (!res.ok) {
      console.error("[CAPI] xato:", JSON.stringify(json));
      return { ok: false, error: json?.error?.message || "CAPI xatosi" };
    }
    return { ok: true, events_received: json.events_received as number };
  } catch (e) {
    console.error("[CAPI] tarmoq xatosi:", e);
    return { ok: false, error: "Tarmoq xatosi" };
  }
}
