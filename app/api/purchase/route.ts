import { NextRequest, NextResponse } from "next/server";
import { buildUserData, sendCapiEvent } from "@/lib/meta";
import { decryptLead } from "@/lib/token";
import { escapeHtml, sendTelegram } from "@/lib/telegram";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { token?: string; amount?: number | string; pin?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const pin = process.env.ADMIN_PIN;
  if (pin && body.pin !== pin) return NextResponse.json({ ok: false, error: "PIN kod noto'g'ri" }, { status: 401 });

  const lead = decryptLead(String(body.token || ""));
  if (!lead) return NextResponse.json({ ok: false, error: "Havola yaroqsiz" }, { status: 400 });

  const amountUzs = Number(String(body.amount ?? "").replace(/[^\d.]/g, ""));
  if (!amountUzs || amountUzs <= 0)
    return NextResponse.json({ ok: false, error: "Summani to'g'ri kiriting" }, { status: 400 });

  const currency = (process.env.META_CURRENCY || "USD").toUpperCase();
  const rate = Number(process.env.UZS_PER_USD || 12600);
  const value = currency === "UZS" ? amountUzs : Math.round((amountUzs / rate) * 100) / 100;

  const res = await sendCapiEvent({
    event_name: "Purchase",
    event_id: `purchase_${lead.id}`, // takror bosilsa Meta dublikatni o'chiradi
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: lead.url,
    user_data: buildUserData({
      id: lead.id,
      name: lead.n,
      phone: lead.p,
      city: lead.l,
      ip: lead.ip,
      ua: lead.ua,
      fbp: lead.fbp,
      fbc: lead.fbc,
    }),
    custom_data: {
      value,
      currency,
      content_name: "Uy jihozi",
      order_id: lead.id,
    },
  });

  if (!res.ok) return NextResponse.json({ ok: false, error: res.error }, { status: 502 });

  await sendTelegram(
    `✅ <b>Purchase Metaga yuborildi</b>\n\n👤 ${escapeHtml(lead.n)} · +${lead.p}\n` +
      `💵 ${amountUzs.toLocaleString("ru-RU")} so'm` +
      (currency === "UZS" ? "" : ` (≈ ${value} ${currency})`)
  );

  return NextResponse.json({ ok: true, value, currency });
}
