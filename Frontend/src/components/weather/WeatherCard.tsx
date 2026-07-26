import React from 'react';
import { CloudSun, DollarSign, MapPin } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useMyTripsQuery } from '../../hooks/useTrips';
import { useWeatherQuery } from '../../hooks/useWeather';
import { useItineraryQuery } from '../../hooks/useItinerary';
import { transformForecastToWeatherInfo } from '../../api/weather';
import { transformItineraryResponseToDays } from '../../api/itinerary';

export const WeatherCard: React.FC = () => {
  const { activeTripId } = useTravelStore();
  const { token } = useAuthStore();

  const { data: myTrips = [] } = useMyTripsQuery(Boolean(token));
  const currentTrip = myTrips.find((t) => String(t.id) === String(activeTripId));

  const numericTripId = currentTrip ? Number(currentTrip.id) : null;
  const { data: weatherData, isLoading: isWeatherLoading } = useWeatherQuery(
    numericTripId,
    Boolean(token && numericTripId)
  );

  const { data: itineraryData } = useItineraryQuery(numericTripId, Boolean(token && numericTripId));

  if (!currentTrip) return null;

  const weather = transformForecastToWeatherInfo(weatherData || []);
  const days = itineraryData ? transformItineraryResponseToDays(itineraryData) : [];

  const totalSpent = days.reduce((sum, d) => {
    return sum + d.activities.reduce((actSum, act) => actSum + (act.estimatedCost || 0), 0);
  }, 0);

  const totalBudget = currentTrip.budget || 2000;
  const remainingBudget = Math.max(0, totalBudget - totalSpent);

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-auto transition-all duration-300">
      <div className="bg-[#FAF8F3] backdrop-blur-2xl border border-[#E8E2D5] shadow-md shadow-amber-950/5 rounded-full px-3.5 py-1.5 flex items-center gap-2.5 text-xs text-[#2F2A24]">
        
        {/* Destination & Dates Chip */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-[#E8E2D5]">
          <MapPin className="w-3.5 h-3.5 text-[#C19A6B] shrink-0" />
          <span className="font-bold tracking-tight">{currentTrip.destination}</span>
          {currentTrip.startDate && (
            <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
              • {currentTrip.startDate} {currentTrip.endDate ? `– ${currentTrip.endDate}` : ''}
            </span>
          )}
        </div>

        {/* Current Temperature & Weather */}
        {isWeatherLoading ? (
          <div className="h-4 w-16 bg-[#EFE8DD] rounded-full animate-pulse" />
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-medium text-[11px]">
            <CloudSun className="w-3.5 h-3.5 text-[#D97724] shrink-0" />
            <span className="font-bold">{weather.temperature}</span>
            <span className="text-slate-400 text-[10px] hidden sm:inline">{weather.condition}</span>
          </div>
        )}

        {/* Remaining Budget */}
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#5FAF8D]/15 text-[#4F9F7F] font-bold text-[11px] border border-[#5FAF8D]/30">
          <DollarSign className="w-3 h-3 text-[#5FAF8D]" />
          <span>${remainingBudget.toLocaleString()} left</span>
        </div>

      </div>
    </div>
  );
};

export default WeatherCard;
