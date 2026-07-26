import { apiClient } from '../services/axios';
import type { ItineraryResponse, ActivityResponse } from '../types/dto';
import type { DayItinerary, Activity, ActivityCategory, PriorityLevel, ActivityStatus } from '../types/travel';

export async function fetchItineraryApi(tripId: number | string): Promise<ItineraryResponse> {
  const response = await apiClient.get<ItineraryResponse>(`/api/trips/${tripId}/itinerary`);
  return response.data;
}

export async function generateItineraryApi(tripId: number | string): Promise<ItineraryResponse> {
  const response = await apiClient.post<ItineraryResponse>(`/api/trips/${tripId}/itinerary/generate`);
  return response.data;
}

export async function regenerateItineraryApi(tripId: number | string, prompt?: string): Promise<ItineraryResponse> {
  const url = prompt
    ? `/api/trips/${tripId}/itinerary/regenerate?prompt=${encodeURIComponent(prompt)}`
    : `/api/trips/${tripId}/itinerary/regenerate`;
  const response = await apiClient.post<ItineraryResponse>(url);
  return response.data;
}

export function transformItineraryResponseToDays(itinerary: ItineraryResponse): DayItinerary[] {
  if (!itinerary || !itinerary.days) return [];

  return itinerary.days.map((dayDto) => {
    const dayNumber = dayDto.dayNumber || 1;
    const activities: Activity[] = (dayDto.activities || []).map((actDto: ActivityResponse, idx: number) => {
      const catLower = (actDto.category || 'sightseeing').toLowerCase();
      let category: ActivityCategory = 'sightseeing';
      if (catLower.includes('food') || catLower.includes('restaurant') || catLower.includes('cafe') || catLower.includes('dining')) {
        category = 'food';
      } else if (catLower.includes('shop') || catLower.includes('store') || catLower.includes('boutique') || catLower.includes('market')) {
        category = 'shopping';
      } else if (catLower.includes('hotel') || catLower.includes('stay') || catLower.includes('resort') || catLower.includes('lodging')) {
        category = 'hotel';
      }

      const order = idx + 1;
      // Default to 'current' for 1st activity and 'upcoming' for rest — NEVER pre-mark as completed
      const status: ActivityStatus = order === 1 ? 'current' : 'upcoming';
      const formattedTime = actDto.startTime ? actDto.startTime.substring(0, 5) : '10:00';

      return {
        id: String(actDto.id || `act-${idx + 1}`),
        order,
        time: formattedTime,
        title: actDto.title || 'Featured Attraction',
        category,
        priority: (idx === 0 || idx === 1 ? 'high' : 'medium') as PriorityLevel,
        description: actDto.description || 'AI curated experience based on your journey style.',
        estimatedCost: actDto.estimatedCost ?? 20,
        weatherSuitability: '☀️ Ideal condition for activity',
        lat: actDto.latitude || 35.6764,
        lng: actDto.longitude || 139.6993,
        locationName: actDto.title ? `${actDto.title} District` : 'City Center',
        status,
        durationMinutes: 90,
        rating: 4.8,
      };
    });

    return {
      dayNumber,
      date: dayDto.date || `Day ${dayNumber}`,
      title: dayDto.summary || `Day ${dayNumber} Highlights`,
      activities,
    };
  });
}
