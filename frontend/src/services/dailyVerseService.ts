export interface FeaturedVerse {
  surahNumber: number;
  verseNumber: number;
  surahNameLatin: string;
  surahNameArabic: string;
  textArabic: string;
  textLatin: string;
  translation: string;
  audioUrl: string;
  themeNote: string;
}

const FEATURED_VERSES: FeaturedVerse[] = [
  {
    surahNumber: 2,
    verseNumber: 255,
    surahNameLatin: 'Al-Baqarah',
    surahNameArabic: 'البقرة',
    textArabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    textLatin: "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta'khużuhū sinatuw wa lā naūm, lahū mā fis-samāwāti wa mā fil-arḍ...",
    translation: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, yang terus-menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi...',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3',
    themeNote: 'Keagungan dan Perlindungan Allah (Ayat Kursi)',
  },
  {
    surahNumber: 94,
    verseNumber: 5,
    surahNameLatin: 'Al-Inshirah',
    surahNameArabic: 'الشرح',
    textArabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    textLatin: "Fa inna ma'al-'usri yusrā. Inna ma'al-'usri yusrā.",
    translation: 'Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya bersama kesulitan ada kemudahan.',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/094005.mp3',
    themeNote: 'Optimisme dan Kemudahan',
  },
  {
    surahNumber: 3,
    verseNumber: 139,
    surahNameLatin: "Ali 'Imran",
    surahNameArabic: 'آل عمران',
    textArabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنْتُمُ الْأَعْلَوْنَ إِنْ كُنْتُمْ مُؤْمِنِينَ',
    textLatin: 'Wa lā tahinū wa lā taḥzanū wa antumul-a\'lawna in kuntum mu\'minīn.',
    translation: 'Dan janganlah kamu (merasa) lemah, dan jangan (pula) kamu bersedih hati, sebab kamu paling tinggi (derajatnya), jika kamu orang beriman.',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/003139.mp3',
    themeNote: 'Keteguhan Hati & Keimanan',
  },
  {
    surahNumber: 39,
    verseNumber: 53,
    surahNameLatin: 'Az-Zumar',
    surahNameArabic: 'الزمر',
    textArabic: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنْفُسِهِمْ لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ',
    textLatin: "Qul yā 'ibādiyal-lażīna asrafū 'alā anfusihim lā taqnaṭū mir raḥmatillāh, innallāha yaghfiruż-żunūba jamī'ā, innahū huwal-ghafūrur-raḥīm.",
    translation: 'Katakanlah: Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri! Janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya...',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/039053.mp3',
    themeNote: 'Rahmat dan Ampunan Allah',
  },
  {
    surahNumber: 2,
    verseNumber: 286,
    surahNameLatin: 'Al-Baqarah',
    surahNameArabic: 'البقرة',
    textArabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا',
    textLatin: "Lā yukallifullāhu nafsan illā wus'ahā, lahā mā kasabat wa 'alaihā maktasabat, rabbanā lā tu'ākhiżnā in nasīnā au akhṭa'nā...",
    translation: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya. Dia mendapat (pahala) dari (kebajikan) yang dikerjakannya dan dia mendapat (siksa) dari (kejahatan) yang diperbuatnya...',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002286.mp3',
    themeNote: 'Kemampuan dan Kesanggupan Diri',
  },
  {
    surahNumber: 2,
    verseNumber: 153,
    surahNameLatin: 'Al-Baqarah',
    surahNameArabic: 'البقرة',
    textArabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    textLatin: "Yā ayyuhallażīna āmanustacīnū biṣ-ṣabri waṣ-ṣalāh, innallāha ma'aṣ-ṣābirīn.",
    translation: 'Wahai orang-orang yang beriman! Mohonlah pertolongan (kepada Allah) dengan sabar dan shalat. Sungguh, Allah beserta orang-orang yang sabar.',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002153.mp3',
    themeNote: 'Kekuatan Sabar & Shalat',
  },
  {
    surahNumber: 65,
    verseNumber: 2,
    surahNameLatin: 'At-Talaq',
    surahNameArabic: 'الطلاق',
    textArabic: 'وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا • وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    textLatin: "Wa may yattaqillāha yaj'al lahū makhrajā, wa yarzuqhu min ḥaisus lā yaḥtasib.",
    translation: 'Barangsiapa bertakwa kepada Allah niscaya Dia akan membukakan jalan keluar baginya, dan Dia memberinya rezeki dari arah yang tidak disangka-sangkanya.',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/065002.mp3',
    themeNote: 'Keutamaan Takwa & Rezeki',
  },
];

export function getDailyFeaturedVerse(): FeaturedVerse {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const index = dayOfYear % FEATURED_VERSES.length;
  return FEATURED_VERSES[index];
}
