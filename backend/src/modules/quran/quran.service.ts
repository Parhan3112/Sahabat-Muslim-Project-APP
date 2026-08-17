export interface SurahListItem {
  number: number;
  nameArabic: string;
  nameLatin: string;
  numberOfVerses: number;
  revelationType: string;
  translation: string;
  description?: string;
  audioFull?: Record<string, string>;
}

export interface VerseItem {
  verseNumber: number;
  textArabic: string;
  textLatin: string;
  translation: string;
  audioUrl?: string;
}

export interface SurahDetail extends SurahListItem {
  verses: VerseItem[];
}

export async function getAllSurahs(): Promise<SurahListItem[]> {
  try {
    const res = await fetch('https://equran.id/api/v2/surat');
    if (!res.ok) {
      throw new Error(`Failed to fetch Quran surahs: ${res.statusText}`);
    }
    const json = (await res.json()) as any;
    
    return json.data.map((item: any) => ({
      number: item.nomor,
      nameArabic: item.nama,
      nameLatin: item.namaLatin,
      numberOfVerses: item.jumlahAyat,
      revelationType: item.tempatTurun,
      translation: item.arti,
      description: item.deskripsi,
      audioFull: item.audioFull,
    }));
  } catch (err: any) {
    const error: any = new Error(err.message || 'Gagal mengambil data daftar Surah Al-Qur\'an');
    error.statusCode = 502;
    error.code = 'QURAN_API_ERROR';
    throw error;
  }
}

export async function getSurahDetail(surahNumber: number): Promise<SurahDetail> {
  if (surahNumber < 1 || surahNumber > 114) {
    const error: any = new Error('Nomor Surah harus berada di antara 1 dan 114');
    error.statusCode = 400;
    error.code = 'INVALID_SURAH_NUMBER';
    throw error;
  }

  try {
    const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch Surah detail: ${res.statusText}`);
    }
    const json = (await res.json()) as any;
    const data = json.data;

    return {
      number: data.nomor,
      nameArabic: data.nama,
      nameLatin: data.namaLatin,
      numberOfVerses: data.jumlahAyat,
      revelationType: data.tempatTurun,
      translation: data.arti,
      description: data.deskripsi,
      audioFull: data.audioFull,
      verses: (data.ayat || []).map((v: any) => ({
        verseNumber: v.nomorAyat,
        textArabic: v.teksArab,
        textLatin: v.teksLatin,
        translation: v.teksIndonesia,
        audioUrl: v.audio?.['05'] || v.audio?.['01'] || '',
      })),
    };
  } catch (err: any) {
    if (err.statusCode) throw err;
    const error: any = new Error(err.message || `Gagal mengambil data Surah nomor ${surahNumber}`);
    error.statusCode = 502;
    error.code = 'QURAN_API_ERROR';
    throw error;
  }
}
