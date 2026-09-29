import L from 'leaflet';

/**
 * Utility for resolving map tile URLs and options.
 * CARTO basemaps (cartocdn.com) enforce an API key requirement (https://carto.com/basemaps/apikey).
 * Without an API key, CARTO stamps an "API KEY REQUIRED carto.com/basemaps/apikey" watermark on each tile.
 *
 * If VITE_CARTO_API_KEY is configured in the frontend environment, CARTO tiles are loaded with `?key=...`.
 * Otherwise, the map gracefully falls back to OpenStreetMap (OSM) tiles without any watermarks.
 */

export const CARTO_API_KEY = (import.meta.env.VITE_CARTO_API_KEY as string | undefined)?.trim() || '';

export function getMapTileUrl(
  theme: 'light' | 'dark' = 'light',
  variant: 'voyager' | 'light_all' = 'voyager'
): string {
  if (CARTO_API_KEY) {
    if (theme === 'dark') {
      return `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`;
    }
    if (variant === 'light_all') {
      return `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`;
    }
    return `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CARTO_API_KEY}`;
  }

  // Fallback: OpenStreetMap tiles (free, public, no watermark, no API key required)
  return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
}

export function getMapTileOptions(): L.TileLayerOptions {
  if (CARTO_API_KEY) {
    return {
      subdomains: 'abcd',
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    };
  }

  return {
    subdomains: 'abc',
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
  };
}
