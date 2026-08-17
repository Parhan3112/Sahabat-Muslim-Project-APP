import React, { useEffect, useState } from 'react';
import { BookOpen, Calendar, ChevronRight, Clock, Compass, HeartHandshake, MapPin, Navigation, Pause, Sparkles, Volume2 } from 'lucide-react';
import { apiService } from '../services/api';
import { getDailyFeaturedVerse } from '../services/dailyVerseService';
import { INDONESIA_CITIES, LocationInfo, requestGPSLocation, saveLocation } from '../services/locationService';

interface HomeTabProps {
  onNavigate: (tab: 'home' | 'quran' | 'prayer' | 'dzikir' | 'qibla' | 'profile') => void;
  onOpenSurah: (surahNum: number) => void;
  onOpenMosquesModal: () => void;
  theme: string;
  onToggleTheme: () => void;
  currentLocation: LocationInfo;
  onLocationChange: (loc: LocationInfo) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onNavigate,
  onOpenSurah,
  onOpenMosquesModal,
  currentLocation,
  onLocationChange,
}) => {
  const [todayPrayer, setTodayPrayer] = useState<any>(null);
  const [nextPrayerName, setNextPrayerName] = useState<string>('Subuh');
  const [nextPrayerTime, setNextPrayerTime] = useState<string>('--:--');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string>('');

  // Live Digital Clock state (HH:mm:ss WIB)
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');

  const featuredVerse = getDailyFeaturedVerse();

  // 1. Live 1-Second Digital Clock Timer
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      // Format HH:mm:ss WIB
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTimeStr(`${hours}:${minutes}:${seconds} WIB`);

      // Format Indonesian Date (e.g. "Senin, 17 Agustus 2026")
      const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const MONTHS_ID = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const dayName = DAYS_ID[now.getDay()];
      const dayNum = now.getDate();
      const monthName = MONTHS_ID[now.getMonth()];
      const yearNum = now.getFullYear();

      const masehiStr = `${dayName}, ${dayNum} ${monthName} ${yearNum}`;
      setCurrentDateStr(masehiStr);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Load Prayer Times for current location
  useEffect(() => {
    let isSubscribed = true;

    async function loadPrayer() {
      try {
        const res = await apiService.getTodayPrayerTimes(currentLocation.lat, currentLocation.lng);
        if (isSubscribed) {
          setTodayPrayer(res);
          determineNextPrayer(res.timings);
        }
      } catch (err) {
        console.error('Failed to load today prayer times:', err);
      }
    }

    loadPrayer();

    return () => {
      isSubscribed = false;
    };
  }, [currentLocation]);

  const determineNextPrayer = (timings: any) => {
    if (!timings) return;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const parseTime = (timeStr: string) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const prayerList = [
      { name: 'Subuh', time: timings.subuh },
      { name: 'Dzuhur', time: timings.dzuhur },
      { name: 'Ashar', time: timings.ashar },
      { name: 'Maghrib', time: timings.maghrib },
      { name: 'Isya', time: timings.isya },
    ];

    for (const p of prayerList) {
      if (parseTime(p.time) > currentMinutes) {
        setNextPrayerName(p.name);
        setNextPrayerTime(p.time);
        return;
      }
    }

    setNextPrayerName('Subuh (Besok)');
    setNextPrayerTime(timings.subuh || '04:35');
  };

  const toggleFeaturedAudio = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (audioObj) {
      audioObj.pause();
    }

    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }

    const audio = new Audio(featuredVerse.audioUrl);
    audio.play();
    setIsPlayingAudio(true);
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => {
      setIsPlayingAudio(false);
      alert('Gagal memutar audio. Pastikan koneksi internet aktif.');
    };
    setAudioObj(audio);
  };

  const handleSelectCity = (city: LocationInfo) => {
    saveLocation(city);
    onLocationChange(city);
    setShowLocationModal(false);
  };

  const handleUseGPS = async () => {
    setGpsError('');
    setGpsLoading(true);
    try {
      const gpsLoc = await requestGPSLocation();
      onLocationChange(gpsLoc);
      setShowLocationModal(false);
    } catch (err: any) {
      setGpsError(err.message || 'Gagal mengaktifkan GPS');
    } finally {
      setGpsLoading(false);
    }
  };

  const displayDateHeader = todayPrayer?.date?.fullFormatted ||
    (todayPrayer?.date?.hijriah ? `${currentDateStr} • ${todayPrayer.date.hijriah}` : currentDateStr);

  return (
    <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header with Live Realtime Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--gold-accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={14} />
            <span>{displayDateHeader}</span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            Sahabat Muslim 🌙
          </h1>
        </div>

        {/* Location Selector Pill */}
        <button
          onClick={() => setShowLocationModal(true)}
          className="glass-card"
          style={{
            padding: '6px 12px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--gold-accent)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <MapPin size={14} color="var(--gold-accent)" />
          <span>{currentLocation.name.split('&')[0].trim()}</span>
        </button>
      </div>

      {/* Hero Card with Live Digital Clock & Next Prayer */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 20px',
          background: 'linear-gradient(135deg, rgba(15, 81, 50, 0.95) 0%, rgba(5, 46, 22, 0.98) 100%)',
          border: '1px solid var(--gold-accent)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '20px',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--gold-accent)', fontWeight: 800 }}>
              Jadwal Sholat & Waktu Realtime ⏱️
            </span>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', backgroundColor: 'rgba(212, 175, 55, 0.25)', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--gold-accent)' }}>
              {currentTimeStr || 'Memuat Jam...'}
            </div>
          </div>

          <div style={{ fontSize: '2.2rem', fontWeight: 800, margin: '10px 0 6px 0', color: '#ffffff' }}>
            {nextPrayerName} • <span style={{ color: 'var(--gold-accent)' }}>{nextPrayerTime}</span>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="var(--gold-accent)" />
            <span>Lokasi: {currentLocation.name} (Kemenag RI)</span>
          </div>
        </div>
      </div>

      {/* Full 5-Prayer Timetable Grid Card (Sleek & Immediate) */}
      <div className="glass-panel" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gold-accent)' }}>
            🕌 Jadwal Sholat Hari Ini
          </span>
          <button
            onClick={() => onNavigate('prayer')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            <span>Lengkap</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          {[
            { name: 'Subuh', time: todayPrayer?.timings?.subuh || '04:35' },
            { name: 'Dzuhur', time: todayPrayer?.timings?.dzuhur || '12:00' },
            { name: 'Ashar', time: todayPrayer?.timings?.ashar || '15:15' },
            { name: 'Maghrib', time: todayPrayer?.timings?.maghrib || '18:05' },
            { name: 'Isya', time: todayPrayer?.timings?.isya || '19:15' },
          ].map((item) => {
            const isNext = item.name === nextPrayerName || (nextPrayerName.startsWith('Subuh') && item.name === 'Subuh');
            return (
              <div
                key={item.name}
                style={{
                  padding: '10px 4px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  backgroundColor: isNext ? 'rgba(212, 175, 55, 0.22)' : 'var(--bg-input)',
                  border: isNext ? '1px solid var(--gold-accent)' : '1px solid var(--border-color)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: isNext ? 'var(--gold-accent)' : 'var(--text-muted)' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isNext ? '#ffffff' : 'var(--text-main)', marginTop: '4px' }}>
                  {item.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ayat Pilihan Hari Ini */}
      <div
        className="glass-panel"
        onClick={() => onOpenSurah(featuredVerse.surahNumber)}
        style={{
          padding: '20px',
          cursor: 'pointer',
          border: '1px solid var(--gold-accent)',
          backgroundColor: 'rgba(212, 175, 55, 0.05)',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-accent)', fontWeight: 700, fontSize: '0.85rem' }}>
            <Sparkles size={16} />
            <span>Ayat Pilihan Hari Ini</span>
          </div>

          <button
            onClick={toggleFeaturedAudio}
            style={{
              background: isPlayingAudio ? 'var(--gold-accent)' : 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: isPlayingAudio ? '#000000' : 'var(--gold-accent)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            {isPlayingAudio ? <Pause size={14} /> : <Volume2 size={14} />}
            <span>{isPlayingAudio ? 'Jeda' : 'Dengar'}</span>
          </button>
        </div>

        {/* Full Arabic Verse Text */}
        <div
          className="font-arabic"
          style={{
            fontSize: '1.4rem',
            lineHeight: '2.2',
            textAlign: 'right',
            marginBottom: '12px',
            color: 'var(--text-main)',
          }}
        >
          {featuredVerse.textArabic}
        </div>

        {/* Latin Transliteration */}
        <div style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--gold-accent)', marginBottom: '8px' }}>
          "{featuredVerse.textLatin}"
        </div>

        {/* Indonesian Translation */}
        <div style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '14px' }}>
          "{featuredVerse.translation}"
        </div>

        {/* Card Footer Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed var(--border-color)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold-accent)', fontWeight: 700 }}>
            QS. {featuredVerse.surahNameLatin}: {featuredVerse.verseNumber} ({featuredVerse.themeNote})
          </span>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <span>Baca Surat Ini</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>

      {/* Quick Access Menu Grid (4 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        <div
          className="glass-card"
          onClick={() => onNavigate('quran')}
          style={{ padding: '14px 8px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
        >
          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', padding: '8px', borderRadius: '14px', color: 'var(--gold-accent)' }}>
            <BookOpen size={20} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Al-Qur'an</span>
        </div>

        <div
          className="glass-card"
          onClick={() => onNavigate('dzikir')}
          style={{ padding: '14px 8px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
        >
          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', padding: '8px', borderRadius: '14px', color: 'var(--gold-accent)' }}>
            <HeartHandshake size={20} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Dzikir & Doa</span>
        </div>

        <div
          className="glass-card"
          onClick={onOpenMosquesModal}
          style={{ padding: '14px 8px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
        >
          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', padding: '8px', borderRadius: '14px', color: 'var(--gold-accent)' }}>
            <MapPin size={20} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Masjid</span>
        </div>

        <div
          className="glass-card"
          onClick={() => onNavigate('qibla')}
          style={{ padding: '14px 8px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
        >
          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', padding: '8px', borderRadius: '14px', color: 'var(--gold-accent)' }}>
            <Compass size={20} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Kiblat</span>
        </div>
      </div>

      {/* Location Modal Selector */}
      {showLocationModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Pilih Lokasi Kota 📍</h3>
              <button
                onClick={() => setShowLocationModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* GPS Auto Detect Button */}
            <button
              onClick={handleUseGPS}
              disabled={gpsLoading}
              style={{
                padding: '12px',
                borderRadius: '14px',
                border: 'none',
                background: 'var(--gold-gradient)',
                color: '#000000',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Navigation size={18} />
              <span>{gpsLoading ? 'Mendeteksi GPS...' : 'Gunakan Lokasi GPS HP Saya'}</span>
            </button>

            {gpsError && (
              <div style={{ fontSize: '0.75rem', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '10px' }}>
                ⚠️ {gpsError}
              </div>
            )}

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              — ATAU PILIH KOTA MANUAL —
            </div>

            {/* City List Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {INDONESIA_CITIES.map((city) => (
                <div
                  key={city.name}
                  className="glass-card"
                  onClick={() => handleSelectCity(city)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: currentLocation.name === city.name ? '1px solid var(--gold-accent)' : '1px solid var(--border-color)',
                    backgroundColor: currentLocation.name === city.name ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-input)',
                    color: currentLocation.name === city.name ? 'var(--gold-accent)' : 'var(--text-main)',
                  }}
                >
                  {city.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
