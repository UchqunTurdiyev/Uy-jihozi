import { NextRequest, NextResponse } from "next/server";
import { buildUserData, normalizePhone, sendCapiEvent } from "@/lib/meta";
import { encryptLead } from "@/lib/token";
import { escapeHtml, sendTelegram } from "@/lib/telegram";

export const runtime = "nodejs";

function clientIp(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] || req.headers.get("x-real-ip") || "").trim() || undefined;
}

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const name = String(body.name || "").trim().slice(0, 80);
  const phone = normalizePhone(String(body.phone || ""));
  const location = String(body.location || "").trim().slice(0, 80);
  const eventId = String(body.eventId || "").slice(0, 64) || crypto.randomUUID();

  if (name.length < 2) return NextResponse.json({ ok: false, error: "Ismingizni kiriting" }, { status: 400 });
  if (!/^998\d{9}$/.test(phone))
    return NextResponse.json({ ok: false, error: "Telefon raqam noto'g'ri" }, { status: 400 });
  if (location.length < 2)
    return NextResponse.json({ ok: false, error: "Joylashuvni kiriting" }, { status: 400 });

  const ip = clientIp(req);
  const ua = req.headers.get("user-agent") || undefined;
  const fbp = body.fbp || req.cookies.get("_fbp")?.value || undefined;
  const fbc = body.fbc || req.cookies.get("_fbc")?.value || undefined;
  const pageUrl = String(body.pageUrl || process.env.NEXT_PUBLIC_SITE_URL || "").slice(0, 500);
  const now = Math.floor(Date.now() / 1000);

  // 1) Meta CAPI — Lead (brauzerdagi Pixel bilan bir xil event_id => deduplikatsiya)
  const capi = sendCapiEvent({
    event_name: "Lead",
    event_id: eventId,
    event_time: now,
    event_source_url: pageUrl,
    user_data: buildUserData({ id: eventId, name, phone, city: location, ip, ua, fbp, fbc }),
    custom_data: { content_name: "Uy jihozi — ariza" },
  });

  // 2) Shifrlangan havola — sotuv bo'lganda Purchase yuborish uchun
  const token = encryptLead({ id: eventId, n: name, p: phone, l: location, t: now, ip, ua, fbp, fbc, url: pageUrl });
  const site = (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, "");
  const link = `${site}/purchase?t=${token}`;

  const time = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Samarkand" });
  const text =
    `🆕 <b>Yangi lid</b>\n\n` +
    `👤 <b>Ism:</b> ${escapeHtml(name)}\n` +
    `📞 <b>Tel:</b> +${phone}\n` +
    `📍 <b>Joylashuv:</b> ${escapeHtml(location)}\n` +
    `🕒 ${time}\n\n` +
    `💰 <a href="${link}">Sotib oldi → Metaga yuborish</a>`;

  const [capiRes] = await Promise.all([
    capi,
    sendTelegram(text, { text: "💰 Sotib oldi — summani kiritish", url: link }),
  ]);

  return NextResponse.json({ ok: true, capi: capiRes.ok });
}
