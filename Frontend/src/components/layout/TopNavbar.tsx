import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useDestinationSearchQuery } from '../../hooks/useDestinationExploration';

interface TopNavbarProps {
  onOpenCreateTrip: () => void;
  onOpenProfile: () => void;
  onSelectDestination: (destinationName: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenCreateTrip,
  onOpenProfile,
  onSelectDestination,
}) => {
  const { user } = useAuthStore();

  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading } = useDestinationSearchQuery(query, isFocused);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (destinationName: string) => {
    setIsFocused(false);
    setQuery('');
    onSelectDestination(destinationName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        handleSelect(query.trim());
      }
    }
  };

  const trendingDestinations = ['Paris', 'Kyoto', 'Amalfi Coast', 'Zurich', 'Tokyo', 'Rome', 'Santorini', 'Bali'];

  const hasResults =
    searchResults &&
    (searchResults.destinations.length > 0 ||
      searchResults.hotels.length > 0 ||
      searchResults.experiences.length > 0);

  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-[#fdf9f3]/90 backdrop-blur-[20px] z-40 flex items-center justify-between px-8 shadow-[0_4px_20px_rgba(27,48,34,0.06)] border-b border-[#8FA88E]/20">
      {/* Destination Discovery Autocomplete Search Bar */}
      <div className="flex-1 max-w-xl relative" ref={searchRef}>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-[#8FA88E] text-[20px]">
            explore
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Discover destinations, luxury stays, or experiences..."
            className="w-full bg-[#F1EDE7] border border-transparent rounded-full py-2.5 pl-12 pr-10 text-sm font-body-base text-[#242924] placeholder-[#737973] focus:outline-none focus:ring-2 focus:ring-[#8FA88E]/30 focus:border-[#8FA88E] transition-all shadow-xs"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 text-[#737973] hover:text-[#242924] p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Polished Autocomplete Dropdown Panel */}
        {isFocused && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-[#fdf9f3]/95 backdrop-blur-[20px] rounded-3xl shadow-[0_16px_48px_rgba(27,48,34,0.15)] border border-[#8FA88E]/30 overflow-hidden z-50 p-4 max-h-[75vh] overflow-y-auto custom-scrollbar animate-fadeIn">
            {/* 1. Empty Input state: Show Trending Destinations */}
            {!query.trim() && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#F1EDE7] pb-2">
                  <span className="font-label-caps text-[10px] text-[#8FA88E] uppercase tracking-widest">
                    Trending World Destinations
                  </span>
                  <span className="text-[10px] font-body-semibold text-[#737973]">Discovery Hub</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingDestinations.map((dest) => (
                    <button
                      key={dest}
                      onClick={() => handleSelect(dest)}
                      className="px-3.5 py-1.5 rounded-full bg-[#F1EDE7] hover:bg-[#cfeacd] text-[#242924] hover:text-[#1B3022] text-xs font-body-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[14px] text-[#8FA88E]">location_on</span>
                      {dest}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Loading State */}
            {query.trim() && isLoading && (
              <div className="py-8 text-center text-[#737973] flex flex-col items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-[24px] text-[#1B3022]">
                  progress_activity
                </span>
                <span className="text-xs font-body-semibold">Searching world travel database...</span>
              </div>
            )}

            {/* 3. Grouped Search Results */}
            {query.trim() && !isLoading && (
              <div className="space-y-5">
                {!hasResults && (
                  <div className="py-6 text-center text-[#737973]">
                    <p className="text-xs font-body-semibold">No direct matches found for "{query}"</p>
                    <button
                      onClick={() => handleSelect(query)}
                      className="mt-3 bg-[#1B3022] text-white px-5 py-2 rounded-full text-xs font-body-semibold hover:bg-[#2c4634] transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Explore "{query}" Info Page</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                )}

                {/* Destinations Group */}
                {searchResults && searchResults.destinations.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-label-caps text-[#1B3022] mb-2 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      Destinations ({searchResults.destinations.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.destinations.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item.destinationName)}
                          className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F1EDE7] transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-10 h-10 rounded-xl object-cover shadow-2xs group-hover:scale-105 transition-transform"
                            />
                            <div>
                              <div className="font-body-semibold text-sm text-[#242924] group-hover:text-[#1B3022]">
                                {item.title}
                              </div>
                              <div className="text-xs text-[#737973]">{item.subtitle}</div>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-[18px] text-[#737973] group-hover:text-[#1B3022] group-hover:translate-x-1 transition-all">
                            chevron_right
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hotels Group */}
                {searchResults && searchResults.hotels.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-label-caps text-[#1B3022] mb-2 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px]">hotel</span>
                      Luxury Stays ({searchResults.hotels.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.hotels.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item.destinationName)}
                          className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F1EDE7] transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-10 h-10 rounded-xl object-cover shadow-2xs group-hover:scale-105 transition-transform"
                            />
                            <div>
                              <div className="font-body-semibold text-sm text-[#242924] group-hover:text-[#1B3022]">
                                {item.title}
                              </div>
                              <div className="text-xs text-[#737973]">{item.subtitle}</div>
                            </div>
                          </div>
                          <span className="text-xs font-body-semibold bg-[#cfeacd] text-[#1B3022] px-2.5 py-0.5 rounded-full">
                            {item.priceRange || '$$$$'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experiences Group */}
                {searchResults && searchResults.experiences.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-label-caps text-[#1B3022] mb-2 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px]">attractions</span>
                      Experiences & Sights ({searchResults.experiences.length})
                    </div>
                    <div className="space-y-1">
                      {searchResults.experiences.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item.destinationName)}
                          className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F1EDE7] transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-10 h-10 rounded-xl object-cover shadow-2xs group-hover:scale-105 transition-transform"
                            />
                            <div>
                              <div className="font-body-semibold text-sm text-[#242924] group-hover:text-[#1B3022]">
                                {item.title}
                              </div>
                              <div className="text-xs text-[#737973]">{item.subtitle}</div>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-[18px] text-[#737973] group-hover:text-[#1B3022] group-hover:translate-x-1 transition-all">
                            arrow_forward
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center gap-6 ml-4">
        {/* Notification Bell */}
        <button className="flex items-center justify-center p-2.5 rounded-full text-[#737973] hover:bg-[#F1EDE7] transition-colors relative cursor-pointer">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#1B3022]"></span>
        </button>

        <div className="h-6 w-[1px] bg-[#8FA88E]/20"></div>

        {/* User Profile Trigger */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-[#F1EDE7] transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#1B3022] text-white flex items-center justify-center font-body-semibold text-xs shadow-xs">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'ER'}
          </div>
        </button>

        {/* Primary CTA */}
        <button
          onClick={onOpenCreateTrip}
          className="bg-[#1B3022] text-white px-6 py-2.5 rounded-full font-body-semibold text-sm shadow-md hover:bg-[#2c4634] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Plan a Trip
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
