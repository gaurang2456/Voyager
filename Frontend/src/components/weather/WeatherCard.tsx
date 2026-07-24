import React from 'react';
import { CloudSun, DollarSign, MapPin } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';

export const WeatherCard: React.FC = () => {
  const { trips, activeTripId } = useTravelStore();

  const currentTrip = trips.find((t) => t.id === activeTripId) || trips[0];
  const { weather } = currentTrip;
  const remainingBudget = currentTrip.totalBudget - currentTrip.spentBudget;

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-auto transition-all duration-300">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-md shadow-slate-900/5 rounded-full px-3.5 py-1.5 flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-100">
        
        {/* Destination & Dates Chip */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200 dark:border-slate-800">
          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="font-bold tracking-tight">{currentTrip.destination}</span>
          <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">• {currentTrip.dates}</span>
        </div>

        {/* Current Temperature */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[11px]">
          <CloudSun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="font-bold">{weather.temperature}</span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">{weather.condition}</span>
        </div>

        {/* Remaining Budget */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] border border-emerald-500/20">
          <DollarSign className="w-3 h-3" />
          <span>${remainingBudget.toLocaleString()} left</span>
        </div>

      </div>
    </div>
  );
};

export default WeatherCard;
