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
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-purple-500/20 dark:border-purple-500/30 shadow-md shadow-purple-500/5 rounded-full px-3.5 py-1.5 flex items-center gap-2 text-xs text-slate-800 dark:text-slate-100 max-w-sm sm:max-w-md">
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold text-[10px] shrink-0 border border-purple-500/20">
          <Brain className="w-3 h-3 text-purple-500" />
          <span>AI Insight</span>
        </div>

        <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200 truncate" title={weather.aiRecommendation}>
          {weather.aiRecommendation}
        </span>

        <button
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss AI Insight"
          className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0 ml-0.5"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default AIInsightCard;
