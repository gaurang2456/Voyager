import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchItineraryApi, generateItineraryApi, regenerateItineraryApi } from '../api/itinerary';

export function useItineraryQuery(tripId: number | string | null, enabled = true) {
  return useQuery({
    queryKey: ['itinerary', tripId ? Number(tripId) : null],
    queryFn: () => fetchItineraryApi(tripId!),
    enabled: enabled && Boolean(tripId),
    retry: false,
    staleTime: 1000 * 60 * 10,
  });
}

export function useGenerateItineraryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: number | string) => generateItineraryApi(tripId),
    onSuccess: (data, tripId) => {
      const numId = Number(tripId);
      queryClient.setQueryData(['itinerary', numId], data);
      queryClient.invalidateQueries({ queryKey: ['itinerary', numId] });
    },
  });
}

export function useRegenerateItineraryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, prompt }: { tripId: number | string; prompt?: string }) =>
      regenerateItineraryApi(tripId, prompt),
    onSuccess: (data, variables) => {
      const numId = Number(variables.tripId);
      queryClient.setQueryData(['itinerary', numId], data);
      queryClient.invalidateQueries({ queryKey: ['itinerary', numId] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['weather', numId] });
    },
  });
}
