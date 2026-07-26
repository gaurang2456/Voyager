import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyTripsApi, fetchTripByIdApi, createTripApi, updateTripApi, deleteTripApi } from '../api/trips';
import type { CreateTripRequest, UpdateTripRequest } from '../types/dto';

export function useMyTripsQuery(enabled = true) {
  return useQuery({
    queryKey: ['trips'],
    queryFn: fetchMyTripsApi,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: 1,
  });
}

export function useTripDetailQuery(tripId: number | string | null, enabled = true) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => fetchTripByIdApi(tripId!),
    enabled: enabled && Boolean(tripId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateTripMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTripRequest) => createTripApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useUpdateTripMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateTripRequest }) => updateTripApi(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trip', variables.id] });
    },
  });
}

export function useDeleteTripMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteTripApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}
