import React, { useState } from 'react';
import { X, MapPin, Calendar, Plus, Luggage, Sparkles, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTravelStore } from '../../store/useTravelStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useMyTripsQuery, useCreateTripMutation, useDeleteTripMutation } from '../../hooks/useTrips';
import { generateItineraryApi } from '../../api/itinerary';

interface TripsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TripsModal: React.FC<TripsModalProps> = ({ isOpen, onClose }) => {
  const { activeTripId, setActiveTrip } = useTravelStore();
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const [isCreating, setIsCreating] = useState(false);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('2026-10-12');
  const [endDate, setEndDate] = useState('2026-10-18');
  const [budget, setBudget] = useState(2000);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const [deletingTripId, setDeletingTripId] = useState<number | string | null>(null);

  const { data: myTrips = [] } = useMyTripsQuery(Boolean(token));
  const createTripMutation = useCreateTripMutation();
  const deleteTripMutation = useDeleteTripMutation();

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!destination.trim()) {
      errs.destination = 'Destination is required.';
    }
    if (!startDate) {
      errs.startDate = 'Start date is required.';
    }
    if (!endDate) {
      errs.endDate = 'End date is required.';
    }
    if (!budget || Number(budget) <= 0) {
      errs.budget = 'Budget must be greater than $0.';
    }
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const newTrip = await createTripMutation.mutateAsync({
        destination: destination.trim(),
        title: `${destination.trim()} AI Journey`,
        startDate,
        endDate,
        budget: Number(budget),
      });

      const numericId = Number(newTrip.id);
      await generateItineraryApi(numericId);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['trips'] }),
        queryClient.invalidateQueries({ queryKey: ['itinerary', numericId] }),
        queryClient.invalidateQueries({ queryKey: ['weather', numericId] }),
      ]);

      setActiveTrip(String(newTrip.id));
      setIsSubmitting(false);
      setIsCreating(false);
      setDestination('');
      onClose();
    } catch (err: any) {
      console.error('Trip generation error:', err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'Failed to generate trip. Please check your connection and try again.';
      setErrorMessage(typeof msg === 'string' ? msg : 'Failed to generate trip.');
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!deletingTripId) return;
    const targetId = deletingTripId;

    try {
      await deleteTripMutation.mutateAsync(targetId);

      // If active trip is deleted, switch to another existing trip or set to null
      if (String(targetId) === String(activeTripId)) {
        const remaining = myTrips.filter((t) => String(t.id) !== String(targetId));
        if (remaining.length > 0) {
          setActiveTrip(String(remaining[0].id));
        } else {
          setActiveTrip(null);
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['trips'] });
      setDeletingTripId(null);
    } catch (err) {
      console.error('Failed to delete trip:', err);
      setDeletingTripId(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B18]/40 backdrop-blur-md animate-fadeIn">
        <div className="w-full max-w-lg bg-[#FAF8F3] border border-[#E8E2D5] rounded-3xl shadow-2xl p-6 text-[#2F2A24]">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5]">
            <div className="flex items-center gap-2">
              <Luggage className="w-5 h-5 text-[#C19A6B]" />
              <h2 className="font-serif-luxury text-lg font-bold tracking-tight text-[#2F2A24]">My Saved Journeys</h2>
            </div>
            <button
              onClick={() => {
                if (!isSubmitting) {
                  setIsCreating(false);
                  setErrorMessage(null);
                  onClose();
                }
              }}
              disabled={isSubmitting}
              className="p-1.5 rounded-full hover:bg-[#EFE8DD] text-[#6E665C] hover:text-[#2F2A24] transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Inline Create Form or Trips List */}
          {isCreating ? (
            <form onSubmit={handleCreateTrip} className="mt-4 flex flex-col gap-3 animate-fadeIn">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-[#6E665C] uppercase tracking-wider mb-1">
                  Destination City
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    if (validationErrors.destination) setValidationErrors((p) => ({ ...p, destination: '' }));
                  }}
                  placeholder="e.g. Mumbai, Tokyo, Paris, Kyoto"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EFE8DD] text-xs font-semibold text-[#2F2A24] focus:outline-none focus:border-[#C19A6B] disabled:opacity-60"
                />
                {validationErrors.destination && (
                  <p className="text-[10px] text-rose-600 font-semibold mt-1">{validationErrors.destination}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#6E665C] uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (validationErrors.startDate) setValidationErrors((p) => ({ ...p, startDate: '' }));
                    }}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#EFE8DD] text-xs font-medium text-[#2F2A24] focus:outline-none focus:border-[#C19A6B] disabled:opacity-60"
                  />
                  {validationErrors.startDate && (
                    <p className="text-[10px] text-rose-600 font-semibold mt-1">{validationErrors.startDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6E665C] uppercase tracking-wider mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (validationErrors.endDate) setValidationErrors((p) => ({ ...p, endDate: '' }));
                    }}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#EFE8DD] text-xs font-medium text-[#2F2A24] focus:outline-none focus:border-[#C19A6B] disabled:opacity-60"
                  />
                  {validationErrors.endDate && (
                    <p className="text-[10px] text-rose-600 font-semibold mt-1">{validationErrors.endDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6E665C] uppercase tracking-wider mb-1">
                  Target Budget ($)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => {
                    setBudget(Number(e.target.value));
                    if (validationErrors.budget) setValidationErrors((p) => ({ ...p, budget: '' }));
                  }}
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#EFE8DD] text-xs font-semibold text-[#2F2A24] focus:outline-none focus:border-[#C19A6B] disabled:opacity-60"
                />
                {validationErrors.budget && (
                  <p className="text-[10px] text-rose-600 font-semibold mt-1">{validationErrors.budget}</p>
                )}
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!isSubmitting) {
                      setIsCreating(false);
                      setErrorMessage(null);
                    }
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F3EFE8] text-xs font-semibold text-[#6E665C] hover:bg-[#E6DEC9] cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#C19A6B] hover:bg-[#A88254] text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Creating your journey...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>Generate AI Trip</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-4 flex flex-col gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {myTrips.length === 0 ? (
                <div className="p-6 text-center text-[#6E665C]">
                  <Luggage className="w-8 h-8 text-[#C19A6B] mx-auto mb-2 opacity-60" />
                  <p className="font-serif-luxury font-bold text-sm text-[#2F2A24]">No saved journeys yet</p>
                  <p className="text-xs mt-1">Create your first itinerary to get started.</p>
                </div>
              ) : (
                myTrips.map((trip) => {
                  const isActive = String(trip.id) === String(activeTripId);
                  return (
                    <div
                      key={trip.id}
                      onClick={() => {
                        setActiveTrip(String(trip.id));
                        onClose();
                      }}
                      className={`group p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-[#C19A6B]/15 border-[#C19A6B]/40 shadow-sm'
                          : 'bg-[#F3EFE8] border-[#E8E2D5] hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#C19A6B]" />
                            <h3 className="font-bold text-base text-[#2F2A24]">{trip.destination}</h3>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#6E665C] mt-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{trip.startDate || 'Upcoming'} {trip.endDate ? `– ${trip.endDate}` : ''}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs text-[#A59E93]">Budget</span>
                          <div className="font-bold text-sm text-[#5FAF8D]">${trip.budget || 2000}</div>
                        </div>

                        {/* Delete Trash Icon Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingTripId(trip.id);
                          }}
                          title="Delete trip"
                          className="p-2 rounded-xl text-[#8E867A] hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer opacity-70 hover:opacity-100 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              <button
                onClick={() => {
                  setIsCreating(true);
                  setErrorMessage(null);
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#4A443D] hover:bg-[#38332E] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New AI Trip</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingTripId !== null && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#1E1B18]/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#FAF8F3] border border-[#E8E2D5] rounded-3xl shadow-2xl p-6 text-[#2F2A24]">
            <h3 className="font-serif-luxury text-lg font-bold text-[#2F2A24]">Delete Journey?</h3>
            <p className="text-xs text-[#6E665C] mt-2 font-medium">This action cannot be undone.</p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeletingTripId(null)}
                disabled={deleteTripMutation.isPending}
                className="flex-1 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F3EFE8] text-xs font-semibold text-[#6E665C] hover:bg-[#E6DEC9] cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTrip}
                disabled={deleteTripMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {deleteTripMutation.isPending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TripsModal;
