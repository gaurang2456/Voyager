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
import { useAuthStore } from '../../store/useAuthStore';
import { useMyTripsQuery } from '../../hooks/useTrips';
import { useItineraryQuery, useRegenerateItineraryMutation } from '../../hooks/useItinerary';
import { transformItineraryResponseToDays } from '../../api/itinerary';
import type { ActivityCategory } from '../../types/travel';

const getCategoryStyles = (category: ActivityCategory) => {
  switch (category) {
    case 'sightseeing':
      return { bg: 'bg-[#C19A6B]/15', text: 'text-[#A88254]', border: 'border-[#C19A6B]/30' };
    case 'food':
      return { bg: 'bg-[#708238]/15', text: 'text-[#556B2F]', border: 'border-[#708238]/30' };
    case 'shopping':
      return { bg: 'bg-[#8E2A59]/15', text: 'text-[#8E2A59]', border: 'border-[#8E2A59]/30' };
    case 'hotel':
      return { bg: 'bg-[#D97724]/15', text: 'text-[#D97724]', border: 'border-[#D97724]/30' };
  }
};

export const ActivityDetailPanel: React.FC = () => {
  const {
    activeTripId,
    activeDayNumber,
    selectedActivityId,
    isPanelOpen,
    setPanelOpen,
    setHoveredActivity,
    completedActivityIds,
    toggleActivityCompleted,
  } = useTravelStore();

  const { token } = useAuthStore();

  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  const { data: myTrips = [] } = useMyTripsQuery(Boolean(token));
  const currentTrip = myTrips.find((t) => String(t.id) === String(activeTripId));
  const numericTripId = currentTrip ? Number(currentTrip.id) : null;

  const { data: itineraryData } = useItineraryQuery(numericTripId, Boolean(token && numericTripId));
  const regenerateMutation = useRegenerateItineraryMutation();

  const days = itineraryData ? transformItineraryResponseToDays(itineraryData) : [];
  const currentDay = days.find((d) => d.dayNumber === activeDayNumber) || days[0];
  const activity = currentDay?.activities.find((a) => a.id === selectedActivityId);

  if (!isPanelOpen || !activity) return null;

  const categoryStyles = getCategoryStyles(activity.category);
  const isCompleted = Boolean(completedActivityIds[activity.id] || activity.status === 'completed');

  const handleLaunchExternalMap = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${activity.lat},${activity.lng}`;
    window.open(mapsUrl, '_blank');
  };

  const handleReplace = () => {
    if (numericTripId) {
      regenerateMutation.mutate({
        tripId: numericTripId,
        prompt: `Replace "${activity.title}" with a fresh local recommendation`,
      });
    }
  };

  return (
    <div
      onMouseEnter={() => setHoveredActivity(activity.id)}
      onMouseLeave={() => setHoveredActivity(null)}
      className="absolute bottom-20 left-4 right-4 top-auto w-auto max-w-none md:top-16 md:right-5 md:left-auto md:w-72 md:max-w-[288px] md:bottom-auto z-40 pointer-events-auto transition-all duration-300 animate-fadeIn"
    >
      <div className="bg-[#FAF8F3] backdrop-blur-2xl border border-[#EFE8DD] shadow-xl shadow-amber-950/10 rounded-3xl p-3.5 flex flex-col gap-2.5 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
        
        {/* Travel Hero Image Banner */}
        {activity.imageUrl && (
          <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-xs border border-[#EFE8DD] shrink-0">
            <img
              src={activity.imageUrl}
              alt={activity.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2F2A24]/85 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
              <span className="flex items-center gap-1 drop-shadow-md">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {activity.locationName}
              </span>
              {activity.rating && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#4A443D]/90 backdrop-blur-md border border-[#5C5346] text-amber-400 text-[10px]">
                  <Star className="w-3 h-3 fill-amber-400" /> {activity.rating}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Header Row: Title & Close */}
        <div className="flex items-start justify-between gap-2 border-b border-[#E8E2D6] pb-2">
          <div>
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              {isCompleted && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#5FAF8D]/15 text-[#4F9F7F] border border-[#5FAF8D]/30">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize border ${categoryStyles.bg} ${categoryStyles.text} ${categoryStyles.border}`}>
                {activity.category}
              </span>
              {activity.priority === 'high' && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-[#FF7A59] border border-rose-500/20">
                  High
                </span>
              )}
            </div>
            <h2 className={`font-serif-luxury text-base font-bold text-[#2F2A24] leading-snug ${isSkipped ? 'line-through opacity-50' : ''}`}>
              {activity.title}
            </h2>
          </div>

          <button
            onClick={() => setPanelOpen(false)}
            className="p-1 rounded-lg hover:bg-[#F1EDE4] text-[#6E665C] hover:text-[#2F2A24] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Time, Duration & Rating */}
        <div className="flex items-center justify-between text-xs text-[#6E665C] font-medium">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#C19A6B]" />
            <span>{activity.time} • {activity.durationMinutes}m</span>
          </div>
          {activity.rating && (
            <div className="flex items-center gap-1 text-amber-700 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{activity.rating}</span>
            </div>
          )}
        </div>

        {/* Location & Cost Row — Crisp White Information Cards */}
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <div className="p-2 rounded-xl bg-white border border-[#EFE8DD] shadow-2xs">
            <div className="text-[10px] text-[#A59E93] font-medium">Location</div>
            <div className="font-bold text-[#2F2A24] truncate mt-0.5 text-[11px]" title={activity.locationName}>
              {activity.locationName}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white border border-[#EFE8DD] shadow-2xs">
            <div className="text-[10px] text-[#A59E93] font-medium">Est. Cost</div>
            <div className="font-bold text-[#2F2A24] mt-0.5 text-[11px]">
              {activity.estimatedCost === 0 ? 'Free' : `$${activity.estimatedCost}`}
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-[#6E665C] leading-relaxed font-normal">
          {activity.description}
        </p>

        {/* Weather Suitability Recommendation Pill - Oyster Color */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-[#EAE3D9] border border-[#D4C9BD] text-xs text-[#4A443D] font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#9E9486] shrink-0" />
          <span className="text-[11px] leading-tight">{activity.weatherSuitability}</span>
        </div>

        {/* Extra Details Collapsible */}
        {showMoreDetails && (
          <div className="pt-1.5 border-t border-[#E8E2D5] text-[11px] text-[#6E665C] space-y-1.5 animate-fadeIn">
            <div className="flex justify-between">
              <span>Peak Hours</span>
              <span className="font-semibold text-[#2F2A24]">11:00 AM – 3:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Accessibility</span>
              <span className="font-semibold text-emerald-700">Wheelchair Accessible</span>
            </div>
          </div>
        )}

        {/* In-App Navigation Active Overlay Panel */}
        {isNavigating ? (
          <div className="p-2.5 rounded-xl bg-[#EAE3D9] border border-[#D4C9BD] flex flex-col gap-2 text-xs animate-fadeIn">
            <div className="flex items-center justify-between font-bold text-[#4A443D]">
              <span className="flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-[#C19A6B] animate-pulse" />
                Active Route Navigation
              </span>
              <button
                onClick={() => setIsNavigating(false)}
                className="text-[10px] text-[#6E665C] hover:text-[#2F2A24]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 text-center py-1 bg-white/80 rounded-lg border border-[#D4C9BD]">
              <div>
                <div className="text-[9px] text-[#6E665C] font-bold uppercase">Walking</div>
                <div className="font-extrabold text-[#2F2A24] text-xs">12 min</div>
              </div>
              <div>
                <div className="text-[9px] text-[#6E665C] font-bold uppercase">Distance</div>
                <div className="font-extrabold text-[#2F2A24] text-xs">0.9 km</div>
              </div>
              <div>
                <div className="text-[9px] text-[#6E665C] font-bold uppercase">Arrival</div>
                <div className="font-extrabold text-[#5FAF8D] text-xs">12:42 PM</div>
              </div>
            </div>

            <button
              onClick={handleLaunchExternalMap}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#C19A6B] hover:bg-[#A88254] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>Launch Directions in Maps</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </button>
          </div>
        ) : (
          /* Action Buttons Section Directly Below Content */
          <div className="pt-2 border-t border-[#E8E2D6] flex flex-col gap-1.5">
            
            {/* Mark As Completed Primary Action Button */}
            <button
              onClick={() => toggleActivityCompleted(activity.id)}
              className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-[#5FAF8D] hover:bg-[#4F9F7F] text-white'
                  : 'bg-[#5FAF8D]/15 hover:bg-[#5FAF8D]/25 text-[#4F9F7F] border border-[#5FAF8D]/30'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
            </button>

            <button
              onClick={() => setIsNavigating(true)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#C19A6B] hover:bg-[#A88254] active:scale-98 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate in Maps</span>
              <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
            </button>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={handleReplace}
                disabled={regenerateMutation.isPending}
                className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-[#F3EFE8] hover:bg-[#E6DEC9] active:scale-98 text-[#2F2A24] border border-[#E8E2D5] text-xs font-semibold transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${regenerateMutation.isPending ? 'animate-spin' : ''}`} />
                <span>Replace</span>
              </button>

              <button
                onClick={() => setIsSkipped(!isSkipped)}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl border text-xs font-semibold active:scale-98 transition-all cursor-pointer ${
                  isSkipped
                    ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                    : 'bg-[#F3EFE8] hover:bg-[#E6DEC9] text-[#2F2A24] border-[#E8E2D5]'
                }`}
              >
                <SkipForward className="w-3 h-3" />
                <span>{isSkipped ? 'Unskip' : 'Skip'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              className="w-full flex items-center justify-center gap-1 py-0.5 text-[11px] font-medium text-[#6E665C] hover:text-[#2F2A24] transition-colors cursor-pointer"
            >
              <Info className="w-3 h-3" />
              <span>{showMoreDetails ? 'Less Info' : 'More Details'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ActivityDetailPanel;
