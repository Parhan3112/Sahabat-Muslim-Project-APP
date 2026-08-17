export interface QiblaResponse {
  location: {
    latitude: number;
    longitude: number;
  };
  kaabaLocation: {
    latitude: number;
    longitude: number;
  };
  directionDegree: number; // Degree from North (0-360°)
  distanceKm: number;
  compassDirection: string;
}

const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

// Calculate Haversine distance in KM
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in KM
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Calculate Great Circle Azimuth direction in degrees from North
function calculateQiblaDirection(lat: number, lng: number): number {
  const phi1 = toRadians(lat);
  const phi2 = toRadians(KAABA_LAT);
  const deltaLambda = toRadians(KAABA_LNG - lng);

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  let qiblaRad = Math.atan2(y, x);
  let qiblaDeg = toDegrees(qiblaRad);

  // Normalize to 0-360 degrees
  qiblaDeg = (qiblaDeg + 360) % 360;
  return Math.round(qiblaDeg * 100) / 100;
}

function getCompassCardinal(deg: number): string {
  const cardinals = ['Utara (N)', 'Timur Laut (NE)', 'Timur (E)', 'Tenggara (SE)', 'Selatan (S)', 'Barat Daya (SW)', 'Barat (W)', 'Barat Laut (NW)'];
  const index = Math.round(deg / 45) % 8;
  return cardinals[index];
}

export async function getQiblaDirection(latitude: number, longitude: number): Promise<QiblaResponse> {
  let directionDegree = calculateQiblaDirection(latitude, longitude);

  try {
    const res = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
    if (res.ok) {
      const json = (await res.json()) as any;
      if (json.data && typeof json.data.direction === 'number') {
        directionDegree = Math.round(json.data.direction * 100) / 100;
      }
    }
  } catch (_err) {
    // Fallback to local geodesic math calculation if API is offline
  }

  const distanceKm = calculateDistanceKm(latitude, longitude, KAABA_LAT, KAABA_LNG);

  return {
    location: {
      latitude,
      longitude,
    },
    kaabaLocation: {
      latitude: KAABA_LAT,
      longitude: KAABA_LNG,
    },
    directionDegree,
    distanceKm,
    compassDirection: getCompassCardinal(directionDegree),
  };
}
