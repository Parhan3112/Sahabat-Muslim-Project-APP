export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      return res.end();
    }

    const url = req.url || '';

    // 1. Quran Detail: /api/v1/quran/surah/:num
    if (url.includes('/quran/surah/')) {
      const parts = url.split('/quran/surah/')[1] || '';
      const num = parts.split('?')[0] || '1';
      const qRes = await fetch(`https://equran.id/api/v2/surat/${num}`);
      const qJson = await qRes.json();
      const d = qJson.data;
      if (!d) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Surah not found' }));
      }
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
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
        })
      );
    }

    // 2. Quran Surah List: /api/v1/quran/surah
    if (url.includes('/quran/surah')) {
      const qRes = await fetch('https://equran.id/api/v2/surat');
      const qJson = await qRes.json();
      const list = qJson.data || [];
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          data: list.map((item) => ({
            number: item.nomor,
            nameLatin: item.namaLatin,
            nameArabic: item.nama,
            numberOfVerses: item.jumlahAyat,
            translation: item.arti,
          })),
        })
      );
    }

    // 3. Health Check
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        status: 'OK',
        service: 'Sahabat Muslim Backend API',
        timestamp: new Date().toISOString(),
      })
    );
  } catch (err) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: err?.message || 'Internal Error' }));
  }
}
