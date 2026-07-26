import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, MapPin, Compass, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface DestinationSlide {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
}

const DESTINATIONS: DestinationSlide[] = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    location: 'Agra, India',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'santorini',
    name: 'Santorini',
    location: 'Cyclades, Greece',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'kyoto',
    name: 'Fushimi Inari Shrine',
    location: 'Kyoto, Japan',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'machu-picchu',
    name: 'Machu Picchu',
    location: 'Cusco Region, Peru',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'swiss-alps',
    name: 'Matterhorn Peak',
    location: 'Zermatt, Switzerland',
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'paris',
    name: 'Eiffel Tower',
    location: 'Paris, France',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'colosseum',
    name: 'The Colosseum',
    location: 'Rome, Italy',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1920&q=85',
  },
];

export const LandingPage: React.FC = () => {
  const { setView, token } = useAuthStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % DESTINATIONS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentDest = DESTINATIONS[currentSlideIndex];

  const handleStart = () => {
    if (token) {
      setView('map');
    } else {
      setView('register');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-y-auto bg-[#1E1B18] text-[#FAF8F3] font-sans select-none custom-scrollbar scroll-smooth">
      
      {/* SECTION 1: CINEMATIC FULLSCREEN HERO */}
      <div className="relative w-full h-screen flex flex-col justify-between overflow-hidden">
        
        {/* Fullscreen Destination Background Carousel */}
        {DESTINATIONS.map((dest, idx) => (
          <div
            key={dest.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{
              transitionProperty: 'opacity, transform',
              transitionDuration: '1200ms, 10000ms',
            }}
          >
            <img
              src={dest.imageUrl}
              alt={dest.name}
              className="w-full h-full object-cover filter brightness-[0.82] contrast-[1.05]"
            />
          </div>
        ))}

        {/* Warm Sunrise Golden Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E1B18]/50 via-[#1E1B18]/30 to-[#1E1B18]/90 pointer-events-none z-10" />

        {/* Top Luxury Navigation */}
        <header className="relative z-20 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2F2A24]/60 backdrop-blur-md border border-[#E8E2D5]/20 text-[#FAF8F3] shadow-lg">
              <Sparkles className="w-4 h-4 text-[#C19A6B] fill-[#C19A6B]" />
              <span className="font-serif-luxury font-bold text-sm tracking-wider">Voyager</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setView('login')}
              className="px-5 py-2 rounded-full text-xs font-semibold text-[#FAF8F3]/90 hover:text-white hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm"
            >
              Sign In
            </button>
            <button
              onClick={handleStart}
              className="px-6 py-2.5 rounded-full bg-[#C19A6B] hover:bg-[#A88254] active:scale-95 text-white font-bold text-xs shadow-xl shadow-amber-950/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Hero Center Editorial Headline & Single CTA */}
        <main className="relative z-20 max-w-4xl w-full mx-auto px-6 text-center flex flex-col items-center my-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F2A24]/60 backdrop-blur-md border border-[#E8E2D5]/20 text-xs font-medium text-[#E8E2D5] mb-8 animate-fadeIn">
            <Compass className="w-3.5 h-3.5 text-[#5FAF8D]" />
            <span>Curated Journeys for Extraordinary Explorers</span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FAF8F3] leading-[1.1] mb-6 drop-shadow-md">
            Explore the world, <br />
            <span className="italic font-normal text-[#E8E2D5]">one body of wanderlust at a time.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#E8E2D5]/90 max-w-xl font-normal leading-relaxed mb-10 drop-shadow">
            Every journey begins with curiosity. Discover hand-crafted itineraries, live weather-aware routes, and iconic landmarks tailored to your travel style.
          </p>

          <div className="flex items-center justify-center">
            <button
              onClick={handleStart}
              className="px-8 py-4 rounded-full bg-[#C19A6B] hover:bg-[#A88254] active:scale-95 text-white font-bold text-sm shadow-2xl shadow-amber-950/40 transition-all cursor-pointer flex items-center gap-3 group"
            >
              <span>Begin Your Journey</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </main>

        {/* Bottom Bar: Destination Badge & Scroll Hint */}
        <footer className="relative z-20 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between text-xs text-[#E8E2D5]/80">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2F2A24]/60 backdrop-blur-md border border-[#E8E2D5]/20">
            <MapPin className="w-3.5 h-3.5 text-[#C19A6B]" />
            <span className="font-semibold text-white">{currentDest.name}</span>
            <span className="text-[#E8E2D5]/60">• {currentDest.location}</span>
          </div>

          <a
            href="#explore-map"
            className="flex items-center gap-2 text-xs font-semibold hover:text-white transition-colors cursor-pointer"
          >
            <span>Scroll to Discover</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#C19A6B]" />
          </a>
        </footer>
      </div>

      {/* SECTION 2: SMOOTH TRANSITION TO VOYAGER MAP CANVAS PREVIEW */}
      <section id="explore-map" className="relative z-20 bg-[#FAF8F3] text-[#2F2A24] py-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-10">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3EFE8] border border-[#E8E2D5] text-xs font-bold text-[#C19A6B]">
              <Sparkles className="w-3.5 h-3.5 text-[#C19A6B]" />
              <span>Interactive Travel Canvas</span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold tracking-tight text-[#2F2A24]">
              The Map is Your Gateway
            </h2>

            <p className="text-sm text-[#6E665C] max-w-lg mx-auto font-medium leading-relaxed">
              Experience seamless trip planning where real road polylines, dynamic weather insights, and tailored itineraries converge in perfect harmony.
            </p>
          </div>

          {/* Luxury Frame Canvas Preview */}
          <div
            onClick={handleStart}
            className="relative w-full max-w-4xl rounded-3xl overflow-hidden border border-[#E8E2D5] shadow-2xl bg-[#FAF8F3] p-3 cursor-pointer group transition-transform hover:scale-[1.01]"
          >
            {/* Window Top Controls */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#F3EFE8] rounded-2xl border border-[#E8E2D5] mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400/80" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="px-5 py-1 rounded-full bg-white border border-[#E8E2D5] text-[11px] font-semibold text-[#6E665C]">
                voyager.app/mumbai
              </div>
              <div className="w-12" />
            </div>

            {/* Canvas Preview Graphic */}
            <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-[#E8E2D5] bg-[#FAF8F3] flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80"
                alt="Voyager Map Interface"
                className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.02] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B18]/70 via-transparent to-transparent flex flex-col justify-end p-8 text-left text-white">
                <div className="text-xs uppercase tracking-wider text-[#C19A6B] font-bold">Featured Journey</div>
                <div className="font-serif-luxury text-2xl font-bold">Mumbai & South Coast Expedition</div>
                <p className="text-xs text-stone-300 mt-1 max-w-md font-normal">
                  Gateway of India • Marine Drive Promenade • Bandra Fort • Kala Ghoda District
                </p>
              </div>

              {/* Central Play/Explore Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-[#1E1B18]/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="px-6 py-3 rounded-full bg-[#C19A6B] text-white font-bold text-xs shadow-2xl flex items-center gap-2">
                  <span>Open Interactive Map</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStart}
              className="px-8 py-3.5 rounded-full bg-[#2F2A24] hover:bg-[#4A443D] text-[#FAF8F3] font-bold text-xs shadow-xl transition-all cursor-pointer flex items-center gap-2 mx-auto"
            >
              <span>Explore All Destinations</span>
              <ArrowRight className="w-4 h-4 text-[#C19A6B]" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: EDITORIAL FOOTER */}
      <footer className="bg-[#F3EFE8] border-t border-[#E8E2D5] py-8 px-6 text-center text-xs text-[#6E665C]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C19A6B] fill-[#C19A6B]" />
            <span className="font-serif-luxury font-bold text-sm text-[#2F2A24]">Voyager</span>
          </div>
          <div>© 2026 Voyager. Inspired by the spirit of adventure.</div>
          <div className="flex items-center gap-4 text-[#6E665C] font-semibold">
            <button onClick={() => setView('login')} className="hover:text-[#2F2A24]">Sign In</button>
            <button onClick={handleStart} className="hover:text-[#2F2A24]">Create Journey</button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
