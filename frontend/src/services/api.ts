const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiService = {
  // 1. Health
  async getHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return (await res.json()) as any;
  },

  // 2. Auth
  async register(data: { email: string; password: string; name: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error(json.error?.message || 'Gagal mendaftar');
    return json;
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error(json.error?.message || 'Gagal masuk');
    return json;
  },

  // 3. User Profile
  async getProfile(token: string) {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error(json.error?.message || 'Gagal memuat profil');
    return json.user;
  },

  // 4. Al-Qur'an
  async getAllSurahs() {
    const res = await fetch(`${API_BASE_URL}/quran/surah`);
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error('Gagal memuat daftar Surah');
    return json.data;
  },

  async getSurahDetail(surahNumber: number) {
    const res = await fetch(`${API_BASE_URL}/quran/surah/${surahNumber}`);
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error('Gagal memuat detail Surah');
    return json.data;
  },

  // 5. Prayer Times
  async getTodayPrayerTimes(latitude: number, longitude: number) {
    const res = await fetch(`${API_BASE_URL}/prayer-times/today?latitude=${latitude}&longitude=${longitude}`);
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error('Gagal memuat jadwal sholat');
    return json.data;
  },

  async getMonthlyPrayerTimes(latitude: number, longitude: number, month: number, year: number) {
    const res = await fetch(
      `${API_BASE_URL}/prayer-times/monthly?latitude=${latitude}&longitude=${longitude}&month=${month}&year=${year}`
    );
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error('Gagal memuat jadwal sholat bulanan');
    return json.data;
  },

  // 6. Qibla Direction
  async getQiblaDirection(latitude: number, longitude: number) {
    const res = await fetch(`${API_BASE_URL}/qibla?latitude=${latitude}&longitude=${longitude}`);
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error('Gagal memuat arah kiblat');
    return json.data;
  },

  // 7. Bookmarks
  async getBookmarks(token: string) {
    const res = await fetch(`${API_BASE_URL}/bookmarks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error('Gagal memuat bookmark');
    return json.bookmarks;
  },

  async createBookmark(token: string, data: { surahNumber: number; verseNumber: number; surahNameLatin: string }) {
    const res = await fetch(`${API_BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error('Gagal menambah bookmark');
    return json.bookmark;
  },

  async deleteBookmark(token: string, id: string) {
    const res = await fetch(`${API_BASE_URL}/bookmarks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error('Gagal menghapus bookmark');
    return json;
  },

  // 8. Reading Progress
  async getReadingProgress(token: string) {
    const res = await fetch(`${API_BASE_URL}/reading-progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error('Gagal memuat progress membaca');
    return json.progress;
  },

  async updateReadingProgress(token: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/reading-progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error('Gagal memperbarui progress membaca');
    return json.progress;
  },

  // 9. Nearby Mosques
  async getNearbyMosques(latitude: number, longitude: number, radius = 5000) {
    const res = await fetch(`${API_BASE_URL}/mosques/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error('Gagal memuat masjid terdekat');
    return json.mosques;
  },

  // 10. Dzikir & Doa
  async getDzikirList(category: 'pagi' | 'petang' | 'doa-harian') {
    const res = await fetch(`${API_BASE_URL}/dzikir/${category}`);
    const json = (await res.json()) as any;
    if (!res.ok) throw new Error('Gagal memuat daftar dzikir');
    return json.items;
  },
};
