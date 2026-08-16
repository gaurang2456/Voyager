import React, { useState } from 'react';
import { useCreateTripMutation } from '../../hooks/useTrips';
import { useGenerateItineraryMutation } from '../../hooks/useItinerary';
import { useTravelStore } from '../../store/useTravelStore';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated?: (tripId: number) => void;
  initialDestination?: string;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({
  isOpen,
  onClose,
  onTripCreated,
  initialDestination,
}) => {
  const [destination, setDestination] = useState(initialDestination || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('2500');
  const [travelStyle, setTravelStyle] = useState('Luxury & Culinary');
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  const createTripMutation = useCreateTripMutation();
  const generateItineraryMutation = useGenerateItineraryMutation();
  const { setActiveTrip } = useTravelStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setErrorMsg('Destination is required.');
      return;
    }
    if (!startDate || !endDate) {
      setErrorMsg('Please select start and end dates.');
      return;
    }

    setErrorMsg('');

    try {
      // 1. Create Trip via Backend API
      const newTrip = await createTripMutation.mutateAsync({
        destination,
        startDate,
        endDate,
        budget: parseFloat(budget) || 2000,
        travelStyle,
      });

      // 2. Trigger AI Itinerary Generation for the new trip
      if (newTrip && newTrip.id) {
        setActiveTrip(String(newTrip.id));
        try {
          await generateItineraryMutation.mutateAsync(newTrip.id);
        } catch (err) {
          console.warn('Auto AI generation note:', err);
        }

        if (onTripCreated) {
          onTripCreated(Number(newTrip.id));
        }
      }

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create trip. Please try again.');
    }
  };

  const isSubmitting = createTripMutation.isPending || generateItineraryMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3022]/25 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#ffffff] rounded-3xl p-8 max-w-lg w-full shadow-[0_16px_48px_rgba(27,48,34,0.15)] border border-[#8FA88E]/20 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#8FA88E]/20 pb-4">
          <div>
            <span className="font-label-caps text-[#1B3022] uppercase tracking-widest text-[10px]">
              AI Travel Concierge
            </span>
            <h2 className="font-headline-lg text-2xl text-[#242924]">Plan a New Journey</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#737973] hover:bg-[#F1EDE7] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {errorMsg && (
          <div className="bg-[#ffdad6] text-[#93000a] text-xs p-3 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-body-semibold text-[#574239] mb-1">
              Destination City or Region
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#1B3022] text-[20px]">
                location_on
              </span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Paris, Amalfi Coast, Kyoto, Zurich..."
                className="w-full bg-[#F1EDE7] border border-transparent rounded-xl py-2.5 pl-10 pr-4 text-sm font-body-base text-[#242924] focus:outline-none focus:border-[#8FA88E] focus:ring-2 focus:ring-[#8FA88E]/20 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-body-semibold text-[#574239] mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#F1EDE7] border border-transparent rounded-xl py-2 px-3 text-xs font-body-base text-[#242924] focus:outline-none focus:border-[#8FA88E]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-body-semibold text-[#574239] mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#F1EDE7] border border-transparent rounded-xl py-2 px-3 text-xs font-body-base text-[#242924] focus:outline-none focus:border-[#8FA88E]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-body-semibold text-[#574239] mb-1">
                Budget (USD $)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="2500"
                className="w-full bg-[#F1EDE7] border border-transparent rounded-xl py-2 px-3 text-xs font-body-base text-[#242924] focus:outline-none focus:border-[#8FA88E]"
              />
            </div>

            <div>
              <label className="block text-xs font-body-semibold text-[#574239] mb-1">
                Travel Style
              </label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full bg-[#F1EDE7] border border-transparent rounded-xl py-2 px-3 text-xs font-body-base text-[#242924] focus:outline-none focus:border-[#8FA88E]"
              >
                <option value="Luxury & Culinary">Luxury & Culinary</option>
                <option value="Cultural Explorer">Cultural Explorer</option>
                <option value="Adventure & Nature">Adventure & Nature</option>
                <option value="Relaxation & Wellness">Relaxation & Wellness</option>
                <option value="Budget Friendly">Budget Friendly</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E8E2D5]/60">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-xs font-body-semibold border border-[#8FA88E] text-[#242924] hover:bg-[#F1EDE7] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#1B3022] text-white px-6 py-2.5 rounded-full font-body-semibold text-xs shadow-md hover:bg-[#2c4634] hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  Generating Itinerary...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  Create & Generate AI Itinerary
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTripModal;
