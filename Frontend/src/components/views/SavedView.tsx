import React from 'react';
import { useTravelStore } from '../../store/useTravelStore';

interface SavedViewProps {
  onOpenCreateTrip: (destination: string) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({ onOpenCreateTrip }) => {
  const { savedItems, removeSavedItem } = useTravelStore();

  return (
    <div className="flex flex-col w-full px-6 md:px-16 pb-16 space-y-12 mt-6 animate-fadeIn max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="border-b border-[#F1EDE7] pb-8">
        <span className="font-label-caps text-[#8FA88E] text-xs tracking-widest block mb-1">
          Your Bookmarks
        </span>
        <h1 className="font-headline-lg text-3xl md:text-4xl text-[#242924] font-bold">
          Saved Places & Trips
        </h1>
        <p className="font-body-base text-sm text-[#434843] mt-1.5 leading-relaxed">
          Bookmarked journeys, experiences, and destinations ready to unfold.
        </p>
      </div>

      {savedItems.length === 0 ? (
        <div className="bg-[#ffffff] rounded-3xl p-12 text-center shadow-[0_16px_48px_rgba(27,48,34,0.08)] flex flex-col items-center justify-center gap-5 max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-[#cfeacd] text-[#1B3022] flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[32px]">bookmark</span>
          </div>
          <div>
            <h3 className="font-headline-lg text-2xl text-[#242924] font-semibold">No Saved Items Yet</h3>
            <p className="font-body-base text-sm text-[#434843] mt-1 leading-relaxed">
              Click the bookmark icon on any trip in <strong className="text-[#1B3022]">My Trips</strong> to save it here!
            </p>
          </div>
          <button
            onClick={() => onOpenCreateTrip('Paris')}
            className="bg-[#1B3022] text-white px-7 py-3 rounded-full font-body-semibold text-sm shadow-md hover:bg-[#2c4634] hover:scale-105 transition-all mt-2 cursor-pointer"
          >
            Plan New Journey
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedItems.map((item) => (
            <article
              key={item.id}
              className="bg-[#ffffff] rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(27,48,34,0.08)] group hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(27,48,34,0.12)] transition-all duration-300 relative flex flex-col justify-between"
            >
              <div
                className="h-52 w-full bg-cover bg-center relative"
                style={{
                  backgroundImage: `url(${
                    item.imageUrl ||
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
                  })`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#242924]/60 via-transparent to-transparent" />

                <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
                  <button
                    onClick={() => removeSavedItem(item.id)}
                    title="Remove from Saved"
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                <div className="absolute bottom-3.5 left-3.5 bg-[#1B3022]/85 backdrop-blur-md px-3.5 py-1 rounded-full text-white text-[10px] font-label-caps tracking-wider">
                  {item.category || item.travelStyle || 'Saved Journey'}
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                <div>
                  <span className="font-label-caps text-[10px] text-[#737973] tracking-wider block mb-1">
                    {item.location}
                  </span>
                  <h3 className="font-headline-sm text-xl text-[#242924] font-bold truncate">{item.title}</h3>
                  {item.note && (
                    <p className="font-body-base text-xs text-[#434843] mt-1.5 line-clamp-2 leading-relaxed">
                      {item.note}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onOpenCreateTrip(item.location)}
                  className="w-full bg-[#1B3022] text-white py-3 rounded-full font-body-semibold text-xs transition-all hover:bg-[#2c4634] hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span className="material-symbols-outlined text-[16px]">add_location</span>
                  Include in Itinerary
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedView;
