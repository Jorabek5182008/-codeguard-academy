// Single source of truth for course info, used by:
//  - the homepage course cards (app/page.jsx)
//  - the course listing page (app/courses/page.jsx)
//  - individual course detail pages (app/courses/[slug]/page.jsx)
//
// Not database-driven yet (courses don't change often) — a future phase
// can move this into the admin panel if you want to add/edit courses
// without a code change.
export const COURSES = [
  {
    slug: 'ai-kirish-darsi',
    icon: '🤖',
    badge: 'BEPUL',
    title: "Sun'iy intellekt — kirish darsi",
    shortDesc: 'AI qanday ishlaydi, ChatGPT/Claude kabi vositalardan qanday foydalanish — bir martalik bepul dars.',
    longDesc:
      "Bu kirish darsida sun'iy intellektning asosiy tamoyillarini, zamonaviy AI vositalaridan (ChatGPT, Claude va boshqalar) kundalik ish va o'qishda qanday foydalanishni o'rganasiz. Dars amaliy misollar bilan olib boriladi va dasturlash tajribasi talab qilinmaydi.",
    whatYouLearn: [
      "Sun'iy intellekt qanday ishlashi haqida asosiy tushunchalar",
      'AI chat-botlaridan samarali foydalanish usullari',
      "Kundalik vazifalarni AI yordamida tezlashtirish",
      'Keyingi bosqich sifatida Python/AI kurslariga yo\'nalish',
    ],
    level: "Boshlang'ich, tajriba talab qilinmaydi",
    duration: '1 dars (~90 daqiqa)',
    price: '0 so\'m',
    priceNote: 'Bepul',
    course: 'ai',
    plan: 'free',
  },
  {
    slug: 'python-boshlangich',
    icon: '🐍',
    badge: null,
    title: "Python — Boshlang'ich",
    shortDesc: "Sintaksis, o'zgaruvchilar, tsikllar, funksiyalar — noldan mustahkam bazaviy bilim.",
    longDesc:
      "8 haftalik ushbu kursda Python dasturlash tilining asoslarini noldan, amaliy loyihalar orqali o'rganasiz. Har bir mavzu kichik mashqlar va uy vazifalari bilan mustahkamlanadi, shaxsiy mentor savollaringizga javob beradi.",
    whatYouLearn: [
      "Python sintaksisi, o'zgaruvchilar va ma'lumot turlari",
      'Shart operatorlari va tsikllar',
      'Funksiyalar va modullar',
      "Fayllar bilan ishlash va oddiy loyihalar yaratish",
    ],
    level: "Boshlang'ich",
    duration: '8 hafta, haftada 3 dars',
    price: '99 999 so\'m',
    priceNote: 'oyiga',
    course: 'python',
    plan: 'basic',
  },
  {
    slug: 'python-amaliy-loyihalar',
    icon: '⚙️',
    badge: null,
    title: 'Python — Amaliy loyihalar',
    shortDesc: "Web, ma'lumotlar tahlili va kichik AI loyihalari orqali portfolio yaratish.",
    longDesc:
      "12 haftalik Pro dasturida siz allaqachon Python asoslarini biladigan darajadan real loyihalar qurishga o'tasiz — web ilovalar, ma'lumotlar tahlili skriptlari va kichik AI integratsiyalari. Kurs oxirida portfolio uchun tayyor loyihalaringiz bo'ladi.",
    whatYouLearn: [
      'Web ilovalar uchun backend asoslari',
      "Ma'lumotlar tahlili va vizualizatsiya",
      'Tashqi API va AI vositalari bilan integratsiya',
      "GitHub'da portfolio shakllantirish",
    ],
    level: "O'rta (Python asoslarini bilish tavsiya etiladi)",
    duration: '12 hafta',
    price: '199 999 so\'m',
    priceNote: 'oyiga',
    course: 'python',
    plan: 'pro',
  },
];

export function getCourseBySlug(slug) {
  return COURSES.find((c) => c.slug === slug) || null;
}
