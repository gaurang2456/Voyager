import { apiClient } from '../services/axios';
import type { TripResponse, CreateTripRequest, UpdateTripRequest } from '../types/dto';

export async function fetchMyTripsApi(): Promise<TripResponse[]> {
  const response = await apiClient.get<TripResponse[]>('/api/trips');
  return response.data;
}

export async function fetchTripByIdApi(id: number | string): Promise<TripResponse> {
  const response = await apiClient.get<TripResponse>(`/api/trips/${id}`);
  return response.data;
}

export async function createTripApi(payload: CreateTripRequest): Promise<TripResponse> {
  const response = await apiClient.post<TripResponse>('/api/trips', payload);
  return response.data;
}

export async function updateTripApi(id: number | string, payload: UpdateTripRequest): Promise<TripResponse> {
  const response = await apiClient.put<TripResponse>(`/api/trips/${id}`, payload);
  return response.data;
}

export async function deleteTripApi(id: number | string): Promise<void> {
  await apiClient.delete(`/api/trips/${id}`);
}
