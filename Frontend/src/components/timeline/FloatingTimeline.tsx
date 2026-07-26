import React, { useEffect, useState } from 'react';
import { ChevronDown, Clock, Check, Luggage, Plus, SkipForward } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useMyTripsQuery } from '../../hooks/useTrips';
import { useItineraryQuery, useGenerateItineraryMutation } from '../../hooks/useItinerary';
import { transformItineraryResponseToDays } from '../../api/itinerary';
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

interface FloatingTimelineProps {
  onOpenCreateTrip?: () => void;
}

export const FloatingTimeline: React.FC<FloatingTimelineProps> = ({ onOpenCreateTrip }) => {
  const {
    activeTripId,
    activeDayNumber,
    selectedActivityId,
    setSelectedActivity,
    hoveredActivityId,
    setHoveredActivity,
    filterCategory,
    completedActivityIds,
    skippedActivityIds,
  } = useTravelStore();

  const { token } = useAuthStore();
  const [, setRouteDistance] = useState<number>(0);

  // 1. Fetch user trips from Spring Boot backend via React Query
  const { data: myTrips = [], isLoading: isTripsLoading } = useMyTripsQuery(Boolean(token));
  const activeTrip = myTrips.find((t) => String(t.id) === String(activeTripId));

  // 2. Fetch itinerary for active trip via React Query
  const numericTripId = activeTrip ? Number(activeTrip.id) : null;
  const {
    data: itineraryData,
    isLoading: isItineraryLoading,
    isError: isItineraryError,
  } = useItineraryQuery(numericTripId, Boolean(token && numericTripId));

  const generateItineraryMutation = useGenerateItineraryMutation();

  // If trip exists but no itinerary generated yet, generate one via AI
  useEffect(() => {
    if (numericTripId && isItineraryError && !generateItineraryMutation.isPending) {
      generateItineraryMutation.mutate(numericTripId);
    }
  }, [numericTripId, isItineraryError, generateItineraryMutation]);

  const days = itineraryData ? transformItineraryResponseToDays(itineraryData) : [];
  const currentDay = days.find((d) => d.dayNumber === activeDayNumber) || days[0];

  const rawActivities = currentDay?.activities || [];
  const activities = filterCategory === 'all'
    ? rawActivities
    : rawActivities.filter((a) => a.category === filterCategory);

  useEffect(() => {
    const activeWaypoints = activities
      .filter((a) => !Boolean(completedActivityIds[a.id] || skippedActivityIds[a.id]))
      .map((a) => ({ lat: a.lat, lng: a.lng }));

    if (activeWaypoints.length < 2) {
      setRouteDistance(0);
      return;
    }
    let isMounted = true;
    fetchRealRoute(activeWaypoints).then((res) => {
      if (isMounted) {
        setRouteDistance(res.distanceKm);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [activities, completedActivityIds, skippedActivityIds]);

  // Requirement 1: If user has no trips yet, render elegant empty state card
  if (!isTripsLoading && myTrips.length === 0) {
    return (
      <div className="absolute top-20 left-4 md:top-24 md:left-5 z-20 flex flex-col gap-2 pointer-events-auto max-w-[220px] transition-all">
        <div className="bg-[#FAF8F3] backdrop-blur-2xl border border-[#EFE8DD] shadow-xl shadow-amber-950/5 rounded-3xl p-4 flex flex-col items-center text-center text-[#2F2A24]">
          <div className="w-12 h-12 rounded-full bg-[#C19A6B]/15 text-[#C19A6B] flex items-center justify-center mb-2.5 shadow-xs">
            <Luggage className="w-6 h-6" />
          </div>
          <h3 className="font-serif-luxury font-bold text-sm text-[#2F2A24]">No journeys yet</h3>
          <p className="text-[11px] text-[#6E665C] mt-1 leading-snug">
            Plan your next luxury escape with AI-curated routes.
          </p>
          <button
            onClick={onOpenCreateTrip}
            className="w-full mt-3.5 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#C19A6B] hover:bg-[#A88254] active:scale-98 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Your First Journey</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-20 left-4 md:top-24 md:left-5 z-20 flex flex-col gap-2 pointer-events-auto max-w-[185px] sm:max-w-[215px] transition-all">
      
      {/* Vertical Timeline Container */}
      <div className="bg-[#FAF8F3] backdrop-blur-2xl border border-[#EFE8DD] shadow-lg shadow-amber-950/5 rounded-2xl p-3 max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar transition-all duration-300">
        
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E2D6]">
          <div className="flex items-center gap-1.5 font-serif-luxury text-xs font-bold text-[#2F2A24]">
            <Clock className="w-3.5 h-3.5 text-[#C19A6B]" />
            <span>Itinerary Route</span>
          </div>
        </div>

        {/* Skeleton Loaders while fetching or generating */}
        {(isItineraryLoading || generateItineraryMutation.isPending) && (
          <div className="flex flex-col gap-3 py-2 animate-pulse">
            <div className="h-10 bg-[#EFE8DD] rounded-xl w-full" />
            <div className="h-10 bg-[#EFE8DD] rounded-xl w-full" />
            <div className="h-10 bg-[#EFE8DD] rounded-xl w-full" />
          </div>
        )}

        {/* Vertical Nodes */}
        {!isItineraryLoading && !generateItineraryMutation.isPending && (
          <div className="relative flex flex-col gap-2.5 my-1">
            {/* Vertical Connecting Line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-[#E8E2D6] z-0" />

            {activities.map((act, index) => {
              const isSelected = act.id === selectedActivityId;
              const isHovered = act.id === hoveredActivityId;
              const isCompleted = Boolean(completedActivityIds[act.id] || act.status === 'completed');
              const isSkipped = Boolean(skippedActivityIds[act.id]);
              const isCurrent = (act.status === 'current' || isSelected) && !isCompleted && !isSkipped;
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
                        ? 'bg-[#5FAF8D]/10 border border-[#5FAF8D]/30 opacity-90 hover:opacity-100'
                        : isSkipped
                        ? 'bg-[#EFE8DD]/40 border border-[#E8E2D5] opacity-55 hover:opacity-80'
                        : isHovered
                        ? 'bg-[#F3EFE6] scale-[1.02]'
                        : 'bg-[#F8F5EF]/60 border border-[#E8E2D6]/80 hover:bg-[#F3EFE6]'
                    }`}
                  >
                    {/* Progress Marker Indicator */}
                    <div className="relative mt-0.5 shrink-0">
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-[#5FAF8D] text-white flex items-center justify-center text-[10px] font-bold shadow-xs border border-white">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : isSkipped ? (
                        <div className="w-5 h-5 rounded-full bg-stone-300 text-stone-600 flex items-center justify-center text-[9px] font-bold shadow-xs">
                          <SkipForward className="w-2.5 h-2.5" />
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
                        isCompleted ? 'text-[#5FAF8D]' : isSkipped ? 'text-stone-400' : isCurrent || isSelected ? 'text-[#4A443D]' : 'text-[#6E665C]'
                      }`}>
                        {act.time} {isCompleted && '✓'} {isSkipped && '(Skipped)'}
                      </div>
                      <p className={`text-xs font-bold truncate leading-snug mt-0.5 ${
                        isCompleted ? 'text-[#4F9F7F] line-through opacity-85' : isSkipped ? 'text-stone-500 line-through' : 'text-[#2F2A24]'
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
        )}

      </div>
    </div>
  );
};

export default FloatingTimeline;
