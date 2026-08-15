import { apiClient } from '../services/axios';

export interface DestinationSuggestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'destination' | 'hotel' | 'experience';
  destinationName: string;
  imageUrl?: string;
  rating?: number;
  priceRange?: string;
}

export interface DestinationSearchResult {
  query: string;
  destinations: DestinationSuggestion[];
  hotels: DestinationSuggestion[];
  experiences: DestinationSuggestion[];
}

export interface RealPlace {
  placeId: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  rating?: number;
  priceLevel?: string;
  formattedAddress?: string;
  estimatedCost?: number;
  description?: string;
}

export interface DestinationDetail {
  name: string;
  country: string;
  region: string;
  tagline: string;
  description: string;
  heroImage: string;
  bestTimeToVisit: string;
  currency: string;
  avgDailyCost: number;
  rating: number;
  popularStyles: string[];
  places: RealPlace[];
  hotels: DestinationSuggestion[];
  experiences: DestinationSuggestion[];
}

export async function searchDestinationsApi(query: string): Promise<DestinationSearchResult> {
  const response = await apiClient.get<DestinationSearchResult>(`/api/explore/search?query=${encodeURIComponent(query)}`);
  return response.data;
}

export async function fetchDestinationDetailApi(name: string): Promise<DestinationDetail> {
  const response = await apiClient.get<DestinationDetail>(`/api/explore/destinations/${encodeURIComponent(name)}`);
  return response.data;
}
