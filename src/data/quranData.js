// ============================================
// QURAN DATA — Juz, Surah, Pages & Motivation
// ============================================

export const TOTAL_PAGES = 604;
export const TOTAL_JUZ = 30;
export const PAGES_PER_JUZ = 20; // approximately

// Mapping of 30 Juz with starting surah/ayat info
export const juzData = [
  { juz: 1, surah: "Al-Fatihah - Al-Baqarah", ayat: "1:1 - 2:141", pages: 20 },
  { juz: 2, surah: "Al-Baqarah", ayat: "2:142 - 2:252", pages: 20 },
  { juz: 3, surah: "Al-Baqarah - Ali 'Imran", ayat: "2:253 - 3:92", pages: 20 },
  { juz: 4, surah: "Ali 'Imran - An-Nisa'", ayat: "3:93 - 4:23", pages: 20 },
  { juz: 5, surah: "An-Nisa'", ayat: "4:24 - 4:147", pages: 20 },
  { juz: 6, surah: "An-Nisa' - Al-Ma'idah", ayat: "4:148 - 5:81", pages: 20 },
  { juz: 7, surah: "Al-Ma'idah - Al-An'am", ayat: "5:82 - 6:110", pages: 20 },
  { juz: 8, surah: "Al-An'am - Al-A'raf", ayat: "6:111 - 7:87", pages: 20 },
  { juz: 9, surah: "Al-A'raf - Al-Anfal", ayat: "7:88 - 8:40", pages: 20 },
  { juz: 10, surah: "Al-Anfal - At-Taubah", ayat: "8:41 - 9:92", pages: 20 },
  { juz: 11, surah: "At-Taubah - Hud", ayat: "9:93 - 11:5", pages: 20 },
  { juz: 12, surah: "Hud - Yusuf", ayat: "11:6 - 12:52", pages: 20 },
  { juz: 13, surah: "Yusuf - Ibrahim", ayat: "12:53 - 14:52", pages: 20 },
  { juz: 14, surah: "Al-Hijr - An-Nahl", ayat: "15:1 - 16:128", pages: 20 },
  { juz: 15, surah: "Al-Isra' - Al-Kahf", ayat: "17:1 - 18:74", pages: 21 },
  { juz: 16, surah: "Al-Kahf - Taha", ayat: "18:75 - 20:135", pages: 20 },
  { juz: 17, surah: "Al-Anbiya' - Al-Hajj", ayat: "21:1 - 22:78", pages: 20 },
  { juz: 18, surah: "Al-Mu'minun - Al-Furqan", ayat: "23:1 - 25:20", pages: 20 },
  { juz: 19, surah: "Al-Furqan - An-Naml", ayat: "25:21 - 27:55", pages: 20 },
  { juz: 20, surah: "An-Naml - Al-'Ankabut", ayat: "27:56 - 29:45", pages: 20 },
  { juz: 21, surah: "Al-'Ankabut - Al-Ahzab", ayat: "29:46 - 33:30", pages: 20 },
  { juz: 22, surah: "Al-Ahzab - Ya-Sin", ayat: "33:31 - 36:27", pages: 20 },
  { juz: 23, surah: "Ya-Sin - Az-Zumar", ayat: "36:28 - 39:31", pages: 20 },
  { juz: 24, surah: "Az-Zumar - Fussilat", ayat: "39:32 - 41:46", pages: 20 },
  { juz: 25, surah: "Fussilat - Al-Jasiyah", ayat: "41:47 - 45:37", pages: 20 },
  { juz: 26, surah: "Al-Ahqaf - Az-Zariyat", ayat: "46:1 - 51:30", pages: 20 },
  { juz: 27, surah: "Az-Zariyat - Al-Hadid", ayat: "51:31 - 57:29", pages: 20 },
  { juz: 28, surah: "Al-Mujadalah - At-Tahrim", ayat: "58:1 - 66:12", pages: 21 },
  { juz: 29, surah: "Al-Mulk - Al-Mursalat", ayat: "67:1 - 77:50", pages: 20 },
  { juz: 30, surah: "An-Naba' - An-Nas", ayat: "78:1 - 114:6", pages: 23 },
];

