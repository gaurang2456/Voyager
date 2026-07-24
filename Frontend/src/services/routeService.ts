export interface RouteResult {
  coordinates: [number, number][]; // [lat, lng] array for Leaflet
  distanceKm: number;
  durationMinutes: number;
}

/**
 * Fetches real travel route along roads connecting an ordered list of lat/lng coordinates
 * using OSRM (Open Source Routing Machine) API.
 */
export async function fetchRealRoute(
  waypoints: { lat: number; lng: number }[]
): Promise<RouteResult> {
  if (waypoints.length < 2) {
    return {
      coordinates: waypoints.map((w) => [w.lat, w.lng]),
      distanceKm: 0,
      durationMinutes: 0,
    };
  }

  // Format: lng,lat;lng,lat
  const coordString = waypoints.map((w) => `${w.lng},${w.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/foot/${coordString}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      // OSRM returns GeoJSON coordinates as [lng, lat]. Leaflet needs [lat, lng].
      const leafletCoords: [number, number][] = route.geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]]
      );
      const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
      const durationMinutes = Math.round(route.duration / 60);

      return {
        coordinates: leafletCoords,
        distanceKm,
        durationMinutes,
      };
    }
  } catch (error) {
    console.warn('Failed to fetch OSRM route, falling back to straight geometry:', error);
  }

  // Fallback calculation if network fails
  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistance += haversineDistance(waypoints[i], waypoints[i + 1]);
  }

  return {
    coordinates: waypoints.map((w) => [w.lat, w.lng]),
    distanceKm: Math.round(totalDistance * 10) / 10,
    durationMinutes: Math.round(totalDistance * 15),
  };
}

function haversineDistance(
  p1: { lat: number; lng: number },
  p2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
