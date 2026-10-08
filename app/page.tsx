import Image from "next/image";
import LeadForm from "./LeadForm";

const collections = [
  { img: "/images/sofa.jpg", tag: "01", title: "Yumshoq mebel", text: "Charm divanlar, kreslolar, pufiklar" },
  { img: "/images/bedroom.jpg", tag: "02", title: "Yotoqxona", text: "Karavotlar, tumbalar, shkaflar" },
  { img: "/images/dining.jpg", tag: "03", title: "Oshxona va stollar", text: "Stol-stullar, bar stullari, javonlar" },
];

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

const features = [
  {
    d: "M3 21h18M5 21V9l5 3V9l5 3V5h4v16",
    title: "Ishlab chiqaruvchi narxi",
    text: "O'z sexmizda tayyorlanadi — vositachi ustamasi yo'q",
  },
  {
    d: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01",
    title: "Bepul yetkazish",
    text: "Viloyat bo'ylab yetkazib berish va o'rnatish bepul",
  },
  {
    d: "M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3zM9 12l2 2 4-4",
    title: "Kafolat",
    text: "Metall karkas va massiv yog'ochga rasmiy kafolat",
  },
  {
    d: "M3 6h18v12H3zM3 10h18M7 15h4",
    title: "Muddatli to'lov",
    text: "Qulay bo'lib to'lash — ortiqcha to'lovsiz",
  },
];

export default function Home() {
  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="hero">
        <Image src="/images/hero.jpg" alt="Loft uslubidagi mehmonxona" fill priority sizes="100vw" className="bg-img" />
        <div className="hero-overlay" />
        <div className="grain" />

        <header className="topbar container">
          <a href="#" className="logo">
            <span className="logo-mark">UJ</span>
            <span className="logo-text">
              UY JIHOZI
              <small>loft mebel</small>
            </span>
          </a>
          <a href="#ariza" className="top-cta">
            Ariza qoldirish
          </a>
        </header>

        <div className="container hero-grid">
          <div className="hero-text">
            <span className="eyebrow">
              <i /> Loft uslubidagi mebellar
            </span>
            <h1>
              Uyingizga <em>xarakter</em> beradigan mebel
            </h1>
            <p className="lead">
              Metall va massiv yog&apos;ochdan — ishlab chiqaruvchi narxida. Arizani qoldiring, dizaynerimiz 15 daqiqada
              bog&apos;lanib, interyeringizga mos variantlarni tanlab beradi.
            </p>
            <ul className="checks">
              <li>Shu hafta 30% gacha chegirma</li>
              <li>Bepul yetkazish va o&apos;rnatish</li>
              <li>Muddatli to&apos;lov</li>
            </ul>
          </div>

          <div className="form-card" id="ariza">
            <div className="form-head">
              <span className="form-tag">Bepul konsultatsiya</span>
              <h2>Narxlar katalogini oling</h2>
              <p>Ma&apos;lumotlaringizni qoldiring — chegirmali narxlarni yuboramiz</p>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>

      {/* ===== KOLLEKSIYALAR ===== */}
      <section className="section concrete">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow dark">
              <i /> Kolleksiyalar
            </span>
            <h2>Har bir xona uchun loft yechim</h2>
          </div>
          <div className="collections">
            {collections.map((c) => (
              <a href="#ariza" className="col-card" key={c.title}>
                <Image src={c.img} alt={c.title} fill sizes="(max-width: 900px) 100vw, 33vw" className="col-img" />
                <div className="col-shade" />
                <span className="col-tag">{c.tag}</span>
                <div className="col-body">
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <span className="col-link">Narxini bilish →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AFZALLIKLAR ===== */}
      <section className="section brick">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">
              <i /> Nega aynan biz
            </span>
            <h2>Sanoat mustahkamligi, uy iliqligi</h2>
          </div>
          <div className="features">
            {features.map((f) => (
              <div className="feature" key={f.title}>
                <div className="f-icon">
                  <Icon d={f.d} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== YAKUNIY CTA ===== */}
      <section className="final">
        <Image src="/images/cta.jpg" alt="" fill sizes="100vw" className="bg-img" />
        <div className="final-overlay" />
        <div className="container final-inner">
          <h2>
            Chegirma faqat <em>shu hafta</em>
          </h2>
          <p>Arizani hozir qoldiring — narxlar katalogi va bepul dizayn maslahatini oling.</p>
          <a href="#ariza" className="btn-primary">
            Ariza qoldirish →
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <span className="logo small">
            <span className="logo-mark">UJ</span> UY JIHOZI
          </span>
          <span>© {new Date().getFullYear()} Barcha huquqlar himoyalangan</span>
        </div>
      </footer>
    </main>
  );
}
