export interface LocationInfo {
  name: string;
  lat: number;
  lng: number;
  isGPS?: boolean;
}

export const INDONESIA_CITIES: LocationInfo[] = [
  { name: 'DKI Jakarta & Sekitarnya', lat: -6.2088, lng: 106.8456 },
  { name: 'Bandung & Jawa Barat', lat: -6.9175, lng: 107.6191 },
  { name: 'Surabaya & Jawa Timur', lat: -7.2575, lng: 112.7521 },
  { name: 'Medan & Sumatera Utara', lat: 3.5952, lng: 98.6722 },
  { name: 'Semarang & Jawa Tengah', lat: -6.9667, lng: 110.4167 },
  { name: 'DI Yogyakarta', lat: -7.7956, lng: 110.3695 },
  { name: 'Makassar & Sulawesi Selatan', lat: -5.1477, lng: 119.4327 },
  { name: 'Malang & Sekitarnya', lat: -7.9666, lng: 112.6326 },
  { name: 'Palembang & Sumatera Selatan', lat: -2.9761, lng: 104.7754 },
  { name: 'Denpasar, Bali', lat: -8.6705, lng: 115.2126 },
  { name: 'Banda Aceh & Aceh', lat: 5.5483, lng: 95.3238 },
];

const STORAGE_KEY = 'sm_user_location';

export function getSavedLocation(): LocationInfo {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (_e) {
      // ignore
    }
  }
  return INDONESIA_CITIES[0]; // Default Jakarta
}

export function saveLocation(location: LocationInfo): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
}

export function requestGPSLocation(): Promise<LocationInfo> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Fitur GPS tidak didukung di browser ini.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: LocationInfo = {
          name: 'Lokasi Anda (GPS Presisi)',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isGPS: true,
        };
        saveLocation(loc);
        resolve(loc);
      },
      (error) => {
        let msg = 'Gagal mengambil lokasi GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Safari iOS membatasi akses GPS pada koneksi lokal HTTP. Silakan pilih lokasi kota di bawah atau gunakan HTTPS saat online.';
        }
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}