// Motivational quotes — ayat and hadith about Al-Qur'an
export const motivationQuotes = [
  {
    arabic: "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
    translation: "Dan bacalah Al-Qur'an dengan tartil (perlahan-lahan).",
    source: "QS. Al-Muzzammil: 4"
  },
  {
    arabic: "إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ",
    translation: "Sesungguhnya Al-Qur'an ini memberikan petunjuk kepada (jalan) yang lebih lurus.",
    source: "QS. Al-Isra': 9"
  },
  {
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    translation: "Sebaik-baik kalian adalah yang mempelajari Al-Qur'an dan mengajarkannya.",
    source: "HR. Bukhari"
  },
  {
    arabic: "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ",
    translation: "Bacalah Al-Qur'an, karena ia akan datang pada hari kiamat sebagai pemberi syafaat bagi pembacanya.",
    source: "HR. Muslim"
  },
  {
    arabic: "الَّذِي يَقْرَأُ الْقُرْآنَ وَهُوَ مَاهِرٌ بِهِ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ",
    translation: "Yang mahir membaca Al-Qur'an, ia bersama para malaikat yang mulia lagi berbakti.",
    source: "HR. Bukhari & Muslim"
  },
  {
    arabic: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
    translation: "Dan sungguh, telah Kami mudahkan Al-Qur'an untuk peringatan, maka adakah orang yang mengambil pelajaran?",
    source: "QS. Al-Qamar: 17"
  },
  {
    arabic: "فَإِذَا قَرَأْتَ الْقُرْآنَ فَاسْتَعِذْ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    translation: "Maka apabila engkau membaca Al-Qur'an, mohonlah perlindungan kepada Allah dari setan yang terkutuk.",
    source: "QS. An-Nahl: 98"
  },
  {
    arabic: "إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ وَأَنفَقُوا مِمَّا رَزَقْنَاهُمْ سِرًّا وَعَلَانِيَةً يَرْجُونَ تِجَارَةً لَّن تَبُورَ",
    translation: "Sesungguhnya orang-orang yang selalu membaca kitab Allah dan melaksanakan shalat... mereka mengharapkan perdagangan yang tidak akan rugi.",
    source: "QS. Fatir: 29"
  },
  {
    arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    translation: "Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan.",
    source: "QS. Al-'Alaq: 1"
  },
  {
    arabic: "يَا أَيُّهَا النَّاسُ قَدْ جَاءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَاءٌ لِّمَا فِي الصُّدُورِ",
    translation: "Wahai manusia! Sungguh, telah datang kepadamu pelajaran dari Tuhanmu, dan penyembuh bagi penyakit yang ada dalam dada.",
    source: "QS. Yunus: 57"
  },
];

// Badge definitions
export const badgeDefinitions = [
  {
    id: "first_read",
    name: "Langkah Pertama",
    description: "Mencatat bacaan pertama",
    icon: "📖",
    condition: (progress) => progress.totalPagesRead > 0,
  },
  {
    id: "fajr_reciter",
    name: "Fajr Reciter",
    description: "Tilawah sebelum jam 6 pagi",
    icon: "🌅",
    condition: (progress) => progress.fajrReadCount >= 1,
  },
  {
    id: "streak_3",
    name: "Istiqomah 3 Hari",
    description: "3 hari berturut-turut",
    icon: "🔥",
    condition: (progress) => progress.currentStreak >= 3,
  },
  {
    id: "streak_7",
    name: "Pejuang 7 Hari",
    description: "7 hari berturut-turut",
    icon: "⭐",
    condition: (progress) => progress.currentStreak >= 7,
  },
  {
    id: "juz_5",
    name: "5 Juz Selesai",
    description: "Menyelesaikan 5 Juz",
    icon: "📚",
    condition: (progress) => progress.completedJuz >= 5,
  },
  {
    id: "halfway",
    name: "Halfway There",
    description: "Mencapai Juz 15",
    icon: "🏔️",
    condition: (progress) => progress.completedJuz >= 15,
  },
  {
    id: "streak_14",
    name: "2 Minggu Konsisten",
    description: "14 hari berturut-turut",
    icon: "💎",
    condition: (progress) => progress.currentStreak >= 14,
  },
  {
    id: "juz_20",
    name: "20 Juz Champion",
    description: "Menyelesaikan 20 Juz",
    icon: "🏆",
    condition: (progress) => progress.completedJuz >= 20,
  },
  {
    id: "streak_30",
    name: "Sebulan Penuh",
    description: "30 hari berturut-turut",
    icon: "👑",
    condition: (progress) => progress.currentStreak >= 30,
  },
  {
    id: "khatam",
    name: "Khatam!",
    description: "Menyelesaikan 30 Juz",
    icon: "🌟",
    condition: (progress) => progress.completedJuz >= 30,
  },
];

// Level definitions
export const levelDefinitions = [
  { name: "Mubtadi", minXP: 0, icon: "🌱" },
  { name: "Qari Muda", minXP: 100, icon: "📗" },
  { name: "Qari", minXP: 300, icon: "📘" },
  { name: "Qari Mahir", minXP: 600, icon: "📕" },
  { name: "Hafiz Friendly", minXP: 1000, icon: "🌟" },
];

// Helper: get random motivation quote
export function getRandomQuote() {
  return motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
}

// Helper: get today's date string YYYY-MM-DD
export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

// Helper: calculate XP from progress
export function calculateXP(progress) {
  let xp = 0;
  xp += (progress.totalPagesRead || 0) * 1;       // 1 XP per page
  xp += (progress.currentStreak || 0) * 5;          // 5 XP per streak day
  xp += (progress.completedJuz || 0) * 20;          // 20 XP per juz
  return xp;
}

// Helper: get current level from XP
export function getLevel(xp) {
  let current = levelDefinitions[0];
  let next = levelDefinitions[1];
  for (let i = 0; i < levelDefinitions.length; i++) {
    if (xp >= levelDefinitions[i].minXP) {
      current = levelDefinitions[i];
      next = levelDefinitions[i + 1] || null;
    }
  }
  return { current, next, xp };
}
