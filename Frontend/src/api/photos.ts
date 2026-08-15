import { apiClient } from '../services/axios';

export interface TripPhotoDto {
  id: number;
  tripId: number;
  url: string;
  title: string;
  locationName: string;
  uploadedAt: string;
}

export interface UploadPhotoRequest {
  url: string;
  title?: string;
  locationName?: string;
}

export async function fetchTripPhotosApi(tripId: number | string): Promise<TripPhotoDto[]> {
  const response = await apiClient.get<TripPhotoDto[]>(`/api/trips/${tripId}/photos`);
  return response.data;
}

export async function uploadTripPhotoApi(
  tripId: number | string,
  payload: UploadPhotoRequest
): Promise<TripPhotoDto> {
  const response = await apiClient.post<TripPhotoDto>(`/api/trips/${tripId}/photos`, payload);
  return response.data;
}

export async function deleteTripPhotoApi(
  tripId: number | string,
  photoId: number | string
): Promise<void> {
  await apiClient.delete(`/api/trips/${tripId}/photos/${photoId}`);
}
