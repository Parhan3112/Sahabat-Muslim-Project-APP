export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const url = req.url || '';

  try {
    // 1. Quran Surah List
    if (url.includes('/quran/surah/') || (url.includes('/quran/surah') && url.split('/quran/surah')[1].length > 1)) {
      const parts = url.split('/quran/surah/')[1];
      const num = parts ? parts.split('?')[0] : '1';
      const qRes = await fetch(`https://equran.id/api/v2/surat/${num}`);
      const qJson = await qRes.json();
      const d = qJson.data;
      if (!d) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Surah not found' }));
      }
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

    if (url.includes('/quran/surah')) {
      const qRes = await fetch('https://equran.id/api/v2/surat');
      const qJson = await qRes.json();
      const list = qJson.data || [];
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

    // 2. Health Check
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
    return res.end(JSON.stringify({ error: err.message }));
  }
}
