import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTravelStore } from '../../store/useTravelStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useMyTripsQuery } from '../../hooks/useTrips';
import { useItineraryQuery } from '../../hooks/useItinerary';
import { transformItineraryResponseToDays } from '../../api/itinerary';
import { fetchRealRoute } from '../../services/routeService';
import type { ActivityCategory, Activity } from '../../types/travel';

const getCategoryColor = (category: ActivityCategory) => {
  switch (category) {
    case 'sightseeing':
      return { bg: '#C19A6B', text: '#ffffff' };
    case 'food':
      return { bg: '#6B8E23', text: '#ffffff' };
    case 'shopping':
      return { bg: '#8E2A59', text: '#ffffff' };
    case 'hotel':
      return { bg: '#D97724', text: '#ffffff' };
  }
};

const getCategoryBadgeSvg = (category: ActivityCategory) => {
  switch (category) {
    case 'sightseeing':
      return '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
    case 'food':
      return '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>';
    case 'shopping':
      return '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>';
    case 'hotel':
      return '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 20h20M4 20V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M9 6h6M9 10h6M9 14h6"/></svg>';
  }
};

interface PositionedActivity {
  activity: Activity;
  renderLat: number;
  renderLng: number;
  isOffset: boolean;
}

function calculateDeconflictedPositions(activities: Activity[]): PositionedActivity[] {
  const result: PositionedActivity[] = [];
  const processed = new Set<string>();

  for (let i = 0; i < activities.length; i++) {
    const act = activities[i];
    if (processed.has(act.id)) continue;

    const cluster: Activity[] = [act];
    processed.add(act.id);

    for (let j = i + 1; j < activities.length; j++) {
      const other = activities[j];
      if (processed.has(other.id)) continue;
      const dLat = Math.abs(act.lat - other.lat);
      const dLng = Math.abs(act.lng - other.lng);
      if (dLat < 0.002 && dLng < 0.002) {
        cluster.push(other);
        processed.add(other.id);
      }
    }

    if (cluster.length === 1) {
      result.push({
        activity: act,
        renderLat: act.lat,
        renderLng: act.lng,
        isOffset: false,
      });
    } else {
      const radius = 0.0012;
      cluster.forEach((item, idx) => {
        const angle = (2 * Math.PI * idx) / cluster.length - Math.PI / 2;
        result.push({
          activity: item,
          renderLat: item.lat + radius * Math.sin(angle),
          renderLng: item.lng + radius * Math.cos(angle),
          isOffset: true,
        });
      });
    }
  }

  return result;
}

function createMarkerHtml(
  act: Activity,
  isCompleted: boolean,
  isSkipped: boolean,
  isCurrent: boolean,
  isHovered: boolean,
  iconSvg: string
): string {
  if (isCompleted) {
    return `
      <div class="group relative flex flex-col items-center cursor-pointer transition-all duration-300 transform ${
        isHovered ? 'scale-110 opacity-100' : 'opacity-85'
      }">
        <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#5FAF8D] text-white font-extrabold text-[10px] shadow-sm border border-white">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>${act.time}</span>
        </div>
        <div class="w-1.5 h-1.5 rotate-45 -mt-1 bg-[#5FAF8D]"></div>
      </div>
    `;
  }

  if (isSkipped) {
    return `
      <div class="group relative flex flex-col items-center cursor-pointer transition-all duration-300 opacity-50 hover:opacity-90 ${
        isHovered ? 'scale-105' : ''
      }">
        <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-300 text-stone-700 font-bold text-[10px] shadow-2xs border border-stone-400 line-through">
          <span>${act.time} (Skipped)</span>
        </div>
        <div class="w-1.5 h-1.5 rotate-45 -mt-1 bg-stone-300"></div>
      </div>
    `;
  }

  if (isCurrent) {
    return `
      <div class="group relative flex flex-col items-center cursor-pointer transition-all duration-300 transform scale-110 z-50">
        <div class="absolute -inset-2 rounded-full animate-ping opacity-40" style="background-color: #F8ECC9"></div>
        
        <div class="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-md border text-xs font-extrabold transition-all duration-200"
             style="background-color: #F8ECC9; color: #2F2A24; border-color: #EAD9B8">
          <span class="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-black bg-[#C19A6B] text-white">
            ${act.order}
          </span>
          <span class="text-[11px] font-bold">${act.time}</span>
          <span class="opacity-90">${iconSvg}</span>
        </div>

        ${
          act.priority === 'high'
            ? `<div class="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white shadow-xs -mt-1 z-10"></div>`
            : ''
        }

        <div class="w-2 h-2 rotate-45 -mt-1 shadow-sm" style="background-color: #F8ECC9"></div>
      </div>
    `;
  }

  return `
    <div class="group relative flex flex-col items-center cursor-pointer transition-all duration-300 transform ${
      isHovered ? 'scale-110' : ''
    }">
      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-md border text-xs font-bold transition-all duration-200"
           style="background-color: #F8ECC9; color: #2F2A24; border-color: #EAD9B8">
        <span class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white bg-[#C19A6B]">
          ${act.order}
        </span>
        <span class="text-[11px] font-bold">${act.title}</span>
      </div>
      <div class="w-2 h-2 rotate-45 -mt-1 shadow-sm" style="background-color: #F8ECC9"></div>
    </div>
  `;
}

