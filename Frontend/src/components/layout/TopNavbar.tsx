import React, { useState } from 'react';
import { Compass, Luggage, User, Sparkles, ChevronDown, Check, Sun, Moon } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import type { ActivityCategory } from '../../types/travel';

interface TopNavbarProps {
  onOpenTrips: () => void;
  onOpenExplore: () => void;
  onOpenProfile: () => void;
}

const CATEGORY_FILTERS: { id: ActivityCategory | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: 'bg-slate-700 dark:bg-slate-300' },
  { id: 'sightseeing', label: 'Sightseeing', color: 'bg-blue-500' },
  { id: 'food', label: 'Food', color: 'bg-emerald-500' },
  { id: 'shopping', label: 'Shopping', color: 'bg-purple-500' },
  { id: 'hotel', label: 'Hotel', color: 'bg-amber-500' },
];

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenTrips,
  onOpenExplore,
  onOpenProfile,
}) => {
  const { trips, activeTripId, setActiveTrip, filterCategory, setFilterCategory } = useTravelStore();
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];
  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  return (
    <header className="absolute top-3 left-4 right-4 md:left-5 md:right-5 z-30 flex items-center justify-between pointer-events-auto">
      
      {/* Left: Minimal Brand & Switcher */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-900/90 text-white font-extrabold text-[11px] shadow-sm tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
          <span>Voyager</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Select Trip Destination"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xs text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>{activeTrip.destination}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-44 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl p-1 z-50 animate-fadeIn">
              {trips.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTrip(t.id);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div>
                    <div>{t.destination}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{t.dates}</div>
                  </div>
                  {t.id === activeTripId && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Category Filters */}
      <div className="hidden md:flex items-center gap-1 p-0.5 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {CATEGORY_FILTERS.map((cat) => {
          const isSelected = filterCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cat.color}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Minimal Navigation & Theme Toggle */}
      <nav className="flex items-center gap-1 p-0.5 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <button
          onClick={onOpenTrips}
          aria-label="View Trips"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <Luggage className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">Trips</span>
        </button>

        <button
          onClick={onOpenExplore}
          aria-label="Explore places"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden sm:inline">Explore</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-slate-700 transition-transform duration-300 rotate-0 hover:-rotate-12" />
          )}
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={onOpenProfile}
          aria-label="User Profile"
          title={user?.name || 'User Profile'}
          className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-xs hover:bg-blue-500 active:scale-95 transition-all cursor-pointer ml-0.5"
        >
          {userInitials || <User className="w-3 h-3" />}
        </button>
      </nav>

    </header>
  );
};

export default TopNavbar;
