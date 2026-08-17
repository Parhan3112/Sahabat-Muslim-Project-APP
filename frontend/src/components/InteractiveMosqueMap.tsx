import React, { useState } from 'react';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';
import { LocationInfo } from '../services/locationService';

interface InteractiveMosqueMapProps {
  userLocation: LocationInfo;
  mosques: any[];
}

export const InteractiveMosqueMap: React.FC<InteractiveMosqueMapProps> = ({ userLocation, mosques }) => {
  const [selectedMosque, setSelectedMosque] = useState<any>(mosques[0] || null);

  // Map viewport dimensions
  const width = 360;
  const height = 200;
  const centerLat = userLocation.lat;
  const centerLng = userLocation.lng;

  // Convert lat/lng to SVG coordinates
  const getCoordinates = (lat: number, lng: number) => {
    const latDiff = (lat - centerLat) * 8000;
    const lngDiff = (lng - centerLng) * 8000;
    const x = width / 2 + lngDiff;
    const y = height / 2 - latDiff;

    // Clamp coordinates within viewBox boundary
    const clampedX = Math.max(20, Math.min(width - 20, x));
    const clampedY = Math.max(20, Math.min(height - 20, y));

    return { x: clampedX, y: clampedY };
  };

  const userCoords = { x: width / 2, y: height / 2 };

  return (
    <div
      className="glass-card"
      style={{
        padding: '14px',
        backgroundColor: 'rgba(5, 46, 22, 0.4)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
        <div style={{ fontWeight: 700, color: 'var(--gold-accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={14} /> Peta Interaktif Real-Time ({mosques.length} Masjid)
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Sentuh pin untuk memilih</span>
      </div>

      {/* SVG Map Container */}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'rgba(15, 81, 50, 0.3)',
          borderRadius: '14px',
          border: '1px dashed var(--border-color)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', inset: 0 }}>
          {/* Radial Grid Rings */}
          <circle cx={userCoords.x} cy={userCoords.y} r="40" fill="none" stroke="rgba(212, 175, 55, 0.15)" strokeDasharray="3 3" />
          <circle cx={userCoords.x} cy={userCoords.y} r="80" fill="none" stroke="rgba(212, 175, 55, 0.1)" strokeDasharray="3 3" />

          {/* Connection Lines from User to Mosques */}
          {mosques.map((m) => {
            const coords = getCoordinates(m.lat, m.lng);
            const isSelected = selectedMosque?.id === m.id;
            return (
              <line
                key={`line-${m.id}`}
                x1={userCoords.x}
                y1={userCoords.y}
                x2={coords.x}
                y2={coords.y}
                stroke={isSelected ? 'var(--gold-accent)' : 'rgba(255, 255, 255, 0.2)'}
                strokeWidth={isSelected ? 2 : 1}
                strokeDasharray={isSelected ? 'none' : '4 4'}
              />
            );
          })}

          {/* User Location Marker Pin (Blue Dot) */}
          <g transform={`translate(${userCoords.x}, ${userCoords.y})`}>
            <circle r="12" fill="rgba(59, 130, 246, 0.25)" />
            <circle r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Mosque Pin Markers */}
          {mosques.map((m) => {
            const coords = getCoordinates(m.lat, m.lng);
            const isSelected = selectedMosque?.id === m.id;

            return (
              <g
                key={`pin-${m.id}`}
                transform={`translate(${coords.x}, ${coords.y})`}
                onClick={() => setSelectedMosque(m)}
                style={{ cursor: 'pointer' }}
              >
                {isSelected && <circle r="14" fill="rgba(212, 175, 55, 0.3)" />}
                <circle
                  r={isSelected ? 10 : 8}
                  fill={isSelected ? 'var(--gold-accent)' : 'var(--primary-emerald)'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  y="4"
                  fontSize="9"
                  textAnchor="middle"
                  fill={isSelected ? '#000000' : '#ffffff'}
                  fontWeight="bold"
                >
                  🕌
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Mosque Information Card */}
      {selectedMosque && (
        <div
          className="glass-panel"
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid var(--gold-accent)',
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--gold-accent)' }}>
              {selectedMosque.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Jarak: <b>{selectedMosque.formattedDistance}</b> • {selectedMosque.address}
            </div>
          </div>

          <a
            href={selectedMosque.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: 'var(--primary-emerald)',
              color: '#ffffff',
              padding: '6px 10px',
              borderRadius: '10px',
              fontSize: '0.72rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Navigation size={12} /> Rute <ExternalLink size={10} />
          </a>
        </div>
      )}
    </div>
  );
};
