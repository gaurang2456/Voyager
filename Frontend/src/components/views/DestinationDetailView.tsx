import React from 'react';
import { useDestinationDetailQuery } from '../../hooks/useDestinationExploration';
import type { RealPlace, DestinationSuggestion } from '../../api/explore';

interface DestinationDetailViewProps {
  destinationName: string;
  onOpenCreateTrip: (destinationName: string) => void;
  onBack?: () => void;
}

export const DestinationDetailView: React.FC<DestinationDetailViewProps> = ({
  destinationName,
  onOpenCreateTrip,
  onBack,
}) => {
  const { data: detail, isLoading, isError } = useDestinationDetailQuery(destinationName);

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-[#434843] gap-4">
        <span className="material-symbols-outlined animate-spin text-[40px] text-[#1B3022]">
          progress_activity
        </span>
        <p className="font-body-semibold text-sm tracking-wide">
          Loading destination exploration details for "{destinationName}"...
        </p>
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#ffdad6] text-[#93000a] flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">error</span>
        </div>
        <h3 className="font-headline-lg text-2xl text-[#242924]">Destination Not Found</h3>
        <p className="font-body-base text-sm text-[#434843] mt-2 leading-relaxed">
          We couldn't retrieve details for "{destinationName}". You can still plan a trip directly!
        </p>
        <button
          onClick={() => onOpenCreateTrip(destinationName)}
          className="mt-6 bg-[#1B3022] text-white px-7 py-3 rounded-full font-body-semibold text-sm hover:bg-[#2c4634] shadow-md transition-all cursor-pointer"
        >
          Plan a Trip to {destinationName}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-6 md:px-16 pb-20 space-y-12 mt-4 animate-fadeIn max-w-[1200px] mx-auto">
      {/* Navigation Back bar if available */}
      {onBack && (
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-body-semibold text-[#1B3022] hover:text-[#8FA88E] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Overview
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full rounded-3xl overflow-hidden shadow-[0_16px_48px_rgba(27,48,34,0.12)] bg-[#1B3022]">
        <div
          className="w-full h-[420px] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${detail.heroImage})` }}
        >
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#242924]/90 via-[#242924]/40 to-transparent" />

          {/* Hero Content Overlay */}
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#cfeacd] text-[#1B3022] font-label-caps text-[10px] px-3.5 py-1 rounded-full uppercase tracking-widest font-semibold">
                {detail.country} • {detail.region}
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-body-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-amber-400 fill-amber-400">star</span>
                {detail.rating} Destination Rating
              </span>
            </div>

            <h1 className="font-display-lg text-4xl md:text-5xl text-white font-bold leading-tight">
              {detail.name}
            </h1>

            <p className="font-headline-sm text-lg md:text-xl text-[#F1EDE7] italic font-normal">
              "{detail.tagline}"
            </p>

            <p className="font-body-base text-sm md:text-base text-white/90 leading-relaxed line-clamp-3">
              {detail.description}
            </p>

            {/* Prominent Action Button */}
            <div className="pt-2">
              <button
                onClick={() => onOpenCreateTrip(detail.name)}
                className="bg-[#1B3022] hover:bg-[#2c4634] text-white px-8 py-3.5 rounded-full font-body-semibold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer border border-[#8FA88E]/40"
              >
                <span className="material-symbols-outlined text-[20px] text-[#cfeacd]">auto_awesome</span>
                <span>Plan a Trip to {detail.name}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Metadata Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#ffffff] p-5 rounded-2xl shadow-[0_8px_24px_rgba(27,48,34,0.06)] flex flex-col justify-center gap-1">
          <span className="font-label-caps text-[10px] text-[#737973] uppercase tracking-wider">Best Time to Visit</span>
          <span className="font-body-semibold text-base text-[#242924]">{detail.bestTimeToVisit}</span>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-2xl shadow-[0_8px_24px_rgba(27,48,34,0.06)] flex flex-col justify-center gap-1">
          <span className="font-label-caps text-[10px] text-[#737973] uppercase tracking-wider">Currency</span>
          <span className="font-body-semibold text-base text-[#242924]">{detail.currency}</span>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-2xl shadow-[0_8px_24px_rgba(27,48,34,0.06)] flex flex-col justify-center gap-1">
          <span className="font-label-caps text-[10px] text-[#737973] uppercase tracking-wider">Avg Daily Budget</span>
          <span className="font-body-semibold text-base text-[#242924]">${detail.avgDailyCost}/day</span>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-2xl shadow-[0_8px_24px_rgba(27,48,34,0.06)] flex flex-col justify-center gap-1">
          <span className="font-label-caps text-[10px] text-[#737973] uppercase tracking-wider">Popular Styles</span>
          <span className="font-body-semibold text-xs text-[#1B3022] bg-[#cfeacd] px-2.5 py-0.5 rounded-full self-start">
            {detail.popularStyles[0] || 'Luxury Travel'}
          </span>
        </div>
      </section>

      {/* Top Sights & Real POIs Section */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#F1EDE7] pb-4">
          <div>
            <span className="font-label-caps text-[#8FA88E] text-xs tracking-widest block mb-1">
              Authentic Sights & Attractions
            </span>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-[#242924] font-bold">
              Must-Visit Places in {detail.name}
            </h2>
          </div>
        </div>

        {detail.places && detail.places.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detail.places.slice(0, 9).map((place: RealPlace) => (
              <article
                key={place.placeId}
                className="bg-[#ffffff] rounded-2xl p-5 shadow-[0_10px_30px_rgba(27,48,34,0.06)] flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-label-caps text-[9px] bg-[#cfeacd] text-[#1B3022] px-2.5 py-0.5 rounded-full font-semibold">
                      {place.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-body-semibold text-amber-700">
                      <span className="material-symbols-outlined text-[14px] text-amber-500 fill-amber-500">star</span>
                      {place.rating || 4.8}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-lg text-[#242924] font-bold line-clamp-1">
                    {place.name}
                  </h3>
                  <p className="font-body-base text-xs text-[#737973] mt-1 line-clamp-2 leading-relaxed">
                    {place.description || place.formattedAddress}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F1EDE7]">
                  <span className="text-xs font-body-semibold text-[#242924]">
                    Est. {place.estimatedCost === 0 ? 'Free' : `$${place.estimatedCost}`}
                  </span>
                  <button
                    onClick={() => onOpenCreateTrip(detail.name)}
                    className="text-[#1B3022] hover:text-[#8FA88E] font-body-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Include in Trip</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-[#ffffff] rounded-2xl text-center text-[#737973] shadow-xs">
            Explore authentic attractions, museums, and natural highlights for {detail.name}.
          </div>
        )}
      </section>

      {/* Luxury Hotels Section */}
      {detail.hotels && detail.hotels.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-[#F1EDE7] pb-4">
            <span className="font-label-caps text-[#8FA88E] text-xs tracking-widest block mb-1">
              Refined Accommodations
            </span>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-[#242924] font-bold">
              Luxury Hotels & Stays in {detail.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detail.hotels.map((hotel: DestinationSuggestion) => (
              <article
                key={hotel.id}
                className="bg-[#ffffff] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(27,48,34,0.06)] flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div
                  className="h-44 w-full bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${hotel.imageUrl})` }}
                >
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-body-semibold text-[#1B3022]">
                    {hotel.priceRange || '$$$$'}
                  </span>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <span className="font-label-caps text-[9px] text-[#737973]">{hotel.subtitle}</span>
                    <h3 className="font-headline-sm text-lg text-[#242924] font-bold">{hotel.title}</h3>
                  </div>

                  <button
                    onClick={() => onOpenCreateTrip(detail.name)}
                    className="w-full bg-[#1B3022] text-white py-2.5 rounded-full font-body-semibold text-xs hover:bg-[#2c4634] transition-all cursor-pointer shadow-xs"
                  >
                    Plan Trip with This Stay
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Iconic Experiences Section */}
      {detail.experiences && detail.experiences.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-[#F1EDE7] pb-4">
            <span className="font-label-caps text-[#8FA88E] text-xs tracking-widest block mb-1">
              Curated Curiosities
            </span>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-[#242924] font-bold">
              Unforgettable Experiences in {detail.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detail.experiences.map((exp: DestinationSuggestion) => (
              <article
                key={exp.id}
                className="bg-[#ffffff] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(27,48,34,0.06)] flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div
                  className="h-44 w-full bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${exp.imageUrl})` }}
                >
                  <span className="absolute top-3 right-3 bg-[#1B3022]/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-label-caps">
                    {exp.subtitle}
                  </span>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <h3 className="font-headline-sm text-lg text-[#242924] font-bold">{exp.title}</h3>
                  </div>

                  <button
                    onClick={() => onOpenCreateTrip(detail.name)}
                    className="w-full bg-[#1B3022] text-white py-2.5 rounded-full font-body-semibold text-xs hover:bg-[#2c4634] transition-all cursor-pointer shadow-xs"
                  >
                    Include Experience in Trip
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DestinationDetailView;
