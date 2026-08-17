export interface PrayerTimings {
  imsak: string;
  subuh: string;
  terbit: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface DateInfo {
  masehi: string;
  hijriah: string;
  fullFormatted: string;
  timezone: string;
}

export interface TodayPrayerResponse {
  location: {
    latitude: number;
    longitude: number;
  };
  date: DateInfo;
  timings: PrayerTimings;
}

const HIJRI_MONTHS_ID: { [key: number]: string } = {
  1: 'Muharram',
  2: 'Safar',
  3: 'Rabiul Awal',
  4: 'Rabiul Akhir',
  5: 'Jumadil Awal',
  6: 'Jumadil Akhir',
  7: 'Rajab',
  8: "Sya'ban",
  9: 'Ramadhan',
  10: 'Syawal',
  11: "Dzulqa'dah",
  12: 'Dzulhijjah',
};

const DAYS_ID: { [key: string]: string } = {
  Sunday: 'Minggu',
  Monday: 'Senin',
  Tuesday: 'Selasa',
  Wednesday: 'Rabu',
  Thursday: 'Kamis',
  Friday: 'Jumat',
  Saturday: 'Sabtu',
};

const MONTHS_ID: { [key: string]: string } = {
  January: 'Januari',
  February: 'Februari',
  March: 'Maret',
  April: 'April',
  May: 'Mei',
  June: 'Juni',
  July: 'Juli',
  August: 'Agustus',
  September: 'September',
  October: 'Oktober',
  November: 'November',
  December: 'Desember',
};

function formatIndonesianDates(dateData: any): DateInfo {
  let hijriDayNum = parseInt(dateData.hijri.day, 10);
  let hijriMonthNum = dateData.hijri.month.number;
  let hijriYearNum = parseInt(dateData.hijri.year, 10);

  // Apply Kemenag Indonesia Hijri -1 day offset adjustment
  hijriDayNum = hijriDayNum - 1;
  if (hijriDayNum < 1) {
    hijriDayNum = 29;
    hijriMonthNum = hijriMonthNum === 1 ? 12 : hijriMonthNum - 1;
    if (hijriMonthNum === 12) hijriYearNum -= 1;
  }

  const hijriMonthName = HIJRI_MONTHS_ID[hijriMonthNum] || dateData.hijri.month.en;
  const hijriFormatted = `${hijriDayNum} ${hijriMonthName} ${hijriYearNum} H`;

  const dayEn = dateData.gregorian.weekday.en;
  const dayId = DAYS_ID[dayEn] || dayEn;
  const monthEn = dateData.gregorian.month.en;
  const monthId = MONTHS_ID[monthEn] || monthEn;

  const masehiFormatted = `${dayId}, ${dateData.gregorian.day} ${monthId} ${dateData.gregorian.year}`;
  const fullFormatted = `${masehiFormatted} • ${hijriFormatted}`;

  return {
    masehi: masehiFormatted,
    hijriah: hijriFormatted,
    fullFormatted,
    timezone: '',
  };
}

export async function getTodayPrayerTimes(latitude: number, longitude: number): Promise<TodayPrayerResponse> {
  try {
    const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=20`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch prayer times from Aladhan API: ${res.statusText}`);
    }
    const json = (await res.json()) as any;
    const data = json.data;
    const timings = data.timings;
    const date = data.date;

    const formattedDates = formatIndonesianDates(date);
    formattedDates.timezone = data.meta.timezone;

    return {
      location: {
        latitude,
        longitude,
      },
      date: formattedDates,
      timings: {
        imsak: timings.Imsak,
        subuh: timings.Fajr,
        terbit: timings.Sunrise,
        dzuhur: timings.Dhuhr,
        ashar: timings.Asr,
        maghrib: timings.Maghrib,
        isya: timings.Isha,
      },
    };
  } catch (err: any) {
    const error: any = new Error(err.message || 'Gagal mengambil data jadwal sholat');
    error.statusCode = 502;
    error.code = 'PRAYER_TIMES_API_ERROR';
    throw error;
  }
}

export async function getMonthlyPrayerTimes(
  latitude: number,
  longitude: number,
  month: number,
  year: number
) {
  try {
    const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=20`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch monthly prayer times: ${res.statusText}`);
    }
    const json = (await res.json()) as any;

    return (json.data || []).map((dayData: any) => {
      const formattedDates = formatIndonesianDates(dayData.date);
      return {
        date: formattedDates,
        timings: {
          imsak: dayData.timings.Imsak,
          subuh: dayData.timings.Fajr,
          terbit: dayData.timings.Sunrise,
          dzuhur: dayData.timings.Dhuhr,
          ashar: dayData.timings.Asr,
          maghrib: dayData.timings.Maghrib,
          isya: dayData.timings.Isha,
        },
      };
    });
  } catch (err: any) {
    const error: any = new Error(err.message || 'Gagal mengambil data jadwal sholat bulanan');
    error.statusCode = 502;
    error.code = 'PRAYER_TIMES_API_ERROR';
    throw error;
  }
}
