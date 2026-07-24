import { create } from 'zustand';
import {
  loginUser,
  registerUser,
  getStoredAuthData,
  clearAuthData,
} from '../services/authService';
import type { AuthUser, LoginPayload, RegisterPayload } from '../services/authService';

export type AuthView = 'landing' | 'login' | 'register' | 'map';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  currentView: AuthView;
  isLoading: boolean;
  error: string | null;

  setView: (view: AuthView) => void;
  checkAuth: () => boolean;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  currentView: 'landing',
  isLoading: false,
  error: null,

  setView: (view: AuthView) => set({ currentView: view, error: null }),

  checkAuth: () => {
    const authData = getStoredAuthData();
    if (authData && authData.token) {
      set({
        token: authData.token,
        user: authData.user,
        currentView: 'map',
      });
      return true;
    }
    return false;
  },

  login: async (payload: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await loginUser(payload);
      set({
        token: result.token,
        user: result.user,
        currentView: 'map',
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({
        error: err.message || 'Authentication failed. Please check your credentials.',
        isLoading: false,
      });
      return false;
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true, error: null });
    try {
      await registerUser(payload);
      // Auto-login after successful registration
      const result = await loginUser({ email: payload.email, password: payload.password });
      set({
        token: result.token,
        user: { name: payload.name, email: payload.email },
        currentView: 'map',
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({
        error: err.message || 'Registration failed. Please try again.',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    clearAuthData();
    set({
      token: null,
      user: null,
      currentView: 'login',
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
