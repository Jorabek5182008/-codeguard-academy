import SiteNav from '@/components/SiteNav';

export const metadata = {
  title: 'Akademiya haqida — CodeGuard Academy',
};

export default function AcademyPage() {
  return (
    <div className="page-shell">
      <SiteNav />
      <div className="container" style={{ maxWidth: 760, paddingTop: 40, paddingBottom: 80 }}>
        <div className="section-head" style={{ marginBottom: 32, textAlign: 'left' }}>
          <div className="kicker">CodeGuard Academy</div>
          <h2>Kelajak kasblarini amaliy o'rganing</h2>
          <p>
            Python, sun'iy intellekt va kiberxavfsizlik bo'yicha zamonaviy bilimlarni amaliy tarzda
            egallashga yordam beramiz.
          </p>
        </div>

        <div className="grid grid-2" style={{ marginBottom: 32 }}>
          <div className="card">
            <div className="icon">🎯</div>
            <h3>Yondashuvimiz</h3>
            <p>
              Har bir mavzu nazariya bilan cheklanib qolmaydi — amaliy loyihalar, mashqlar va real
              vazifalar orqali mustahkamlanadi.
            </p>
          </div>
          <div className="card">
            <div className="icon">🧑‍🏫</div>
            <h3>Mentorlik</h3>
            <p>
              Har bir guruhga mentor biriktiriladi, savollaringizga Telegram guruh orqali javob
              olasiz.
            </p>
          </div>
          <div className="card">
            <div className="icon">📈</div>
            <h3>Bosqichma-bosqich</h3>
            <p>
              Bepul kirish darsidan boshlab, asosiy va amaliy loyihalar darajasigacha — o'z
              sur'atingizda rivojlaning.
            </p>
          </div>
          <div className="card">
            <div className="icon">🤝</div>
            <h3>Hamjamiyat</h3>
            <p>
              Telegram guruhlarimiz orqali boshqa talabalar bilan bog'lanasiz, savol-javob va
              tajriba almashinuvi doimiy davom etadi.
            </p>
          </div>
        </div>

        <h3 style={{ marginBottom: 12 }}>Yo'nalishlarimiz</h3>
        <ul style={{ color: 'var(--muted)', lineHeight: 2, paddingLeft: 20, marginBottom: 32 }}>
          <li>Dasturlash (Python)</li>
          <li>Sun'iy intellekt asoslari</li>
          <li>Kelajakda: kiberxavfsizlik yo'nalishi</li>
        </ul>

        <h3 style={{ marginBottom: 16 }}>Tez-tez so'raladigan savollar</h3>
        <div style={{ marginBottom: 32 }}>
          {[
            {
              q: "Dasturlash bo'yicha tajribam yo'q, baribir o'qiy olamanmi?",
              a: "Ha. Boshlang'ich kurs aynan tajribasi yo'q odamlar uchun mo'ljallangan — noldan, sodda tildan boshlaymiz.",
            },
            {
              q: 'Darslar qanday formatda o\'tkaziladi?',
              a: "Darslar onlayn, jonli formatda o'tkaziladi. Darslar yozib olinadi va Telegram guruhda saqlanadi, shuning uchun darsni o'tkazib yuborsangiz ham qoldirmaysiz.",
            },
            {
              q: "To'lovni qanday amalga oshiraman?",
              a: "Ro'yxatdan o'tgach, murabbiylarimiz siz bilan bog'lanib, Click/Payme orqali to'lov havolasini yuboradi.",
            },
            {
              q: 'Sertifikat beriladimi?',
              a: "Ha, Boshlang'ich va Pro dasturlarini to'liq yakunlagan talabalarga rasmiy CodeGuard Academy sertifikati beriladi.",
            },
          ].map((item, i) => (
            <div key={i} className="card" style={{ marginBottom: 12 }}>
              <strong style={{ display: 'block', marginBottom: 8 }}>{item.q}</strong>
              <p style={{ margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>

        <a href="/courses" className="btn btn-primary">Kurslarni ko'rish</a>
      </div>
    </div>
  );
}
