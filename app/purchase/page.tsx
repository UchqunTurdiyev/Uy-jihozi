import type { Metadata } from "next";
import { decryptLead } from "@/lib/token";
import PurchaseForm from "./PurchaseForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sotuvni tasdiqlash", robots: { index: false, follow: false } };

export default async function PurchasePage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const lead = t ? decryptLead(t) : null;

  return (
    <main className="admin">
      <div className="card admin-card">
        {!lead ? (
          <>
            <h2>❌ Havola yaroqsiz</h2>
            <p className="muted">Telegramdagi havolani to'liq nusxalanganini tekshiring.</p>
          </>
        ) : (
          <>
            <h2>💰 Sotuvni Metaga yuborish</h2>
            <div className="lead-info">
              <div><span>Ism</span><b>{lead.n}</b></div>
              <div><span>Telefon</span><b>+{lead.p}</b></div>
              <div><span>Joylashuv</span><b>{lead.l}</b></div>
              <div>
                <span>Lid vaqti</span>
                <b>{new Date(lead.t * 1000).toLocaleString("uz-UZ", { timeZone: "Asia/Samarkand" })}</b>
              </div>
            </div>
            <PurchaseForm token={t!} needPin={Boolean(process.env.ADMIN_PIN)} />
          </>
        )}
      </div>
    </main>
  );
}
