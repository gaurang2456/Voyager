import { useQuery } from '@tanstack/react-query';
import { fetchTripWeatherApi } from '../api/weather';

export function useWeatherQuery(tripId: number | string | null, enabled = true) {
  return useQuery({
    queryKey: ['weather', tripId],
    queryFn: () => fetchTripWeatherApi(tripId!),
    enabled: enabled && Boolean(tripId),
    staleTime: 1000 * 60 * 15,
  });
}
