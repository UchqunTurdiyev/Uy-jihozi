"use client";

import { useState } from "react";

export default function PurchaseForm({ token, needPin }: { token: string; needPin: boolean }) {
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const digits = amount.replace(/\D/g, "");
  const pretty = digits ? Number(digits).toLocaleString("ru-RU") : "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!digits || Number(digits) <= 0) return setMsg({ ok: false, text: "To'lov summasini kiriting" });
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, amount: Number(digits), pin }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Xatolik");
      setMsg({ ok: true, text: `✅ Purchase Metaga yuborildi: ${data.value} ${data.currency}` });
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Xatolik" });
    } finally {
      setLoading(false);
    }
  }

  if (msg?.ok) return <div className="success"><div className="success-icon">✓</div><p>{msg.text}</p></div>;

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        <span>To'lov summasi (so'm)</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Masalan: 5 000 000"
          value={pretty}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
        />
      </label>
      {needPin && (
        <label>
          <span>PIN kod</span>
          <input type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value)} />
        </label>
      )}
      {msg && !msg.ok && <p className="error">{msg.text}</p>}
      <button type="submit" disabled={loading}>{loading ? "Yuborilmoqda..." : "Metaga yuborish"}</button>
    </form>
  );
}
