import React, { useEffect, useState } from 'react';
import { Compass, MapPin, Navigation } from 'lucide-react';
import { apiService } from '../services/api';
import { LocationInfo } from '../services/locationService';

interface QiblaTabProps {
  currentLocation: LocationInfo;
}

export const QiblaTab: React.FC<QiblaTabProps> = ({ currentLocation }) => {
  const [qiblaData, setQiblaData] = useState<any>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadQibla() {
      try {
        setLoading(true);
        const res = await apiService.getQiblaDirection(currentLocation.lat, currentLocation.lng);
        setQiblaData(res);
      } catch (err) {
        console.error('Failed to load qibla data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQibla();
  }, [currentLocation]);

  const bindCompassListeners = () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let heading: number | null = null;

      const webkitHeading = (event as any).webkitCompassHeading;
      if (webkitHeading !== undefined && webkitHeading !== null) {
        heading = webkitHeading;
      } else if (event.alpha !== null && event.alpha !== undefined) {
        heading = 360 - event.alpha;
      }

      if (heading !== null) {
        setDeviceHeading(heading);
        setHasCompassSensor(true);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    window.addEventListener('deviceorientationabsolute' as any, handleOrientation, true);
  };

  // Try automatic binding on mount
  useEffect(() => {
    bindCompassListeners();
  }, []);

  // Explicit tap handler for iOS / Mobile browsers
  const handleEnableCompassTap = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const res = await (DeviceOrientationEvent as any).requestPermission();
        if (res === 'granted') {
          bindCompassListeners();
        }
      } catch (err) {
        // Fallback bind
        bindCompassListeners();
      }
    } else {
      bindCompassListeners();
    }
  };

  const qiblaDegree = qiblaData?.qiblaDirectionDegree || 295.14;
  const needleRotation = qiblaDegree - deviceHeading;

  return (
    <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Arah Kiblat 🧭</h1>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={14} color="var(--gold-accent)" />
          <span>{currentLocation.name}</span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          Menghitung posisi presisi Ka'bah...
        </div>
      ) : (
        <>
          {/* Prominent Enable Compass Button Banner */}
          <button
            onClick={handleEnableCompassTap}
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              border: hasCompassSensor ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid var(--gold-accent)',
              backgroundColor: hasCompassSensor ? 'rgba(34, 197, 94, 0.15)' : 'rgba(212, 175, 55, 0.15)',
              color: hasCompassSensor ? '#22c55e' : 'var(--gold-accent)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Navigation size={18} />
            <span>
              {hasCompassSensor
                ? '🟢 Kompas HP Real-time Aktif (Putar HP Anda)'
                : '🧭 Sentuh di Sini untuk Aktifkan Kompas Real-time HP'}
            </span>
          </button>

          {/* Compass Visualizer Container */}
          <div
            className="glass-panel"
            onClick={handleEnableCompassTap}
            style={{
              padding: '30px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            {/* Outer Dial Circle */}
            <div
              style={{
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                border: '4px solid var(--border-color)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                backgroundColor: 'rgba(5, 46, 22, 0.4)',
              }}
            >
              {/* Compass Marks */}
              <div style={{ position: 'absolute', top: '10px', fontWeight: 800, color: '#ef4444', fontSize: '0.9rem' }}>N</div>
              <div style={{ position: 'absolute', right: '12px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem' }}>E</div>
              <div style={{ position: 'absolute', bottom: '10px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem' }}>S</div>
              <div style={{ position: 'absolute', left: '12px', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem' }}>W</div>

              {/* Rotating Qibla Needle Pointer */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `rotate(${needleRotation}deg)`,
                  transition: 'transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)',
                }}
              >
                {/* Pointer Needle to Kaaba */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-start', paddingTop: '18px' }}>
                  <div
                    style={{
                      width: '0',
                      height: '0',
                      borderLeft: '12px solid transparent',
                      borderRight: '12px solid transparent',
                      borderBottom: '40px solid var(--gold-accent)',
                      filter: 'drop-shadow(0 4px 10px rgba(212, 175, 55, 0.6))',
                    }}
                  />
                  <div style={{ fontSize: '1.2rem', marginTop: '4px' }}>🕋</div>
                </div>
              </div>

              {/* Center Pivot Point */}
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--gold-accent)',
                  border: '2px solid #ffffff',
                  zIndex: 5,
                }}
              />
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '16px', textAlign: 'center' }}>
              Sentuh area kompas atau tombol di atas, lalu posisikan HP secara mendatar.
            </div>
          </div>

          {/* Stats Info Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Sudut Azimut Kiblat</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-accent)' }}>
                {qiblaData?.qiblaDirectionDegree}°
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Dari Arah Utara Sejati</div>
            </div>

            <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Jarak ke Ka'bah Makkah</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-accent)' }}>
                {qiblaData?.distanceToKaabaKm?.toLocaleString('id-ID')} KM
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Garis Geodesik Bumi</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
