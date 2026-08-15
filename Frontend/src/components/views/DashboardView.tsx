import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useMyTripsQuery } from '../../hooks/useTrips';
import { useTravelStore } from '../../store/useTravelStore';

interface DashboardViewProps {
  onSelectTrip: (tripId: string) => void;
  onViewAllTrips: () => void;
  onOpenCreateTrip: (destinationPreset?: string) => void;
  onViewMemories: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectTrip,
  onViewAllTrips,
  onOpenCreateTrip,
  onViewMemories,
}) => {
  const { data: myTrips = [] } = useMyTripsQuery();
  const { searchQuery, setSearchQuery } = useTravelStore();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Initialize Leaflet Interactive Map Canvas
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([40.0, 20.0], 3);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Pins data
      const pinLocations = [
        { name: "Amalfi Coast", coords: [40.6340, 14.6027] as [number, number] },
        { name: "Santorini", coords: [36.3932, 25.4615] as [number, number] },
        { name: "Kyoto", coords: [35.0116, 135.7681] as [number, number] },
        { name: "Swiss Alps", coords: [46.56, 8.56] as [number, number] },
      ];

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: '<div class="w-4 h-4 bg-[#1B3022] rounded-full border-2 border-white shadow-md hover:scale-125 transition-transform"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const pathCoords: [number, number][] = [];

      pinLocations.forEach((loc) => {
        L.marker(loc.coords, { icon: customIcon })
          .bindTooltip(loc.name, {
            permanent: true,
            direction: 'top',
            className: 'map-tooltip',
            offset: [0, -10],
          })
          .addTo(map);

        pathCoords.push(loc.coords);
      });

      L.polyline(pathCoords, {
        color: '#1B3022',
        weight: 2.5,
        dashArray: '8, 6',
        opacity: 0.8,
        lineCap: 'round',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenCreateTrip(searchQuery);
    }
  };

  // Fallback curated trip cards if user has no trips yet
  const upcomingTripsToDisplay = myTrips.length > 0 ? myTrips.slice(0, 2) : null;

  return (
    <div className="flex flex-col w-full px-6 md:px-8 pb-16 space-y-10 mt-6 animate-fadeIn">
      {/* 1. Hero Map Container with Search Overlay */}
      <section className="relative w-full h-[58vh] min-h-[420px] rounded-3xl overflow-hidden shadow-xl bg-[#F0E6D8] border border-[#E8E2D5]/50">
        <div ref={mapContainerRef} className="absolute inset-0 z-0" />
        
        {/* Glassmorphic Search Card Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 text-center pointer-events-none">
          <div className="max-w-2xl w-full space-y-5 bg-[#fdf9f3]/90 backdrop-blur-[20px] p-8 rounded-3xl shadow-[0_16px_48px_rgba(27,48,34,0.12)] border border-[#8FA88E]/30 pointer-events-auto">
            <div className="space-y-1">
              <span className="text-label-caps text-[#1B3022] bg-[#cfeacd] px-3.5 py-1 rounded-full inline-block font-body-semibold">
                Interactive Explorer
              </span>
              <h1 className="font-display-lg text-3xl md:text-4xl text-[#242924]">
                Where to next, Voyager?
              </h1>
            </div>
            
            <form onSubmit={handleHeroSearch} className="relative max-w-xl mx-auto w-full group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#1B3022] text-[22px] group-focus-within:scale-110 transition-transform">
                explore
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, hotels, or experiences..."
                className="w-full bg-[#F1EDE7] border border-transparent rounded-full py-3.5 pl-12 pr-28 text-sm md:text-base font-body-base shadow-xs focus:outline-none focus:border-[#8FA88E] focus:ring-4 focus:ring-[#8FA88E]/10 transition-all text-[#242924]"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1B3022] text-white px-6 py-2 rounded-full font-body-semibold text-sm hover:bg-[#2c4634] hover:scale-105 transition-transform shadow-md cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Upcoming Itineraries & Travel Stats Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Upcoming Itineraries */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-headline-lg text-2xl md:text-3xl text-[#2B241E]">Upcoming Itineraries</h2>
              <p className="font-body-base text-sm text-[#685D52] mt-1">Your curated journeys, ready to unfold.</p>
            </div>
            <button
              onClick={onViewAllTrips}
              className="text-[#1B3022] font-body-semibold text-sm hover:text-[#2c4634] transition-colors flex items-center gap-1 cursor-pointer"
            >
              View All <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingTripsToDisplay ? (
              upcomingTripsToDisplay.map((trip) => (
                <article
                  key={trip.id}
                  onClick={() => onSelectTrip(String(trip.id))}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(43,36,30,0.05)] border border-[#E8E2D5]/50 group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div
                    className="h-44 w-full bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url(${
                        trip.imageUrl ||
                        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
                      })`,
                    }}
                  >
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E8703A] animate-pulse"></span>
                      <span className="font-label-caps text-[#2B241E] text-[9px]">Active Trip</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#685D52] mb-1 text-xs">
                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                        <span>{trip.startDate} - {trip.endDate}</span>
                      </div>
                      <h3 className="font-title-lg text-lg text-[#2B241E] truncate">{trip.destination}</h3>
                    </div>
                    <div className="h-[1px] w-full bg-[#E8E2D5]/60"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#685D52] font-body-base">
                        Budget: ${trip.budget ? trip.budget.toLocaleString() : '2,500'}
                      </span>
                      <span className="font-body-semibold text-xs text-[#1B3022] group-hover:translate-x-1 transition-transform flex items-center">
                        Details <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              // Default Sample Cards if no trips in backend
              <>
                <article
                  onClick={() => onOpenCreateTrip('Amalfi Coast')}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(43,36,30,0.05)] border border-[#E8E2D5]/50 group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div
                    className="h-44 w-full bg-cover bg-center relative"
                    style={{
                      backgroundImage: 'url(https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80)',
                    }}
                  >
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E8703A] animate-pulse"></span>
                      <span className="font-label-caps text-[#2B241E] text-[9px]">In 14 Days</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#685D52] mb-1 text-xs">
                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                        <span>Sep 12 - Sep 24</span>
                      </div>
                      <h3 className="font-title-lg text-lg text-[#2B241E]">Amalfi Coast Escape</h3>
                    </div>
                    <div className="h-[1px] w-full bg-[#E8E2D5]/60"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-[#ffddb7] border-2 border-white flex items-center justify-center font-label-caps text-[9px] text-[#2a1700]">ER</div>
                        <div className="w-7 h-7 rounded-full bg-[#d7ec95] border-2 border-white flex items-center justify-center font-label-caps text-[9px] text-[#161e00]">MR</div>
                      </div>
                      <span className="font-body-semibold text-xs text-[#1B3022] group-hover:translate-x-1 transition-transform flex items-center">
                        Plan Now <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </article>

                <article
                  onClick={() => onOpenCreateTrip('Santorini')}
                  className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(43,36,30,0.05)] border border-[#E8E2D5]/50 group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div
                    className="h-44 w-full bg-cover bg-center relative"
                    style={{
                      backgroundImage: 'url(https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80)',
                    }}
                  >
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-xs">
                      <span className="font-label-caps text-[#2B241E] text-[9px]">Planning</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#685D52] mb-1 text-xs">
                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                        <span>Oct 05 - Oct 12</span>
                      </div>
                      <h3 className="font-title-lg text-lg text-[#2B241E]">Santorini Retreat</h3>
                    </div>
                    <div className="h-[1px] w-full bg-[#E8E2D5]/60"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-[#ffddb7] border-2 border-white flex items-center justify-center font-label-caps text-[9px] text-[#2a1700]">ER</div>
                      </div>
                      <span className="font-body-semibold text-xs text-[#1B3022] group-hover:translate-x-1 transition-transform flex items-center">
                        Continue <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </article>
              </>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Travel Memories Card */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div
            onClick={onViewMemories}
            className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(43,36,30,0.05)] border border-[#E8E2D5]/50 flex flex-col justify-between gap-5 h-full group hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative"
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-headline-lg text-2xl text-[#2B241E] group-hover:text-[#1B3022] transition-colors">
                  Travel Memories
                </h2>
                <span className="w-8 h-8 rounded-full bg-[#cfeacd] text-[#1B3022] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">photo_library</span>
                </span>
              </div>
              <p className="font-body-base text-xs text-[#685D52] mt-0.5">
                Visual keepsakes from your journeys
              </p>
            </div>

            {/* Photo Preview from user's authentic trip memory */}
            <div className="relative w-full h-48 md:h-52 rounded-2xl overflow-hidden shadow-inner border border-[#E8E2D5]/60 bg-[#1B3022]">
              {myTrips.length > 0 ? (
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 relative"
                  style={{
                    backgroundImage: `url(${
                      myTrips[0]?.imageUrl ||
                      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
                    })`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#242924]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="bg-[#cfeacd] text-[#1B3022] font-label-caps text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase">
                      {myTrips[0]?.destination} Album
                    </span>
                    <h4 className="font-display-lg text-lg font-bold text-white mt-1 truncate">
                      {myTrips[0]?.destination}
                    </h4>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/80 p-4 text-center">
                  <span className="material-symbols-outlined text-[32px] text-[#cfeacd] mb-1">
                    photo_album
                  </span>
                  <span className="font-body-semibold text-xs text-white">
                    No Memory Albums Yet
                  </span>
                  <span className="font-label-caps text-[10px] text-white/60 mt-0.5">
                    Create a trip to get started
                  </span>
                </div>
              )}
            </div>

            {/* View Memories Action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewMemories();
              }}
              className="w-full bg-[#1B3022] hover:bg-[#2c4634] text-white py-3 rounded-full font-body-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Memories</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </aside>
      </section>

      {/* 3. Curated for You Destinations Grid */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="font-headline-lg text-2xl md:text-3xl text-[#2B241E]">Curated for You</h2>
          <p className="font-body-base text-sm text-[#685D52] mt-1">Discover destinations matching your style.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: 'Tuscan Villas',
              subtitle: 'Rustic charm & vineyards',
              image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
            },
            {
              title: 'Kyoto Retreats',
              subtitle: 'Zen gardens & tradition',
              image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
            },
            {
              title: 'Hidden Maldives',
              subtitle: 'Private atolls & tranquility',
              image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
            },
            {
              title: 'Marrakech Souks',
              subtitle: 'Colors, spices & culture',
              image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onOpenCreateTrip(item.title)}
              className="group block relative h-60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B241E]/80 via-[#2B241E]/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <h4 className="font-headline-lg text-lg text-white leading-tight">{item.title}</h4>
                <p className="font-body-base text-xs text-white/80 mt-1 line-clamp-1">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardView;
