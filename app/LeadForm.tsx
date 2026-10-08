"use client";

import { useState } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const REGIONS = [
  "Toshkent shahri", "Toshkent viloyati", "Samarqand", "Buxoro", "Andijon", "Farg'ona", "Namangan",
  "Qashqadaryo", "Surxondaryo", "Jizzax", "Sirdaryo", "Navoiy", "Xorazm", "Qoraqalpog'iston",
];

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function getFbc() {
  const c = getCookie("_fbc");
  if (c) return c;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
}

function formatPhone(digits: string) {
  const d = digits.slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return parts.join(" ");
}

export default function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const phoneDigits = phone.replace(/\D/g, "");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Ismingizni kiriting");
    if (phoneDigits.length !== 9) return setError("Telefon raqamni to'liq kiriting");
    if (location.trim().length < 2) return setError("Joylashuvni kiriting");

    setLoading(true);
    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: "998" + phoneDigits,
          location,
          eventId,
          fbp: getCookie("_fbp"),
          fbc: getFbc(),
          pageUrl: window.location.href,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Xatolik yuz berdi");

      // Brauzer Pixel — server CAPI bilan bir xil eventID (deduplikatsiya)
      window.fbq?.("track", "Lead", { content_name: "Uy jihozi — ariza" }, { eventID: eventId });

      setDone(true);
      const channel = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL;
      setTimeout(() => {
        if (channel) window.location.href = channel;
      }, 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="success">
        <div className="success-icon">✓</div>
        <h3>Arizangiz qabul qilindi!</h3>
        <p>Telegram kanalimizga yo'naltirilmoqdasiz...</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="form" noValidate>
      <label>
        <span>Ismingiz</span>
        <input
          type="text"
          placeholder="Masalan: Aziz"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />
      </label>

      <label>
        <span>Telefon raqamingiz</span>
        <div className="phone">
          <em>+998</em>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="90 123 45 67"
            value={formatPhone(phoneDigits)}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
            autoComplete="tel-national"
            required
          />
        </div>
      </label>

      <label>
        <span>Joylashuvingiz</span>
        <input
          type="text"
          list="regions"
          placeholder="Shahar yoki viloyat"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <datalist id="regions">
          {REGIONS.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Yuborilmoqda..." : "Ariza qoldirish →"}
      </button>
      <p className="note">🔒 Ma'lumotlaringiz uchinchi shaxslarga berilmaydi</p>
    </form>
  );
}
