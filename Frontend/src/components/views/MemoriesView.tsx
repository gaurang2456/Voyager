import React from 'react';
import { useMyTripsQuery } from '../../hooks/useTrips';
import { getUserMemoryAlbums } from '../../utils/memoryData';
import type { MemoryAlbum } from '../../types/memories';

interface MemoriesViewProps {
  onSelectAlbum: (album: MemoryAlbum) => void;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({ onSelectAlbum }) => {
  const { data: myTrips = [], isLoading } = useMyTripsQuery();
  const memoryAlbums = getUserMemoryAlbums(myTrips);

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-[#434843] gap-4">
        <span className="material-symbols-outlined animate-spin text-[40px] text-[#1B3022]">
          progress_activity
        </span>
        <p className="font-body-semibold text-sm tracking-wide">
          Loading your travel photo memories...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-6 md:px-12 pb-20 space-y-10 mt-6 animate-fadeIn max-w-[1320px] mx-auto">
      {/* Top Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E2D5]/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1B3022]"></span>
            <span className="font-label-caps text-xs text-[#1B3022] uppercase tracking-widest font-semibold">
              Visual Keepsakes & Albums
            </span>
          </div>
          <h1 className="font-display-lg text-3xl md:text-4xl text-[#242924] font-bold tracking-tight">
            Travel Memories
          </h1>
          <p className="font-body-base text-sm text-[#685D52] mt-1">
            Photo albums and saved memories from your authenticated travel journeys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#ffffff] px-4 py-2 rounded-full border border-[#E8E2D5] shadow-xs flex items-center gap-2 text-xs font-body-semibold text-[#242924]">
            <span className="material-symbols-outlined text-[18px] text-[#1B3022]">photo_album</span>
            <span>{memoryAlbums.length} {memoryAlbums.length === 1 ? 'Trip Album' : 'Trip Albums'}</span>
          </div>
        </div>
      </section>

      {/* Empty state if user has no trips yet */}
      {memoryAlbums.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2D5]/70 shadow-xs flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-[#1B3022]/10 text-[#1B3022] flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">map</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-headline-lg text-2xl font-bold text-[#242924]">
              No Travel Journeys Yet
            </h3>
            <p className="font-body-base text-sm text-[#737973] leading-relaxed">
              Create a trip itinerary to start building your personal travel memory albums.
            </p>
          </div>
        </div>
      )}

      {/* Authenticated User Photo Albums Grid */}
      {memoryAlbums.length > 0 && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {memoryAlbums.map((album) => (
              <article
                key={album.id}
                onClick={() => onSelectAlbum(album)}
                className="bg-white rounded-3xl overflow-hidden shadow-[0_6px_30px_rgba(43,36,30,0.06)] border border-[#E8E2D5]/60 group hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Album Cover Photo */}
                <div className="relative h-64 w-full overflow-hidden bg-[#1B3022]">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${album.coverImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#242924]/85 via-[#242924]/20 to-transparent" />

                  {/* Country Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-label-caps text-[#1B3022] shadow-xs uppercase tracking-wider font-bold">
                      {album.country}
                    </span>
                  </div>

                  {/* Photo Count Badge */}
                  <div className="absolute top-4 right-4 bg-[#1B3022]/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-body-semibold flex items-center gap-1.5 border border-white/20">
                    <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                    <span>{album.photoCount} {album.photoCount === 1 ? 'Photo' : 'Photos'}</span>
                  </div>

                  {/* Destination Title on Cover */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-display-lg text-2xl font-bold leading-tight group-hover:text-[#cfeacd] transition-colors">
                      {album.destination}
                    </h3>
                    {album.startDate && (
                      <div className="flex items-center gap-1 text-[11px] text-white/80 font-body-base mt-0.5">
                        <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                        <span>{album.startDate} - {album.endDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Details */}
                <div className="p-5 flex items-center justify-between bg-white border-t border-[#F1EDE7]">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#1B3022]/10 text-[#1B3022] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">collections_bookmark</span>
                    </span>
                    <span className="font-body-semibold text-xs text-[#242924]">
                      Open Album
                    </span>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-[#F1EDE7] text-[#1B3022] flex items-center justify-center group-hover:bg-[#1B3022] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MemoriesView;
