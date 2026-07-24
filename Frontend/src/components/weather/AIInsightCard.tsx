import React, { useState, useEffect } from 'react';
import { Sparkles, X, Brain } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';

export const AIInsightCard: React.FC = () => {
  const { trips, activeTripId } = useTravelStore();
  const [isDismissed, setIsDismissed] = useState(false);

  const currentTrip = trips.find((t) => t.id === activeTripId) || trips[0];
  const { weather } = currentTrip;

  // Reset dismissal if active trip or recommendation changes
  useEffect(() => {
    setIsDismissed(false);
  }, [activeTripId, weather.aiRecommendation]);

  if (isDismissed || !weather.aiRecommendation) return null;

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto transition-all duration-300 animate-fadeIn">
      <div className="bg-[#FAF8F3] backdrop-blur-2xl border border-[#EFE8DD] shadow-md shadow-amber-950/5 rounded-full px-4 py-1.5 flex items-center gap-2.5 text-xs text-[#2F2A24] max-w-sm sm:max-w-md">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#8E2A59]/15 text-[#8E2A59] font-bold text-[10px] shrink-0 border border-[#8E2A59]/30">
          <Sparkles className="w-3 h-3 text-[#8E2A59] fill-[#8E2A59]" />
          <span>Concierge Recommendation</span>
        </div>

        <span className="text-xs font-semibold text-[#2F2A24] truncate" title={weather.aiRecommendation}>
          {weather.aiRecommendation}
        </span>

        <button
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss Concierge Recommendation"
          className="p-1 rounded-full hover:bg-[#F1EDE4] text-[#6E665C] hover:text-[#2F2A24] transition-colors cursor-pointer shrink-0 ml-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AIInsightCard;
