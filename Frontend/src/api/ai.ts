import { regenerateItineraryApi } from './itinerary';
import type { ItineraryResponse } from '../types/dto';

export async function processAiItineraryCommand(
  tripId: number | string,
  userPrompt: string
): Promise<ItineraryResponse> {
  return regenerateItineraryApi(tripId, userPrompt);
}

export { regenerateItineraryApi };
