import React, { useState } from 'react';
import { useTripPhotosQuery, useDeletePhotoMutation } from '../../hooks/useTripPhotos';
import { UploadPhotoModal } from '../modals/UploadPhotoModal';
import type { MemoryAlbum, MemoryPhoto } from '../../types/memories';

interface AlbumDetailViewProps {
  album: MemoryAlbum;
  onBack: () => void;
}

export const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({ album, onBack }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const numericTripId = album.tripId || (album.id ? Number(album.id) : null);
  const { data: userPhotos = [], isLoading } = useTripPhotosQuery(numericTripId, Boolean(numericTripId));
  const deleteMutation = useDeletePhotoMutation();

  // Convert DB photos to MemoryPhoto structure
  const realPhotos: MemoryPhoto[] = userPhotos.map((p) => ({
    id: String(p.id),
    url: p.url,
    title: p.title || `${album.destination} Memory`,
    locationName: p.locationName || album.destination,
    date: p.uploadedAt ? new Date(p.uploadedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
  }));

  // Group real photos by locationName
  const locationMap = new Map<string, MemoryPhoto[]>();
  realPhotos.forEach((photo) => {
    const loc = photo.locationName || album.destination;
    if (!locationMap.has(loc)) {
      locationMap.set(loc, []);
    }
    locationMap.get(loc)!.push(photo);
  });

  const groupedSections = Array.from(locationMap.entries()).map(([locationName, photos]) => ({
    locationName,
    photos,
  }));

  const handleDeletePhoto = async (photoId: string) => {
    if (!numericTripId) return;
    if (window.confirm('Are you sure you want to delete this photo memory?')) {
      try {
        await deleteMutation.mutateAsync({ tripId: numericTripId, photoId });
        if (selectedPhoto?.id === photoId) {
          setSelectedPhoto(null);
        }
      } catch (err) {
        console.error('Failed to delete photo', err);
      }
    }
  };

  return (
    <div className="flex flex-col w-full px-6 md:px-12 pb-24 space-y-10 mt-4 animate-fadeIn max-w-[1320px] mx-auto">
      {/* Top Action & Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E8E2D5] text-[#1B3022] font-body-semibold text-xs shadow-xs hover:bg-[#F1EDE7] hover:scale-105 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Memories</span>
        </button>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-[#1B3022] hover:bg-[#2c4634] text-white px-5 py-2 rounded-full font-body-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
          <span>Upload Photos</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <section className="relative w-full rounded-3xl overflow-hidden shadow-[0_16px_48px_rgba(27,48,34,0.12)] bg-[#1B3022]">
        <div
          className="w-full h-[320px] md:h-[360px] bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${
              realPhotos.length > 0 ? realPhotos[0].url : album.coverImage
            })`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#242924]/90 via-[#242924]/40 to-transparent" />

          {/* Hero Content */}
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#cfeacd] text-[#1B3022] font-label-caps text-[10px] px-3.5 py-1 rounded-full uppercase tracking-widest font-bold">
                {album.country} • Photo Album
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-body-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                {realPhotos.length} {realPhotos.length === 1 ? 'Photo' : 'Photos'}
              </span>
            </div>

            <h1 className="font-display-lg text-4xl md:text-5xl font-bold leading-tight text-white">
              {album.destination} Memories
            </h1>

            <p className="font-body-base text-sm text-white/90 leading-relaxed">
              {realPhotos.length > 0
                ? `Captured moments from your trip to ${album.destination}.`
                : `No photo memories stored for ${album.destination} yet.`}
            </p>
          </div>
        </div>
      </section>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center text-[#434843] gap-3">
          <span className="material-symbols-outlined animate-spin text-[36px] text-[#1B3022]">
            progress_activity
          </span>
          <p className="font-body-semibold text-xs tracking-wide">
            Loading photos for {album.destination}...
          </p>
        </div>
      )}

      {/* Empty State when 0 photos uploaded */}
      {!isLoading && realPhotos.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2D5]/70 shadow-[0_8px_30px_rgba(43,36,30,0.04)] flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto my-6">
          <div className="w-16 h-16 rounded-full bg-[#1B3022]/10 text-[#1B3022] flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">no_photography</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-headline-lg text-2xl font-bold text-[#242924]">
              No memories yet
            </h3>
            <p className="font-body-base text-sm text-[#737973] leading-relaxed">
              You haven't uploaded any photos for your trip to {album.destination} yet. Upload your favorite moments to build this photo album!
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-2 bg-[#1B3022] hover:bg-[#2c4634] text-white px-7 py-3 rounded-full font-body-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
            <span>Upload Photos</span>
          </button>
        </div>
      )}

      {/* Genuine Uploaded Photos Grouped by Location */}
      {!isLoading && realPhotos.length > 0 && (
        <section className="space-y-12">
          {groupedSections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-[#E8E2D5]/70 pb-3">
                <div className="w-8 h-8 rounded-full bg-[#1B3022] text-white flex items-center justify-center font-body-semibold text-xs shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                </div>
                <div>
                  <h2 className="font-headline-lg text-xl md:text-2xl text-[#242924] font-bold">
                    {section.locationName}
                  </h2>
                  <span className="font-label-caps text-[10px] text-[#737973] uppercase tracking-wider">
                    {section.photos.length} {section.photos.length === 1 ? 'Shot' : 'Shots'}
                  </span>
                </div>
              </div>

              {/* Responsive Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {section.photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[#E8E2D5]/50 cursor-pointer transition-all duration-300 bg-[#1B3022]"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#242924]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Delete Icon Overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photo.id);
                      }}
                      title="Delete photo memory"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <h4 className="font-headline-sm text-sm font-bold text-white truncate">
                        {photo.title}
                      </h4>
                      {photo.date && (
                        <p className="font-body-base text-[11px] text-white/80 mt-0.5">
                          {photo.date}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Lightbox Photo Preview Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-[#1C1C18]/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-[#1B3022] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
            {/* Modal Header */}
            <div className="p-4 px-6 flex items-center justify-between border-b border-white/10 text-white">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#cfeacd]">photo</span>
                <span className="font-headline-sm text-sm font-bold">{selectedPhoto.title}</span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Photo Container */}
            <div className="relative max-h-[70vh] flex items-center justify-center bg-black/40 overflow-hidden p-2">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-[#242924] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="bg-[#cfeacd] text-[#1B3022] text-[10px] font-label-caps px-2.5 py-0.5 rounded-full font-bold uppercase">
                  {selectedPhoto.locationName}
                </span>
                <h3 className="font-display-lg text-lg text-white font-bold mt-1">
                  {selectedPhoto.title}
                </h3>
              </div>
              {selectedPhoto.date && (
                <div className="text-xs text-white/70 font-body-base flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  <span>Uploaded on {selectedPhoto.date}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Photo Modal Dialog */}
      {numericTripId && (
        <UploadPhotoModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          tripId={numericTripId}
          destinationName={album.destination}
        />
      )}
    </div>
  );
};

export default AlbumDetailView;
