import React, { useState } from 'react';
import {
  X,
  Navigation,
  RefreshCw,
  SkipForward,
  Info,
  Clock,
  Star,
  MapPin,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import type { ActivityCategory } from '../../types/travel';

const getCategoryStyles = (category: ActivityCategory) => {
  switch (category) {
    case 'sightseeing':
      return { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200/60 dark:border-blue-800/60' };
    case 'food':
      return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200/60 dark:border-emerald-800/60' };
    case 'shopping':
      return { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200/60 dark:border-purple-800/60' };
    case 'hotel':
      return { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200/60 dark:border-amber-800/60' };
  }
};

export const ActivityDetailPanel: React.FC = () => {
  const {
    trips,
    activeTripId,
    activeDayNumber,
    selectedActivityId,
    isPanelOpen,
    setPanelOpen,
    skipActivity,
    replaceActivity,
    setHoveredActivity,
  } = useTravelStore();

  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);

  const currentTrip = trips.find((t) => t.id === activeTripId);
  const currentDay = currentTrip?.days.find((d) => d.dayNumber === activeDayNumber);
  const activity = currentDay?.activities.find((a) => a.id === selectedActivityId);

  if (!isPanelOpen || !activity) return null;

  const categoryStyles = getCategoryStyles(activity.category);
  const isSkipped = activity.status === 'skipped';
  const isCompleted = activity.status === 'completed';

  const handleNavigate = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${activity.title} ${activity.locationName}`
    )}`;
    window.open(mapsUrl, '_blank');
  };

  const handleReplace = () => {
    setIsReplacing(true);
    setTimeout(() => {
      replaceActivity(activity.id);
      setIsReplacing(false);
    }, 400);
  };

  return (
    <div
      onMouseEnter={() => setHoveredActivity(activity.id)}
      onMouseLeave={() => setHoveredActivity(null)}
      className="absolute bottom-20 left-4 right-4 top-auto w-auto max-w-none md:top-16 md:right-5 md:left-auto md:w-72 md:max-w-[288px] md:bottom-auto z-40 pointer-events-auto transition-all duration-300 animate-fadeIn"
    >
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 shadow-xl rounded-2xl p-3.5 flex flex-col gap-2.5 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
        
        {/* Header Row: Title & Close */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              {isCompleted && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Done
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize border ${categoryStyles.bg} ${categoryStyles.text} ${categoryStyles.border}`}>
                {activity.category}
              </span>
              {activity.priority === 'high' && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  High
                </span>
              )}
            </div>
            <h2 className={`text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug ${isSkipped ? 'line-through opacity-50' : ''}`}>
              {activity.title}
            </h2>
          </div>

          <button
            onClick={() => setPanelOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Time, Duration & Rating */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>{activity.time} • {activity.durationMinutes}m</span>
          </div>
          {activity.rating && (
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{activity.rating}</span>
            </div>
          )}
        </div>

        {/* Location & Cost Row */}
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <div className="p-1.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">Location</div>
            <div className="font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5 text-[11px]" title={activity.locationName}>
              {activity.locationName}
            </div>
          </div>

          <div className="p-1.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-[10px] text-slate-400 font-medium">Est. Cost</div>
            <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 text-[11px]">
              {activity.estimatedCost === 0 ? 'Free' : `$${activity.estimatedCost}`}
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {activity.description}
        </p>

        {/* Weather Suitability Recommendation Pill */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-blue-500/8 dark:bg-blue-950/30 border border-blue-500/15 text-xs text-blue-700 dark:text-blue-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="text-[11px] leading-tight">{activity.weatherSuitability}</span>
        </div>

        {/* Extra Details Collapsible */}
        {showMoreDetails && (
          <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1.5 animate-fadeIn">
            <div className="flex justify-between">
              <span>Peak Hours</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">11:00 AM – 3:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Accessibility</span>
              <span className="font-semibold text-emerald-600">Wheelchair Accessible</span>
            </div>
          </div>
        )}

        {/* Action Buttons Section Directly Below Content */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5">
          <button
            onClick={handleNavigate}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Navigate in Maps</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
          </button>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={handleReplace}
              disabled={isReplacing}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-98 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isReplacing ? 'animate-spin' : ''}`} />
              <span>Replace</span>
            </button>

            <button
              onClick={() => skipActivity(activity.id)}
              className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl border text-xs font-semibold active:scale-98 transition-all cursor-pointer ${
                isSkipped
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <SkipForward className="w-3 h-3" />
              <span>{isSkipped ? 'Unskip' : 'Skip'}</span>
            </button>
          </div>

          <button
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="w-full flex items-center justify-center gap-1 py-0.5 text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Info className="w-3 h-3" />
            <span>{showMoreDetails ? 'Less Info' : 'More Details'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ActivityDetailPanel;
