import React, { useEffect, useState } from 'react';
import { ChevronDown, Clock, Check, Compass } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { fetchRealRoute } from '../../services/routeService';
import type { ActivityCategory } from '../../types/travel';

const getCategoryColorDot = (category: ActivityCategory) => {
  switch (category) {
    case 'sightseeing':
      return 'border-blue-500 text-blue-600';
    case 'food':
      return 'border-emerald-500 text-emerald-600';
    case 'shopping':
      return 'border-sky-500 text-sky-600';
    case 'hotel':
      return 'border-amber-500 text-amber-600';
  }
};

export const FloatingTimeline: React.FC = () => {
  const {
    trips,
    activeTripId,
    activeDayNumber,
    setActiveDay,
    selectedActivityId,
    setSelectedActivity,
    hoveredActivityId,
    setHoveredActivity,
    filterCategory,
  } = useTravelStore();

  const [routeDistance, setRouteDistance] = useState<number>(0);

  const currentTrip = trips.find((t) => t.id === activeTripId) || trips[0];
  const currentDay = currentTrip.days.find((d) => d.dayNumber === activeDayNumber) || currentTrip.days[0];

  const rawActivities = currentDay?.activities || [];
  const activities = filterCategory === 'all'
    ? rawActivities
    : rawActivities.filter((a) => a.category === filterCategory);

  useEffect(() => {
    if (activities.length < 2) {
      setRouteDistance(0);
      return;
    }
    let isMounted = true;
    const waypoints = activities.map((a) => ({ lat: a.lat, lng: a.lng }));
    fetchRealRoute(waypoints).then((res) => {
      if (isMounted) {
        setRouteDistance(res.distanceKm);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [activities]);

  const totalCost = activities.reduce((sum, act) => sum + act.estimatedCost, 0);
  const timeSpan = activities.length > 0
    ? `${activities[0].time} → ${activities[activities.length - 1].time}`
    : 'Full Day';

  return (
    <div className="absolute top-16 left-4 md:top-28 md:left-5 z-30 flex flex-col gap-2 pointer-events-auto max-w-[185px] sm:max-w-[215px] transition-all">
      
      {/* Day Selector Pill Bar */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 shadow-md">
        {currentTrip.days.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDay(day.dayNumber)}
            className={`flex-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
              day.dayNumber === activeDayNumber
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs scale-105'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Day {day.dayNumber}
          </button>
        ))}
      </div>

      {/* Compact "Today's Journey" Summary Card */}
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 shadow-md rounded-2xl p-2.5 flex flex-col gap-1.5 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
          <span className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            Today's Journey
          </span>
          <span className="text-[10px] text-slate-400 font-normal">{timeSpan}</span>
        </div>

        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Activities: <strong className="text-slate-900 dark:text-white">{activities.length}</strong></span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Distance: <strong className="text-slate-900 dark:text-white">{routeDistance || 4.2} km</strong></span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            <span>Est. Cost: <strong className="text-slate-900 dark:text-white">${totalCost}</strong></span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Weather: <strong className="text-slate-900 dark:text-white truncate">{currentTrip.weather.condition}</strong></span>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Container */}
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 shadow-xl rounded-2xl p-2.5 max-h-[calc(100vh-310px)] overflow-y-auto custom-scrollbar transition-all duration-300">
        
        <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <Clock className="w-3 h-3 text-blue-500" />
            <span>Timeline Path</span>
          </div>
        </div>

        {/* Vertical Nodes */}
        <div className="relative flex flex-col gap-2.5 my-1">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-slate-200 dark:bg-slate-800 z-0" />

          {activities.map((act, index) => {
            const isSelected = act.id === selectedActivityId;
            const isHovered = act.id === hoveredActivityId;
            const isCompleted = act.status === 'completed';
            const isCurrent = act.status === 'current' || isSelected;
            const categoryBorder = getCategoryColorDot(act.category);

            return (
              <React.Fragment key={act.id}>
                <button
                  onClick={() => setSelectedActivity(act.id)}
                  onMouseEnter={() => setHoveredActivity(act.id)}
                  onMouseLeave={() => setHoveredActivity(null)}
                  className={`group relative z-10 flex items-start gap-2 p-1.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-500/15 dark:bg-blue-500/25 border border-blue-500/40 shadow-xs ring-1 ring-blue-500/30'
                      : isHovered
                      ? 'bg-slate-100/90 dark:bg-slate-800/90 scale-[1.02]'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {/* Progress Marker Indicator */}
                  <div className="relative mt-0.5 shrink-0">
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 text-[10px] font-bold">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                    ) : isCurrent ? (
                      <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] shadow-md ring-2 ring-blue-500/40 animate-pulse">
                        {act.order}
                      </div>
                    ) : (
                      <div className={`w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 ${categoryBorder} flex items-center justify-center text-[10px] font-bold shadow-xs`}>
                        {act.order}
                      </div>
                    )}
                  </div>

                  {/* Details: Time & Title */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold text-slate-400 leading-none">
                      {act.time}
                    </div>
                    <p className={`text-[11px] font-bold truncate leading-tight mt-0.5 ${
                      isCompleted ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-100'
                    }`}>
                      {act.title}
                    </p>
                  </div>
                </button>

                {/* Connector Arrow */}
                {index < activities.length - 1 && (
                  <div className="flex justify-start ml-2 -my-1.5 z-0">
                    <ChevronDown className="w-3 h-3 text-slate-300 dark:text-slate-700 opacity-60" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default FloatingTimeline;
