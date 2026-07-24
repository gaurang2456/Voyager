import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const STORAGE_KEY = 'voyager_theme_mode';

function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  // Detect system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'dark'; // Default to sleek dark mode
}

function applyThemeClass(theme: ThemeMode) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

// Initial application of theme class
const initialTheme = getInitialTheme();
applyThemeClass(initialTheme);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,

  toggleTheme: () => {
    const nextTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyThemeClass(nextTheme);
    set({ theme: nextTheme });
  },

  setTheme: (theme: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, theme);
    applyThemeClass(theme);
    set({ theme });
  },
}));
