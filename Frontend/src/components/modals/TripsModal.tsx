import React from 'react';
import { X, MapPin, Calendar, Plus, Luggage } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';

interface TripsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TripsModal: React.FC<TripsModalProps> = ({ isOpen, onClose }) => {
  const { trips, activeTripId, setActiveTrip } = useTravelStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B18]/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#FAF8F3] border border-[#E8E2D5] rounded-3xl shadow-2xl p-6 text-[#2F2A24]">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5]">
          <div className="flex items-center gap-2">
            <Luggage className="w-5 h-5 text-[#C19A6B]" />
            <h2 className="font-serif-luxury text-lg font-bold tracking-tight text-[#2F2A24]">My Saved Journeys</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EFE8DD] text-[#6E665C] hover:text-[#2F2A24] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {trips.map((trip) => {
            const isActive = trip.id === activeTripId;
            return (
              <div
                key={trip.id}
                onClick={() => {
                  setActiveTrip(trip.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'bg-blue-500/10 border-blue-500/30 shadow-sm'
                    : 'bg-[#F3EFE8] border-[#E8E2D5] hover:border-stone-400'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <h3 className="font-bold text-base">{trip.destination}, {trip.country}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{trip.dates}</span>
                    <span>•</span>
                    <span>{trip.days.length} Days</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Budget</span>
                  <div className="font-bold text-sm text-emerald-600">${trip.totalBudget}</div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Create New AI Trip</span>
        </button>
      </div>
    </div>
  );
};

export default TripsModal;
