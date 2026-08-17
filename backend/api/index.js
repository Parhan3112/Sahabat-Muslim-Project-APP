import Fastify from 'fastify';

const app = Fastify({ logger: false });

// 1. Health
app.get('/api/v1/health', async () => {
  return { status: 'OK', message: 'Sahabat Muslim Backend API Running on Vercel' };
});

// 2. Quran List
app.get('/api/v1/quran/surah', async () => {
  const res = await fetch('https://equran.id/api/v2/surat');
  const json = await res.json();
  const list = json.data || [];
  return {
    data: list.map((item) => ({
      number: item.nomor,
      nameLatin: item.namaLatin,
      nameArabic: item.nama,
      numberOfVerses: item.jumlahAyat,
      translation: item.arti,
    })),
  };
});

// 3. Quran Detail
app.get('/api/v1/quran/surah/:num', async (req) => {
  const num = req.params.num;
  const res = await fetch(`https://equran.id/api/v2/surat/${num}`);
  const json = await res.json();
  const d = json.data;
  if (!d) return { error: 'Not found' };
  return {
    data: {
      number: d.nomor,
      nameLatin: d.namaLatin,
      nameArabic: d.nama,
      numberOfVerses: d.jumlahAyat,
      translation: d.arti,
      verses: (d.ayat || []).map((v) => ({
        verseNumber: v.nomorAyat,
        textArabic: v.teksArab,
        textLatin: v.teksLatin,
        translation: v.teksIndonesia,
        audioUrl: v.audio?.['05'] || v.audio?.['01'] || '',
      })),
    },
  };
});

export default async function handler(req, res) {
  await app.ready();
  app.server.emit('request', req, res);
}
