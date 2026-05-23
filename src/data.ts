import { ExamDetails } from "./types";

export const INITIAL_EXAMS: ExamDetails[] = [
  {
    id: "ata-aof",
    name: "ATA AÖF Final",
    fullName: "Atatürk Üniversitesi Açık ve Uzaktan Öğretim Fakültesi Bahar Dönemi Final Sınavları",
    date: "2026-06-13T09:30:00+03:00", // June 13, 2026, 09:30 Turkey Time
    time: "09:30",
    totalDaysRemaining: 21,
    description: "ATA AÖF öğrencileri için Bahar Dönemi akademik takvimi son virajı olan Final sınavları.",
    color: "from-blue-600 to-indigo-700",
    accentColor: "indigo",
    subjects: [
      "ATA AÖF Bahar Dönemi 1. Ders",
      "ATA AÖF Bahar Dönemi 2. Ders",
      "ATA AÖF Bahar Dönemi 3. Ders",
      "ATA AÖF Bahar Dönemi 4. Ders",
      "ATA AÖF Bahar Dönemi 5. Ders",
      "ATA AÖF Bahar Dönemi 6. Ders",
    ]
  },
  {
    id: "kpss-onlisans",
    name: "KPSS Ön Lisans",
    fullName: "Kamu Personeli Seçme Sınavı Ön Lisans Oturumu",
    date: "2026-10-04T10:15:00+03:00", // October 4, 2026, 10:15 Turkey Time
    time: "10:15",
    totalDaysRemaining: 134,
    description: "Ön lisans mezunları ve mezun olabilecek durumdaki adaylar için devlet kadrolarına atama sınavı.",
    color: "from-amber-500 to-rose-600",
    accentColor: "amber",
    subjects: [
      "Türkçe (Sözcük, Cümle, Paragraf Yapısı & Dil Bilgisi)",
      "Matematik (Sayılar, Problemler & Temel Geometri)",
      "Tarih (Osmanlı Devleti, İnkılap Tarihi & Çağdaş Türk Tarihi)",
      "Coğrafya (Türkiye'nin Fiziki Özellikleri, Nüfus, Sanayi & Tarım)",
      "Vatandaşlık (Temel Hukuk, Anayasa Tarihi, Yasama, Yürütme, Yargı)",
      "Güncel Bilgiler (Genel Kültür, Uluslararası Kuruluşlar, Güncel Gelişmeler)"
    ]
  }
];

export const MOTIVATIONAL_QUOTES = [
  {
    text: "Gelecek, bugünden ona hazırlananlarındır.",
    author: "Malcolm X"
  },
  {
    text: "Başarı, her gün tekrarlanan küçük disiplinlerin toplamıdır.",
    author: "Robert Collier"
  },
  {
    text: "Eğitimin kökleri acı, meyveleri tatlıdır.",
    author: "Aristoteles"
  },
  {
    text: "Damlaya damlaya göl olur. Her gün çözdüğün 10 soru bile seni binlerce kişinin önüne geçirecektir.",
    author: "Sınav Tavsiyesi"
  },
  {
    text: "Büyük işler, büyük hayallerle değil, küçük adımların sürekliliğiyle gerçekleştirilir.",
    author: "Atasözü"
  },
  {
    text: "Zorluklar, başarıyı daha değerli kılan süslerdir.",
    author: "Doğan Cüceloğlu"
  }
];

export const EXAM_STUDY_ADVICE = {
  "ata-aof": [
    "Son 5 yılın çıkmış final sorularını mutlaka çözün. ATA AÖF sınavlarında benzer soru formatları sıklıkla karşımıza çıkar.",
    "Özet dokümanları ve ünite sonlarındaki değerlendirme soruları sınavın can damarıdır.",
    "Bütünleme sınavına kalmadan dersi geçmek için vize notunuzun etkisini hesaplayarak hedef final notunuzu belirleyin."
  ],
  "kpss-onlisans": [
    "Soru dağılımına dikkat edin! Tarih (27 soru) ve Matematik-Türkçe (30'ar soru) en büyük puan ağırlığına sahiptir.",
    "Haftada en az 2 gün genel deneme sınavı çözün ve her deneme sonrasında mutlaka yanlış analizlerinizi yapın.",
    "Son aylarda Güncel Bilgiler testine ağırlık verin, son 6-8 aya ait ulusal ve uluslararası önemli haberleri listeleyin."
  ]
};
