import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTravelStore } from '../../store/useTravelStore';
import { useThemeStore } from '../../store/useThemeStore';
import { fetchRealRoute } from '../../services/routeService';
import type { ActivityCategory, Activity } from '../../types/travel';

const getCategoryColor = (category: ActivityCategory) => {
  switch (category) {
    case 'sightseeing':
      return { bg: '#2563eb', text: '#ffffff' };
    case 'food':
      return { bg: '#10b981', text: '#ffffff' };
    case 'shopping':
      return { bg: '#9333ea', text: '#ffffff' };
    case 'hotel':
      return { bg: '#f59e0b', text: '#ffffff' };
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

/**
 * Calculates spatial offset for activities that are very close to each other
 * to prevent markers from obscuring each other.
 */
function calculateDeconflictedPositions(activities: Activity[]): PositionedActivity[] {
  const result: PositionedActivity[] = [];
  const processed = new Set<string>();

  for (let i = 0; i < activities.length; i++) {
    const act = activities[i];
    if (processed.has(act.id)) continue;

    // Find all activities within ~200 meters threshold (0.002 deg)
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
      // Disperse cluster markers in a small circle around original point
      const radius = 0.0012; // ~120m offset
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

export const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const polylineGlowRef = useRef<L.Polyline | null>(null);
  const polylineMainRef = useRef<L.Polyline | null>(null);
  const connectorLinesRef = useRef<L.Polyline[]>([]);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const {
    trips,
    activeTripId,
    activeDayNumber,
    selectedActivityId,
    setSelectedActivity,
    hoveredActivityId,
    setHoveredActivity,
    filterCategory,
  } = useTravelStore();

  const { theme } = useThemeStore();

  const currentTrip = trips.find((t) => t.id === activeTripId);
  const currentDay = currentTrip?.days.find((d) => d.dayNumber === activeDayNumber);

  const rawActivities = currentDay?.activities || [];
  const activities = filterCategory === 'all'
    ? rawActivities
    : rawActivities.filter((a) => a.category === filterCategory);

  // Initialize Map
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

  // Render De-overlapped Markers & Real OSRM Road Route
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers & lines
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    if (polylineGlowRef.current) {
      polylineGlowRef.current.remove();
      polylineGlowRef.current = null;
    }
    if (polylineMainRef.current) {
      polylineMainRef.current.remove();
      polylineMainRef.current = null;
    }
    connectorLinesRef.current.forEach((line) => line.remove());
    connectorLinesRef.current = [];

    if (activities.length === 0) return;

    // Compute offset positions to prevent marker overlap
    const positionedActivities = calculateDeconflictedPositions(activities);
    const boundsLatLngs: L.LatLngExpression[] = [];

    positionedActivities.forEach(({ activity: act, renderLat, renderLng, isOffset }) => {
      const isSelected = act.id === selectedActivityId;
      const isHovered = act.id === hoveredActivityId;
      const isCompleted = act.status === 'completed';
      const isCurrent = act.status === 'current' || isSelected;
      const isSkipped = act.status === 'skipped';
      const colors = getCategoryColor(act.category);
      const iconSvg = getCategoryBadgeSvg(act.category);

      boundsLatLngs.push([act.lat, act.lng]);

      // If marker is offset, draw subtle dotted connector to original lat/lng
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

      // Marker HTML representation
      let markerHtml = '';

      if (isCompleted) {
        markerHtml = `
          <div class="group relative flex flex-col items-center cursor-pointer transition-all duration-300 transform opacity-65 ${
            isHovered ? 'scale-110 opacity-100' : ''
          }">
            <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-800 border border-slate-300 shadow-xs text-[10px] font-semibold text-slate-600">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              <span>${act.time}</span>
            </div>
            <div class="w-1.5 h-1.5 rotate-45 -mt-0.5 bg-slate-300"></div>
          </div>
        `;
      } else if (isCurrent) {
        // Glowing pulsing current/selected marker
        markerHtml = `
          <div class="group relative flex flex-col items-center cursor-pointer transition-all duration-300 transform scale-110 z-50">
            <div class="absolute -inset-2 rounded-full animate-ping opacity-40" style="background-color: ${colors.bg}"></div>
            
            <div class="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg border text-xs font-extrabold transition-all duration-200"
                 style="background-color: ${colors.bg}; color: #ffffff; border-color: #ffffff">
              <span class="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-black bg-white/25">
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

            <div class="w-2 h-2 rotate-45 -mt-1 shadow-sm" style="background-color: ${colors.bg}"></div>
          </div>
        `;
      } else {
        // Upcoming numbered marker with hover response
        markerHtml = `
          <div class="group relative flex flex-col items-center cursor-pointer transition-all duration-300 transform ${
            isHovered ? 'scale-115 z-40' : 'hover:scale-105 z-20'
          } ${isSkipped ? 'opacity-35 grayscale' : ''}">
            <div class="relative flex items-center gap-1 px-2 py-0.5 rounded-full shadow-sm border bg-white/95 text-slate-800 border-slate-200 backdrop-blur-md text-xs font-semibold transition-all">
              <span class="flex items-center justify-center w-3.5 h-3.5 rounded-full text-[9px] font-black text-white" style="background-color: ${colors.bg}">
                ${act.order}
              </span>
              <span class="text-[10px] text-slate-700 font-bold">${act.time}</span>
            </div>
            ${
              act.priority === 'high'
                ? `<div class="w-1.5 h-1.5 rounded-full bg-rose-500 ring-1 ring-white -mt-0.5 z-10"></div>`
                : ''
            }
            <div class="w-1.5 h-1.5 rotate-45 -mt-0.5 bg-white border-r border-b border-slate-200"></div>
          </div>
        `;
      }

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-map-marker-container',
        iconSize: [80, 40],
        iconAnchor: [40, 38],
      });

      const zIndex = isSelected ? 1000 : isHovered ? 900 : 100 + act.order;
      const marker = L.marker([renderLat, renderLng], {
        icon: customIcon,
        zIndexOffset: zIndex,
      }).addTo(map);

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedActivity(act.id);
        map.flyTo([act.lat, act.lng], 15, { duration: 0.5, easeLinearity: 0.25 });
      });

      marker.on('mouseover', () => {
        setHoveredActivity(act.id);
      });

      marker.on('mouseout', () => {
        setHoveredActivity(null);
      });

      markersRef.current[act.id] = marker;
    });

    // Fetch and render REAL Road Route via OSRM
    const waypoints = activities.map((a) => ({ lat: a.lat, lng: a.lng }));
    if (waypoints.length > 1) {
      fetchRealRoute(waypoints).then((routeRes) => {
        if (!mapRef.current) return;

        // Dual polyline render: ambient glow background line + vibrant animated line
        const glowPolyline = L.polyline(routeRes.coordinates, {
          color: '#3b82f6',
          weight: 7,
          opacity: 0.25,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        const mainPolyline = L.polyline(routeRes.coordinates, {
          color: '#2563eb',
          weight: 3.5,
          opacity: 0.9,
          dashArray: '8, 8',
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        polylineGlowRef.current = glowPolyline;
        polylineMainRef.current = mainPolyline;
      });
    }

    if (boundsLatLngs.length > 0 && !selectedActivityId) {
      const bounds = L.latLngBounds(boundsLatLngs);
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 14, animate: true });
    }
  }, [activities, selectedActivityId, hoveredActivityId, setSelectedActivity, setHoveredActivity]);

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
