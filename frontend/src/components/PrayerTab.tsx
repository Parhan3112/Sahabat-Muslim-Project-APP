import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { apiService } from '../services/api';
import { LocationInfo } from '../services/locationService';

interface PrayerTabProps {
  currentLocation: LocationInfo;
}

export const PrayerTab: React.FC<PrayerTabProps> = ({ currentLocation }) => {
  const [todayData, setTodayData] = useState<any>({
    date: {
      masehi: 'Senin, 17 Agustus 2026',
      hijriah: '29 Safar 1448 H',
      fullFormatted: 'Senin, 17 Agustus 2026 • 29 Safar 1448 H',
    },
    timings: {
      imsak: '04:25',
      subuh: '04:35',
      terbit: '05:54',
      dzuhur: '12:00',
      ashar: '15:18',
      maghrib: '18:02',
      isya: '19:12',
    },
  });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'today' | 'monthly'>('today');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isSubscribed = true;

    async function loadPrayerData() {
      try {
        const todayRes = await apiService.getTodayPrayerTimes(currentLocation.lat, currentLocation.lng);
        if (isSubscribed && todayRes) {
          setTodayData(todayRes);
        }

        const now = new Date();
        const monthlyRes = await apiService.getMonthlyPrayerTimes(
          currentLocation.lat,
          currentLocation.lng,
          now.getMonth() + 1,
          now.getFullYear()
        );
        if (isSubscribed && monthlyRes) {
          setMonthlyData(monthlyRes);
        }
      } catch (err) {
        console.error('Failed to load prayer times:', err);
      }
    }
    loadPrayerData();

    return () => {
      isSubscribed = false;
    };
  }, [currentLocation]);

  return (
    <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Jadwal Sholat 🕌</h1>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={14} color="var(--gold-accent)" />
          <span>{currentLocation.name} (Metode Kemenag RI)</span>
        </div>
      </div>

      {/* Tab Selector Today vs Monthly */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          padding: '4px',
          backgroundColor: 'var(--bg-input)',
        }}
      >
        <button
          onClick={() => setActiveView('today')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '12px',
            backgroundColor: activeView === 'today' ? 'var(--primary-emerald)' : 'transparent',
            color: activeView === 'today' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          Hari Ini
        </button>
        <button
          onClick={() => setActiveView('monthly')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '12px',
            backgroundColor: activeView === 'monthly' ? 'var(--primary-emerald)' : 'transparent',
            color: activeView === 'monthly' ? '#ffffff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          Jadwal Bulanan
        </button>
      </div>

      {activeView === 'today' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Date info card */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold-accent)', fontWeight: 600 }}>
                {todayData?.date?.hijriah || '29 Safar 1448 H'}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '2px' }}>
                {todayData?.date?.masehi || 'Senin, 17 Agustus 2026'}
              </div>
            </div>
            <Calendar size={24} color="var(--gold-accent)" />
          </div>

          {/* Timings List Cards */}
          {[
            { name: 'Imsak', time: todayData?.timings?.imsak || '04:25' },
            { name: 'Subuh', time: todayData?.timings?.subuh || '04:35', highlight: true },
            { name: 'Terbit (Syuruq)', time: todayData?.timings?.terbit || '05:54' },
            { name: 'Dzuhur', time: todayData?.timings?.dzuhur || '12:00' },
            { name: 'Ashar', time: todayData?.timings?.ashar || '15:18' },
            { name: 'Maghrib', time: todayData?.timings?.maghrib || '18:02' },
            { name: 'Isya', time: todayData?.timings?.isya || '19:12' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: item.highlight ? '4px solid var(--gold-accent)' : '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} color={item.highlight ? 'var(--gold-accent)' : 'var(--text-muted)'} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold-accent)' }}>
                {item.time}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {monthlyData.length > 0 ? (
            monthlyData.map((day, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '12px 14px', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--gold-accent)', marginBottom: '6px' }}>
                  {day.date?.masehi}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', textAlign: 'center' }}>
                  <div>Subuh: <b>{day.timings?.subuh}</b></div>
                  <div>Dzuhur: <b>{day.timings?.dzuhur}</b></div>
                  <div>Ashar: <b>{day.timings?.ashar}</b></div>
                  <div>Maghrib: <b>{day.timings?.maghrib}</b></div>
                  <div>Isya: <b>{day.timings?.isya}</b></div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              Memuat jadwal bulanan...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
