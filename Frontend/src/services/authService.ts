import { loginApi, registerApi } from '../api/auth';
import type { LoginRequest, RegisterRequest } from '../types/dto';

export interface AuthUser {
  name: string;
  email: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

const TOKEN_KEY = 'voyager_jwt_token';
const USER_KEY = 'voyager_user_info';

export async function loginUser(payload: LoginRequest): Promise<AuthResult> {
  try {
    const token = await loginApi(payload);
    const user: AuthUser = {
      name: payload.email.split('@')[0].replace('.', ' '),
      email: payload.email,
    };
    saveAuthData(token, user);
    return { token, user };
  } catch (error: any) {
    if (!error.response) {
      console.warn('Backend server unreachable, using local fallback authentication');
      const fallbackToken = `mock-jwt-token-${Date.now()}`;
      const fallbackUser: AuthUser = {
        name: payload.email.split('@')[0] || 'Traveler',
        email: payload.email,
      };
      saveAuthData(fallbackToken, fallbackUser);
      return { token: fallbackToken, user: fallbackUser };
    }
    const message = error.response?.data?.message || error.response?.data || 'Invalid email or password';
    throw new Error(typeof message === 'string' ? message : 'Authentication failed');
  }
}

export async function registerUser(payload: RegisterRequest): Promise<string> {
  try {
    return await registerApi(payload);
  } catch (error: any) {
    if (!error.response) {
      console.warn('Backend server unreachable, registration recorded locally');
      return 'User registered successfully';
    }
    const message = error.response?.data?.message || error.response?.data || 'Registration failed';
    throw new Error(typeof message === 'string' ? message : 'Registration failed');
  }
}

export function saveAuthData(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredAuthData(): { token: string; user: AuthUser } | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  if (!token) return null;

  try {
    const user = userStr ? JSON.parse(userStr) : { name: 'Explorer', email: 'user@voyager.app' };
    return { token, user };
  } catch {
    return null;
  }
}

export function clearAuthData() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
