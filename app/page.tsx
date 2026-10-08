import LeadForm from "./LeadForm";

const benefits = [
  { icon: "🏭", title: "Zavod narxida", text: "Vositachilarsiz — to'g'ridan-to'g'ri ishlab chiqaruvchidan" },
  { icon: "🚚", title: "Bepul yetkazish", text: "Viloyat bo'ylab yetkazib berish va o'rnatish" },
  { icon: "🛡️", title: "Kafolat", text: "Barcha mahsulotlarga rasmiy kafolat" },
  { icon: "💳", title: "Muddatli to'lov", text: "Qulay bo'lib to'lash imkoniyati" },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <span className="badge">🔥 Faqat shu hafta — 30% gacha chegirma</span>
            <h1>
              Uyingiz uchun <span className="accent">sifatli mebel va jihozlar</span> — zavod narxida
            </h1>
            <p className="lead">
              Yotoqxona, oshxona, mehmonxona jihozlari. Arizani qoldiring — mutaxassisimiz 15 daqiqa ichida bog'lanib,
              eng mos variantni tanlab beradi.
            </p>
            <ul className="benefits">
              {benefits.map((b) => (
                <li key={b.title}>
                  <span className="b-icon">{b.icon}</span>
                  <div>
                    <strong>{b.title}</strong>
                    <small>{b.text}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" id="ariza">
            <h2>Bepul konsultatsiya oling</h2>
            <p className="muted">Ma'lumotlaringizni qoldiring — chegirmali narxlarni yuboramiz</p>
            <LeadForm />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">© {new Date().getFullYear()} Uy jihozi. Barcha huquqlar himoyalangan.</div>
      </footer>
    </main>
  );
}
