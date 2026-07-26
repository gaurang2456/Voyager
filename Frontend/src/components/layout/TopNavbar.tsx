import React, { useState } from 'react';
import { Luggage, User, Sparkles, ChevronDown, Check, Sun, Moon, Clock } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useMyTripsQuery } from '../../hooks/useTrips';
import { useItineraryQuery } from '../../hooks/useItinerary';
import { transformItineraryResponseToDays } from '../../api/itinerary';

interface TopNavbarProps {
  onOpenTrips: () => void;
  onOpenExplore: () => void;
  onOpenProfile: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenTrips,
  onOpenProfile,
}) => {
  const {
    activeTripId,
    activeDayNumber,
    setActiveTrip,
    selectedActivityId,
    setSelectedActivity,
    setHoveredActivity,
  } = useTravelStore();

  const { user, token } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: myTrips = [] } = useMyTripsQuery(Boolean(token));
  const activeTrip = myTrips.find((t) => String(t.id) === String(activeTripId)) || myTrips[0];

  const numericTripId = activeTripId ? Number(activeTripId) : null;
  const { data: itineraryData } = useItineraryQuery(numericTripId, Boolean(token && numericTripId));
  const days = itineraryData ? transformItineraryResponseToDays(itineraryData) : [];
  const currentDay = days.find((d) => d.dayNumber === activeDayNumber) || days[0];
  const activities = currentDay?.activities || [];

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

      {/* Center: Sleek Live Day Progress Tracker Pill (Taupe Palette) */}
      {activities.length > 0 && (
        <div className="hidden lg:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FAF8F3]/90 backdrop-blur-2xl border border-[#E8E2D5] shadow-md shadow-amber-950/5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#6E665C] shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#C19A6B]" />
            <span>{activities[0].time}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {activities.map((act, index) => {
              const isSelected = selectedActivityId === act.id;
              const isCompleted = act.status === 'completed';
              const isCurrent = act.status === 'current';

              return (
                <React.Fragment key={act.id}>
                  {index > 0 && (
                    <div className={`h-[2px] w-3 rounded-full transition-colors ${
                      isCompleted ? 'bg-[#5FAF8D]' : 'bg-[#E8E2D5]'
                    }`} />
                  )}

                  <div className="relative group">
                    <button
                      onClick={() => setSelectedActivity(isSelected ? null : act.id)}
                      onMouseEnter={() => setHoveredActivity(act.id)}
                      onMouseLeave={() => setHoveredActivity(null)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#8E2A59] text-white ring-2 ring-[#8E2A59]/30 scale-110 shadow-sm'
                          : isCurrent
                          ? 'bg-[#4A443D] text-white ring-2 ring-[#4A443D]/30 scale-105'
                          : isCompleted
                          ? 'bg-[#5FAF8D] text-white'
                          : 'bg-[#EFE8DD] text-[#2F2A24] border border-[#E8E2D5] hover:bg-[#E6DEC9]'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3 h-3 text-white" /> : index + 1}
                    </button>

                    {/* Rich Hover Tooltip Card - Taupe */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:flex flex-col gap-1 p-2.5 rounded-xl bg-[#4A443D] text-white shadow-2xl text-[10px] whitespace-nowrap pointer-events-none z-50 border border-[#5C5346] animate-fadeIn">
                      <div className="font-extrabold text-xs text-white max-w-[160px] truncate">{act.title}</div>
                      <div className="flex items-center justify-between gap-3 text-stone-300">
                        <span className="font-medium">{act.time}</span>
                        <span className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wide ${
                          isCompleted
                            ? 'bg-[#5FAF8D]/20 text-[#5FAF8D] border border-[#5FAF8D]/30'
                            : isCurrent
                            ? 'bg-[#4A443D]/20 text-[#C19A6B] border border-[#5C5346]/30'
                            : 'bg-stone-800 text-stone-300'
                        }`}>
                          {act.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <span className="text-[10px] font-bold text-[#6E665C] shrink-0">
            {activities[activities.length - 1].time}
          </span>
        </div>
      )}

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
