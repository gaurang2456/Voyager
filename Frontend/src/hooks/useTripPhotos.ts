import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTripPhotosApi, uploadTripPhotoApi, deleteTripPhotoApi } from '../api/photos';
import type { UploadPhotoRequest } from '../api/photos';

export function useTripPhotosQuery(tripId: number | string | null, enabled = true) {
  return useQuery({
    queryKey: ['tripPhotos', tripId],
    queryFn: () => fetchTripPhotosApi(tripId!),
    enabled: enabled && Boolean(tripId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useUploadPhotoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, payload }: { tripId: number | string; payload: UploadPhotoRequest }) =>
      uploadTripPhotoApi(tripId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tripPhotos', variables.tripId] });
    },
  });
}

export function useDeletePhotoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tripId, photoId }: { tripId: number | string; photoId: number | string }) =>
      deleteTripPhotoApi(tripId, photoId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tripPhotos', variables.tripId] });
    },
  });
}
