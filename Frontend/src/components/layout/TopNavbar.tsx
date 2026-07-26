import React, { useState } from 'react';
import { Luggage, User, Sparkles, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useMyTripsQuery } from '../../hooks/useTrips';

interface TopNavbarProps {
  onOpenTrips: () => void;
  onOpenExplore?: () => void;
  onOpenProfile: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenTrips,
  onOpenProfile,
}) => {
  const {
    activeTripId,
    setActiveTrip,
  } = useTravelStore();

  const { user, token } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: myTrips = [] } = useMyTripsQuery(Boolean(token));
  const activeTrip = myTrips.find((t) => String(t.id) === String(activeTripId)) || myTrips[0];

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  return (
    <header className="absolute top-3 left-4 right-4 md:left-5 md:right-5 z-30 flex items-center justify-between pointer-events-auto gap-2">
      
      {/* Left: Minimal Brand & Destination Selector */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#4A443D] text-[#FAF8F3] font-serif-luxury font-bold text-xs shadow-md tracking-wider border border-[#5C5346]">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>Voyager</span>
        </div>

        {activeTrip && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F3] backdrop-blur-2xl border border-[#E8E2D5] text-[#2F2A24] text-xs font-bold shadow-md shadow-amber-950/5 hover:bg-[#F3EFE8] transition-all cursor-pointer"
            >
              <span className="truncate max-w-[120px]">{activeTrip.destination}</span>
              {activeTrip.startDate && (
                <span className="text-[10px] text-slate-400 font-normal hidden lg:inline">
                  {activeTrip.startDate.substring(0, 7)}
                </span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Destination Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-[#FAF8F3] border border-[#E8E2D5] rounded-2xl shadow-xl p-1.5 z-50 text-[#2F2A24] animate-fadeIn">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#A59E93] px-2 py-1">
                  Switch Journey
                </div>
                {myTrips.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTrip(String(t.id));
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      String(t.id) === String(activeTripId)
                        ? 'bg-[#C19A6B]/15 text-[#8E2A59]'
                        : 'hover:bg-[#F3EFE8] text-[#6E665C]'
                    }`}
                  >
                    <span className="truncate">{t.destination}</span>
                    {t.startDate && <span className="text-[10px] text-slate-400">{t.startDate}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Minimal Navigation & Theme Toggle */}
      <nav className="flex items-center gap-1 p-0.5 rounded-full bg-[#FAF8F3] backdrop-blur-2xl border border-[#E8E2D5] shadow-md shadow-amber-950/5 shrink-0">
        <button
          onClick={onOpenTrips}
          aria-label="View Trips"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <Luggage className="w-3.5 h-3.5 text-[#C19A6B]" />
          <span className="hidden sm:inline">Trips</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-slate-600" />
          )}
        </button>

        {/* User Profile Button */}
        <button
          onClick={onOpenProfile}
          aria-label="User Profile"
          title={user?.name || user?.email || 'User Profile'}
          className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4A443D] text-white font-bold text-[10px] shadow-sm hover:opacity-90 transition-all cursor-pointer shrink-0"
        >
          {userInitials || <User className="w-3 h-3 text-[#FAF8F3]" />}
        </button>
      </nav>

    </header>
  );
};

export default TopNavbar;
