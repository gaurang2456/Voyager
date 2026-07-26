import { apiClient } from '../services/axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/dto';

export async function loginApi(payload: LoginRequest): Promise<string> {
  const response = await apiClient.post<string | AuthResponse>('/api/auth/login', payload);
  if (typeof response.data === 'string') {
    return response.data;
  }
  if (response.data && response.data.token) {
    return response.data.token;
  }
  return String(response.data);
}

export async function registerApi(payload: RegisterRequest): Promise<string> {
  const response = await apiClient.post<string>('/api/auth/register', payload);
  return typeof response.data === 'string' ? response.data : 'User registered successfully';
}
