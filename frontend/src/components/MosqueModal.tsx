import React, { useEffect, useState } from 'react';
import { ExternalLink, MapPin, Navigation, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';
import { INDONESIA_CITIES, LocationInfo, requestGPSLocation, saveLocation } from '../services/locationService';
import { InteractiveMosqueMap } from './InteractiveMosqueMap';

interface MosqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationInfo;
  onLocationChange?: (loc: LocationInfo) => void;
}

export const MosqueModal: React.FC<MosqueModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onLocationChange,
}) => {
  const [mosques, setMosques] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [autoGpsDetecting, setAutoGpsDetecting] = useState<boolean>(false);
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string>('');
  const [activeLoc, setActiveLoc] = useState<LocationInfo>(currentLocation);
  const [showCityPicker, setShowCityPicker] = useState<boolean>(false);

  // Load mosques when active location changes
  useEffect(() => {
    if (!isOpen) return;

    let isSubscribed = true;

    async function fetchMosques() {
      try {
        setLoading(true);
        const list = await apiService.getNearbyMosques(activeLoc.lat, activeLoc.lng);
        if (isSubscribed) setMosques(list);
      } catch (err) {
        console.error('Failed to load mosques:', err);
      } finally {
        if (isSubscribed) setLoading(false);
      }
    }

    fetchMosques();

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, activeLoc]);

  // Auto-Detect GPS on mount
  useEffect(() => {
    if (!isOpen) return;

    async function autoGPS() {
      if (navigator.geolocation) {
        setAutoGpsDetecting(true);
        setGpsErrorMsg('');
        try {
          const gpsLoc = await requestGPSLocation();
          setActiveLoc(gpsLoc);
          if (onLocationChange) onLocationChange(gpsLoc);
        } catch (err: any) {
          setGpsErrorMsg(err.message || 'GPS tidak aktif');
        } finally {
          setAutoGpsDetecting(false);
        }
      }
    }

    autoGPS();
  }, [isOpen]);

  const handleManualGPSClick = async () => {
    setGpsErrorMsg('');
    setAutoGpsDetecting(true);
    try {
      const gpsLoc = await requestGPSLocation();
      setActiveLoc(gpsLoc);
      if (onLocationChange) onLocationChange(gpsLoc);
      setShowCityPicker(false);
    } catch (err: any) {
      setGpsErrorMsg(err.message || 'GPS tidak aktif');
      setShowCityPicker(true);
    } finally {
      setAutoGpsDetecting(false);
    }
  };

  const handleSelectCity = (city: LocationInfo) => {
    saveLocation(city);
    setActiveLoc(city);
    if (onLocationChange) onLocationChange(city);
    setShowCityPicker(false);
    setGpsErrorMsg('');
  };

  if (!isOpen) return null;

  return (
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
        padding: '16px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          maxHeight: '88vh',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Masjid Terdekat 🕌</h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} color="var(--gold-accent)" />
              <span>{autoGpsDetecting ? 'Mendeteksi GPS...' : activeLoc.name}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowCityPicker(!showCityPicker)}
              style={{
                background: showCityPicker ? 'var(--gold-accent)' : 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: showCityPicker ? '#000000' : 'var(--gold-accent)',
                padding: '6px 10px',
                borderRadius: '10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              📍 Ubah Kota
            </button>

            <button
              onClick={handleManualGPSClick}
              disabled={autoGpsDetecting}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--gold-accent)',
                padding: '6px 10px',
                borderRadius: '10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <RefreshCw size={12} className={autoGpsDetecting ? 'spin' : ''} />
              <span>GPS</span>
            </button>

            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* GPS Info / iOS Notice Alert */}
        {gpsErrorMsg && (
          <div
            style={{
              fontSize: '0.74rem',
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid var(--gold-accent)',
              color: 'var(--gold-accent)',
              padding: '10px 12px',
              borderRadius: '12px',
              lineHeight: '1.5',
            }}
          >
            <b>ℹ️ Catatan Lokasi iOS:</b> {gpsErrorMsg}
            <div style={{ marginTop: '6px', fontWeight: 700 }}>
              👇 Pilih lokasi kota Anda secara manual di bawah agar daftar masjid langsung muncul:
            </div>
          </div>
        )}

        {/* City Selector Accordion Panel */}
        {showCityPicker && (
          <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-accent)' }}>Pilih Kota Tempat Anda Berada:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {INDONESIA_CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleSelectCity(city)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: activeLoc.name === city.name ? '1px solid var(--gold-accent)' : '1px solid var(--border-color)',
                    backgroundColor: activeLoc.name === city.name ? 'rgba(212, 175, 55, 0.2)' : 'var(--bg-input)',
                    color: activeLoc.name === city.name ? 'var(--gold-accent)' : 'var(--text-main)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {city.name.split('&')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Visualizer Map */}
        {!loading && mosques.length > 0 && (
          <InteractiveMosqueMap userLocation={activeLoc} mosques={mosques} />
        )}

        {/* Mosques List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
            Mencari lokasi masjid di sekitar {activeLoc.name}...
          </div>
        ) : mosques.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
            Tidak ada masjid terhitung di radius sekitar {activeLoc.name}. Coba pilih kota terdekat.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingRight: '4px' }}>
            {mosques.map((m) => (
              <div
                key={m.id}
                className="glass-card"
                style={{
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1, paddingRight: '10px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--gold-accent)' }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    📍 {m.address}
                  </div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                    Jarak: <span style={{ color: 'var(--gold-accent)' }}>{m.formattedDistance}</span> dari pusat kota/lokasi
                  </div>
                </div>

                <a
                  href={m.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'var(--primary-emerald)',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    fontSize: '0.73rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 12px rgba(15, 81, 50, 0.4)',
                  }}
                >
                  <Navigation size={13} />
                  <span>Rute</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
