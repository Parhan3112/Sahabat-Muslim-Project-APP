export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    const url = req.url || '';
    const parts = url.split('?')[0].split('/');
    const surahNum = parts[parts.length - 1];

    if (surahNum && !isNaN(Number(surahNum))) {
      const qRes = await fetch(`https://equran.id/api/v2/surat/${surahNum}`);
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
  } catch (err) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: err.message }));
  }
}
