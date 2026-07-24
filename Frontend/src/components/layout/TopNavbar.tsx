import React, { useState } from 'react';
import { Compass, Luggage, User, Sparkles, ChevronDown, Check, Sun, Moon, Clock, CheckCircle2 } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';

interface TopNavbarProps {
  onOpenTrips: () => void;
  onOpenExplore: () => void;
  onOpenProfile: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenTrips,
  onOpenExplore,
  onOpenProfile,
}) => {
  const {
    trips,
    activeTripId,
    activeDayNumber,
    setActiveTrip,
    selectedActivityId,
    setSelectedActivity,
    setHoveredActivity,
  } = useTravelStore();

  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];
  const currentDay = activeTrip?.days.find((d) => d.dayNumber === activeDayNumber) || activeTrip?.days[0];
  const activities = currentDay?.activities || [];

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  return (
    <header className="absolute top-3 left-4 right-4 md:left-5 md:right-5 z-30 flex items-center justify-between pointer-events-auto gap-2">
      
      {/* Left: Minimal Brand & Destination Selector */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-900/90 text-white font-extrabold text-[11px] shadow-sm tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
          <span>Voyager</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="Select Trip Destination"
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-md shadow-slate-900/5 text-left hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <div className="flex flex-col leading-none">
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-100">{activeTrip.destination}</span>
              {activeTrip.personalityTags && activeTrip.personalityTags.length > 0 && (
                <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">{activeTrip.personalityTags[0]}</span>
              )}
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-52 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-1 z-50 animate-fadeIn">
              {trips.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTrip(t.id);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-bold flex items-center gap-1">
                      <span>{t.destination}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({t.country})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal mb-1">{t.dates}</div>
                    {t.personalityTags && t.personalityTags.length > 0 && (
                      <div className="flex items-center gap-1 text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                        {t.personalityTags.join(' • ')}
                      </div>
                    )}
                  </div>
                  {t.id === activeTripId && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Premium Horizontal Journey Progress Bar with Rich Tooltips */}
      {activities.length > 0 && (
        <div className="hidden lg:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-md shadow-slate-900/5 text-xs">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3 text-blue-500" />
            {activities[0].time}
          </span>

          <div className="flex items-center gap-1.5">
            {activities.map((act, index) => {
              const isSelected = selectedActivityId === act.id;
              const isCompleted = act.status === 'completed';
              const isCurrent = act.status === 'current';

              return (
                <React.Fragment key={act.id}>
                  {/* Connector Segment */}
                  {index > 0 && (
                    <div
                      className={`h-0.5 w-6 rounded-full transition-colors duration-500 ${
                        isCompleted || (activities[index - 1] && activities[index - 1].status === 'completed')
                          ? 'bg-emerald-500'
                          : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  )}

                  {/* Interactive Step Node & Hover Card */}
                  <div className="relative group">
                    <button
                      onClick={() => setSelectedActivity(act.id)}
                      onMouseEnter={() => setHoveredActivity(act.id)}
                      onMouseLeave={() => setHoveredActivity(null)}
                      aria-label={`Journey step ${index + 1}: ${act.title}`}
                      className={`relative w-5.5 h-5.5 rounded-full text-[10px] font-extrabold flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 scale-110 z-10'
                          : isCurrent
                          ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/50 animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3 h-3 text-white" /> : index + 1}
                    </button>

                    {/* Rich Hover Tooltip Card */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:flex flex-col gap-1 p-2.5 rounded-xl bg-slate-950 text-white shadow-2xl text-[10px] whitespace-nowrap pointer-events-none z-50 border border-slate-800 animate-fadeIn">
                      <div className="font-extrabold text-xs text-white max-w-[160px] truncate">{act.title}</div>
                      <div className="flex items-center justify-between gap-3 text-slate-400">
                        <span className="font-medium">{act.time}</span>
                        <span className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wide ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isCurrent
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400'
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

          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
            {activities[activities.length - 1].time}
          </span>
        </div>
      )}

      {/* Right: Minimal Navigation & Theme Toggle */}
      <nav className="flex items-center gap-1 p-0.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-md shadow-slate-900/5 shrink-0">
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