export const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const activePolylinesRef = useRef<L.Polyline[]>([]);
  const connectorLinesRef = useRef<L.Polyline[]>([]);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userHasZoomedRef = useRef<boolean>(false);

  const {
    activeTripId,
    activeDayNumber,
    selectedActivityId,
    setSelectedActivity,
    hoveredActivityId,
    setHoveredActivity,
    filterCategory,
    completedActivityIds,
    skippedActivityIds,
  } = useTravelStore();

  const { token } = useAuthStore();
  const { theme } = useThemeStore();

  // Reset user zoom override when active day or trip changes
  useEffect(() => {
    userHasZoomedRef.current = false;
  }, [activeDayNumber, activeTripId]);

  // Fetch active trip and itinerary via React Query
  const { data: myTrips = [] } = useMyTripsQuery(Boolean(token));
  const activeTrip = myTrips.find((t) => String(t.id) === String(activeTripId));
  const numericTripId = activeTrip ? Number(activeTrip.id) : null;

  const { data: itineraryData } = useItineraryQuery(numericTripId, Boolean(token && numericTripId));
  const days = itineraryData ? transformItineraryResponseToDays(itineraryData) : [];

  // Strictly select ONLY current active day's activities
  const currentDay = days.find((d) => d.dayNumber === activeDayNumber) || days[0];

  const rawActivities = currentDay?.activities || [];
  const activities = filterCategory === 'all'
    ? rawActivities
    : rawActivities.filter((a) => a.category === filterCategory);

  // Initialize Leaflet Map immediately on render
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [35.6764, 139.6993],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    const initialTileUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(initialTileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Track user manual zoom/pan so auto camera flight doesn't override manual zoom
    map.on('zoomstart dragstart', () => {
      userHasZoomedRef.current = true;
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Handle Dynamic Theme Switching for Map Tiles
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    const newTileUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    tileLayerRef.current.setUrl(newTileUrl);
  }, [theme]);

  // Main Effect: Render Markers & Route Polylines for Current Active Day
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let isCancelled = false;

    // 1. Remove all existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // 2. Remove all active polylines
    activePolylinesRef.current.forEach((line) => line.remove());
    activePolylinesRef.current = [];

    // 3. Remove connector lines
    connectorLinesRef.current.forEach((line) => line.remove());
    connectorLinesRef.current = [];

    if (activities.length === 0) return;

    // Compute offset positions to prevent marker overlap
    const positionedActivities = calculateDeconflictedPositions(activities);
    const boundsLatLngs: L.LatLngExpression[] = [];

    positionedActivities.forEach(({ activity: act, renderLat, renderLng, isOffset }) => {
      const isSelected = act.id === selectedActivityId;
      const isHovered = act.id === hoveredActivityId;
      const isCompleted = Boolean(completedActivityIds[act.id]);
      const isSkipped = Boolean(skippedActivityIds[act.id]);
      const isCurrent = (act.status === 'current' || isSelected) && !isCompleted && !isSkipped;
      const colors = getCategoryColor(act.category);
      const iconSvg = getCategoryBadgeSvg(act.category);

      boundsLatLngs.push([act.lat, act.lng]);

      if (isOffset) {
        const connector = L.polyline(
          [
            [act.lat, act.lng],
            [renderLat, renderLng],
          ],
          {
            color: colors.bg,
            weight: 1.5,
            dashArray: '3, 3',
            opacity: 0.6,
          }
        ).addTo(map);
        connectorLinesRef.current.push(connector);
      }

      const markerHtml = createMarkerHtml(act, isCompleted, isSkipped, isCurrent, isHovered, iconSvg);
      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker',
        iconSize: [120, 36],
        iconAnchor: [60, 36],
      });

      const zIndex = isSelected ? 1000 : isCurrent ? 800 : isHovered ? 900 : 500;
      const marker = L.marker([renderLat, renderLng], {
        icon: customIcon,
        zIndexOffset: zIndex,
      }).addTo(map);

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedActivity(act.id);
        map.flyTo([act.lat, act.lng], 15, { duration: 0.5, easeLinearity: 0.25 });
      });

      marker.on('mouseover', () => setHoveredActivity(act.id));
      marker.on('mouseout', () => setHoveredActivity(null));

      markersRef.current[act.id] = marker;
    });

    // 4. SYNCHRONOUSLY render immediate fallback polyline so route line is ALWAYS visible!
    const activeWaypoints = activities
      .filter((a) => !Boolean(completedActivityIds[a.id] || skippedActivityIds[a.id]))
      .map((a) => ({ lat: a.lat, lng: a.lng }));

    if (activeWaypoints.length > 1) {
      const syncCoords: [number, number][] = activeWaypoints.map((w) => [w.lat, w.lng]);

      const outerGlowPolyline = L.polyline(syncCoords, {
        color: '#FFFFFF',
        weight: 8.0,
        opacity: 0.45,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      const glowPolyline = L.polyline(syncCoords, {
        color: '#B07A4F',
        weight: 5.8,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      const mainPolyline = L.polyline(syncCoords, {
        color: '#A67C52',
        weight: 3.7,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      activePolylinesRef.current.push(outerGlowPolyline, glowPolyline, mainPolyline);

      // 5. Asynchronously fetch OSRM road coordinates & update polyline when returned
      fetchRealRoute(activeWaypoints).then((routeRes) => {
        if (isCancelled || !mapRef.current) return;
        if (routeRes.coordinates && routeRes.coordinates.length > 0) {
          outerGlowPolyline.setLatLngs(routeRes.coordinates);
          glowPolyline.setLatLngs(routeRes.coordinates);
          mainPolyline.setLatLngs(routeRes.coordinates);
        }
      });
    }

    // Automatically fly camera to fit bounds of selected day's route ONLY IF user hasn't manually zoomed in
    if (boundsLatLngs.length > 0 && !selectedActivityId && !userHasZoomedRef.current) {
      const bounds = L.latLngBounds(boundsLatLngs);
      map.flyToBounds(bounds, { padding: [80, 80], maxZoom: 14, duration: 0.7 });
    }

    return () => {
      isCancelled = true;
    };
  }, [activities, activeDayNumber, completedActivityIds, skippedActivityIds, setSelectedActivity, setHoveredActivity]);

  // Smooth map flight on activity select
  useEffect(() => {
    if (!selectedActivityId || !mapRef.current) return;
    const selectedAct = activities.find((a) => a.id === selectedActivityId);
    if (selectedAct) {
      mapRef.current.flyTo([selectedAct.lat, selectedAct.lng], 15, {
        duration: 0.5,
        easeLinearity: 0.3,
      });
    }
  }, [selectedActivityId, activities]);

  return (
    <div className="relative w-full h-full min-h-screen">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0 bg-slate-100" />
    </div>
  );
};

export default MapView;
