import React from 'react';
import { useMyTripsQuery, useDeleteTripMutation } from '../../hooks/useTrips';
import { useTravelStore } from '../../store/useTravelStore';

interface MyTripsViewProps {
  onSelectTrip: (tripId: string) => void;
  onOpenCreateTrip: () => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({
  onSelectTrip,
  onOpenCreateTrip,
}) => {
  const { data: trips = [], isLoading, isError } = useMyTripsQuery();
  const deleteTripMutation = useDeleteTripMutation();
  const { setActiveTrip, toggleSaveTrip, isTripSaved } = useTravelStore();

  const handleDelete = async (e: React.MouseEvent, tripId: number | string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trip itinerary?')) {
      await deleteTripMutation.mutateAsync(tripId);
    }
  };

  return (
    <div className="flex flex-col w-full px-6 md:px-16 pb-16 space-y-12 mt-6 animate-fadeIn max-w-[1200px] mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#F1EDE7] pb-8">
        <div>
          <span className="font-label-caps text-[#8FA88E] text-xs tracking-widest block mb-1">
            Your Journeys
          </span>
          <h1 className="font-headline-lg text-3xl md:text-4xl text-[#242924] font-bold">
            My Trips
          </h1>
          <p className="font-body-base text-sm text-[#434843] mt-1.5 leading-relaxed">
            Manage your past, active, and upcoming travel itineraries.
          </p>
        </div>

        <button
          onClick={onOpenCreateTrip}
          className="bg-[#1B3022] text-white px-7 py-3 rounded-full font-body-semibold text-sm shadow-[0_8px_24px_rgba(27,48,34,0.12)] hover:bg-[#2c4634] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 self-start md:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create New Trip
        </button>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="py-24 flex flex-col items-center justify-center text-[#434843] gap-4">
          <span className="material-symbols-outlined animate-spin text-[40px] text-[#1B3022]">
            progress_activity
          </span>
          <p className="font-body-semibold text-sm tracking-wide">Loading your curated journeys...</p>
        </div>
      )}

      {isError && (
        <div className="bg-[#ffdad6] text-[#93000a] p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <span className="material-symbols-outlined text-[24px]">error</span>
          <div>
            <p className="font-body-semibold text-sm">Failed to load trips from backend.</p>
            <p className="text-xs opacity-90 mt-0.5">Please check that the Spring Boot backend is running on port 8080.</p>
          </div>
        </div>
      )}

      {/* Trips Grid */}
      {!isLoading && !isError && (
        <>
          {trips.length === 0 ? (
            <div className="bg-[#ffffff] rounded-3xl p-12 text-center shadow-[0_16px_48px_rgba(27,48,34,0.08)] flex flex-col items-center justify-center gap-5 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#cfeacd] text-[#1B3022] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[32px]">map</span>
              </div>
              <div>
                <h3 className="font-headline-lg text-2xl text-[#242924] font-semibold">No Trips Yet</h3>
                <p className="font-body-base text-sm text-[#434843] mt-1 leading-relaxed">
                  Start planning your first secluded retreat with AI concierge assistance.
                </p>
              </div>
              <button
                onClick={onOpenCreateTrip}
                className="bg-[#1B3022] text-white px-7 py-3 rounded-full font-body-semibold text-sm shadow-md hover:bg-[#2c4634] hover:scale-105 transition-all mt-2 cursor-pointer"
              >
                Plan First Journey
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <article
                  key={trip.id}
                  onClick={() => {
                    setActiveTrip(String(trip.id));
                    onSelectTrip(String(trip.id));
                  }}
                  className="bg-[#ffffff] rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(27,48,34,0.08)] group hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(27,48,34,0.12)] transition-all duration-300 cursor-pointer relative flex flex-col justify-between"
                >
                  <div
                    className="h-52 w-full bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url(${
                        trip.imageUrl ||
                        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
                      })`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#242924]/60 via-transparent to-transparent" />

                    <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveTrip(trip);
                        }}
                        title={isTripSaved(trip.id) ? "Saved to Saved Section" : "Save Trip"}
                        className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm cursor-pointer ${
                          isTripSaved(trip.id)
                            ? 'bg-[#1B3022] text-[#cfeacd] shadow-md'
                            : 'bg-white/90 text-[#1B3022] hover:bg-[#1B3022] hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isTripSaved(trip.id) ? 'bookmark_added' : 'bookmark'}
                        </span>
                      </button>

                      <button
                        onClick={(e) => handleDelete(e, trip.id)}
                        title="Delete Trip"
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 bg-[#1B3022]/85 backdrop-blur-md px-3.5 py-1 rounded-full text-white text-[10px] font-label-caps tracking-wider">
                      {trip.travelStyle || 'Botanical Retreat'}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#737973] mb-1 text-xs font-body-base">
                        <span className="material-symbols-outlined text-[16px] text-[#8FA88E]">calendar_month</span>
                        <span>{trip.startDate || 'Upcoming'} - {trip.endDate || 'TBD'}</span>
                      </div>
                      <h3 className="font-headline-sm text-xl text-[#242924] font-bold truncate">{trip.destination}</h3>
                    </div>

                    <div className="h-[1px] w-full bg-[#F1EDE7]"></div>

                    <div className="flex items-center justify-between pt-0.5">
                      <div className="flex flex-col">
                        <span className="font-label-caps text-[10px] text-[#737973] tracking-wider">Budget</span>
                        <span className="font-body-semibold text-sm text-[#242924]">
                          ${trip.budget ? trip.budget.toLocaleString() : '2,000'}
                        </span>
                      </div>

                      <span className="font-body-semibold text-xs text-[#1B3022] group-hover:text-[#8FA88E] group-hover:translate-x-1 transition-all flex items-center gap-1">
                        View Itinerary <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyTripsView;
