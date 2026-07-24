import React, { useEffect, useState } from 'react';
import { ChevronDown, Clock, Check, Compass } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { fetchRealRoute } from '../../services/routeService';
import type { ActivityCategory } from '../../types/travel';

const getCategoryColorDot = (category: ActivityCategory) => {
  switch (category) {
    case 'sightseeing':
      return 'border-[#C19A6B] text-[#C19A6B]';
    case 'food':
      return 'border-[#708238] text-[#556B2F]';
    case 'shopping':
      return 'border-[#8E2A59] text-[#8E2A59]';
    case 'hotel':
      return 'border-[#D97724] text-[#D97724]';
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
      <div className="flex items-center gap-1 p-1 rounded-full bg-[#FAF8F3] backdrop-blur-2xl border border-[#E8E2D5] shadow-md shadow-amber-950/5">
        {currentTrip.days.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDay(day.dayNumber)}
            className={`flex-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
              day.dayNumber === activeDayNumber
                ? 'bg-[#4A443D] text-white shadow-xs scale-105 border border-[#5C5346]'
                : 'text-[#6E665C] hover:bg-[#EFE8DD]'
            }`}
          >
            Day {day.dayNumber}
          </button>
        ))}
      </div>

      {/* Vertical Timeline Container */}
      <div className="bg-[#FAF8F3] backdrop-blur-2xl border border-[#EFE8DD] shadow-lg shadow-amber-950/5 rounded-2xl p-3 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar transition-all duration-300">
        
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E2D6]">
          <div className="flex items-center gap-1.5 font-serif-luxury text-xs font-bold text-[#2F2A24]">
            <Clock className="w-3.5 h-3.5 text-[#C19A6B]" />
            <span>Itinerary Route</span>
          </div>
        </div>

        {/* Vertical Nodes */}
        <div className="relative flex flex-col gap-2.5 my-1">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-[#E8E2D6] z-0" />

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
                  className={`group relative z-10 flex items-start gap-2.5 p-2 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                    isSelected || isCurrent
                      ? 'bg-[#4A443D]/10 border border-[#4A443D] shadow-xs ring-1 ring-[#5C5346]/30'
                      : isCompleted
                      ? 'bg-[#FAF8F3]/60 border border-[#E8E2D6] opacity-85 hover:opacity-100'
                      : isHovered
                      ? 'bg-[#F3EFE6] scale-[1.02]'
                      : 'bg-[#F8F5EF]/60 border border-[#E8E2D6]/80 hover:bg-[#F3EFE6]'
                  }`}
                >
                  {/* Progress Marker Indicator */}
                  <div className="relative mt-0.5 shrink-0">
                    {isCompleted ? (
                      <div className="w-5 h-5 rounded-full bg-[#5FAF8D] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : isCurrent ? (
                      <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-[#4A443D] text-white font-extrabold text-[10px] shadow-md ring-2 ring-[#5C5346]/40 animate-pulse">
                        {act.order}
                      </div>
                    ) : (
                      <div className={`w-5 h-5 rounded-full bg-[#FAF8F3] border-2 ${categoryBorder} flex items-center justify-center text-[10px] font-bold text-[#2F2A24] shadow-xs`}>
                        {act.order}
                      </div>
                    )}
                  </div>

                  {/* Details: Time & Title */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-[10px] font-bold leading-none ${
                      isCurrent || isSelected ? 'text-[#4A443D]' : 'text-[#6E665C]'
                    }`}>
                      {act.time}
                    </div>
                    <p className="text-xs font-bold text-[#2F2A24] truncate leading-snug mt-0.5">
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
