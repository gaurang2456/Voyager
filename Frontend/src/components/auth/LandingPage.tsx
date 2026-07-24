import React from 'react';
import {
  Sparkles,
  MapPin,
  Navigation,
  Compass,
  Shield,
  ArrowRight,
  Route,
  Zap,
  RefreshCw,
  Clock,
  DollarSign,
  CloudSun,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const LandingPage: React.FC = () => {
  const { setView } = useAuthStore();

  return (
    <div className="relative w-screen h-screen overflow-y-auto bg-slate-950 text-slate-100 font-sans antialiased select-none custom-scrollbar flex flex-col justify-between">
      {/* Background Ambient Glow Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[140px]" />
      </div>

      {/* Top Floating Header */}
      <header className="relative z-20 max-w-6xl w-full mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-white font-extrabold text-xs shadow-sm tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            <span>Voyager</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('login')}
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => setView('register')}
            className="px-4.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-6 pt-6 pb-20 space-y-24 my-auto">
        
        {/* SECTION 1: HERO */}
        <section className="flex flex-col items-center text-center pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-800/80 text-xs font-semibold text-blue-400 shadow-xs backdrop-blur-xl mb-6 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Plan smarter journeys with AI</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-3xl leading-[1.1] mb-6">
            The map is your <span className="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">homepage</span>.
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-xl leading-relaxed mb-8 font-normal">
            Voyager intelligently adapts your itinerary using live weather, route optimization, and your personal travel preferences.
          </p>

          <div className="flex items-center justify-center gap-3.5">
            <button
              onClick={() => setView('register')}
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Start Planning Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('login')}
              className="px-6 py-3 rounded-full bg-slate-900/80 hover:bg-slate-800/90 active:scale-95 border border-slate-800 text-slate-200 font-bold text-sm backdrop-blur-xl transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </section>

        {/* SECTION 2: HOW VOYAGER WORKS */}
        <section className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">How Voyager Works</h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-md font-normal">Four seamless steps to effortless trip planning</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {/* Step 1 */}
            <div className="relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center text-center gap-3 hover:border-slate-700 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-sm group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-400">Step 1</div>
              <h3 className="text-sm font-extrabold text-white">Create Trip</h3>
              <p className="text-xs text-slate-400 font-normal leading-relaxed">Select your destination and dates in seconds.</p>
            </div>

            {/* Step 2 */}
            <div className="relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center text-center gap-3 hover:border-slate-700 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-sm group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-400">Step 2</div>
              <h3 className="text-sm font-extrabold text-white">AI Generates Route</h3>
              <p className="text-xs text-slate-400 font-normal leading-relaxed">Intelligent sequencing connects every activity.</p>
            </div>

            {/* Step 3 */}
            <div className="relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center text-center gap-3 hover:border-slate-700 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-400">Step 3</div>
              <h3 className="text-sm font-extrabold text-white">Explore On Map</h3>
              <p className="text-xs text-slate-400 font-normal leading-relaxed">Real road polylines show your exact path.</p>
            </div>

            {/* Step 4 */}
            <div className="relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center text-center gap-3 hover:border-slate-700 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm group-hover:scale-110 transition-transform">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-400">Step 4</div>
              <h3 className="text-sm font-extrabold text-white">Refine Instantly</h3>
              <p className="text-xs text-slate-400 font-normal leading-relaxed">Swap stops or adjust budgets on the fly.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: SHOW THE REAL PRODUCT */}
        <section className="flex flex-col items-center text-center space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Real Product Interface</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">Built for Explorers Who Value Clarity</h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-md font-normal">A unified interactive canvas connecting map, route, weather, and AI</p>
          </div>

          {/* Realistic Product Interface Mockup */}
          <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/80 backdrop-blur-2xl p-2.5">
            {/* Browser Top Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 rounded-xl border border-slate-800/60 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-4 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
                app.voyager.com/tokyo-2026
              </div>
              <div className="w-10" />
            </div>

            {/* Interactive Mockup Canvas */}
            <div className="relative h-72 md:h-96 w-full rounded-xl bg-slate-950 overflow-hidden border border-slate-800/60">
              {/* Map grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem]" />

              {/* Weather Pill Mock */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-200 shadow-lg backdrop-blur-md flex items-center gap-2">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                <span>Tokyo • 22°C Partly Cloudy</span>
                <span className="text-slate-500">|</span>
                <span className="text-purple-400 text-[11px]">Outdoor walk retained</span>
              </div>

              {/* Timeline Left Floating Sheet Mock */}
              <div className="absolute top-14 left-4 w-44 rounded-xl bg-slate-900/90 border border-slate-800 p-2.5 shadow-xl hidden sm:block text-left text-[10px]">
                <div className="font-extrabold text-blue-400 mb-1.5 flex items-center gap-1">
                  <Compass className="w-3 h-3" /> Today's Journey
                </div>
                <div className="space-y-1 text-slate-300 font-semibold">
                  <div>• 4 Activities</div>
                  <div>• 12.4 km Distance</div>
                  <div>• $72 Est. Cost</div>
                </div>
              </div>

              {/* Route Polyline Mock */}
              <svg className="absolute inset-0 w-full h-full stroke-blue-500/80" strokeWidth="3.5" strokeDasharray="6 6" fill="none">
                <path d="M 140 220 Q 280 120 440 200 T 640 160" />
              </svg>

              {/* Map Markers Mock */}
              <div className="absolute top-[50%] left-[18%] px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] shadow-lg flex items-center gap-1">
                <span>1</span> <span>Meiji Shrine</span>
              </div>
              <div className="absolute top-[40%] left-[45%] px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] shadow-lg flex items-center gap-1">
                <span>2</span> <span>Ichiran Ramen</span>
              </div>
              <div className="absolute top-[32%] right-[22%] px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-extrabold text-[10px] shadow-lg flex items-center gap-1">
                <span>3</span> <span>Shibuya Parco</span>
              </div>

              {/* Activity Detail Right Panel Mock */}
              <div className="absolute top-14 right-4 w-48 rounded-xl bg-slate-900/90 border border-slate-800 p-3 shadow-xl hidden md:block text-left text-[10px]">
                <div className="font-extrabold text-white text-xs mb-1">Ichiran Ramen</div>
                <p className="text-slate-400 leading-tight mb-2">Customizable solo booth ramen with matcha pudding.</p>
                <div className="w-full py-1 rounded-lg bg-blue-600 text-white font-bold text-center">
                  Navigate in Maps
                </div>
              </div>

              {/* AI Command Bar Bottom Mock */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4/5 max-w-sm px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Replace today's lunch...</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: WHY VOYAGER */}
        <section className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">Why Voyager?</h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-md font-normal">Designed for seamless, intelligent consumer travel</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl text-left space-y-2 hover:border-slate-700 transition-all">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
                🗺️
              </div>
              <h3 className="text-sm font-extrabold text-white">Map-First Planning</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                The map is your homepage. Every stop and route is right in front of you.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl text-left space-y-2 hover:border-slate-700 transition-all">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-sm">
                🤖
              </div>
              <h3 className="text-sm font-extrabold text-white">AI Itinerary Optimization</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Dynamic order adjustments based on proximity and real road distances.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl text-left space-y-2 hover:border-slate-700 transition-all">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">
                🌦️
              </div>
              <h3 className="text-sm font-extrabold text-white">Weather-Aware Routing</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Outdoor walks during clear skies; indoor rainproof swaps when rain arrives.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl text-left space-y-2 hover:border-slate-700 transition-all">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-sm">
                💰
              </div>
              <h3 className="text-sm font-extrabold text-white">Budget Optimization</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Real-time spending trackers and instant cost reduction suggestions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl text-left space-y-2 hover:border-slate-700 transition-all">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-sm">
                📍
              </div>
              <h3 className="text-sm font-extrabold text-white">Interactive Journey Timeline</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Chronological path nodes with bidirectional map cross-highlighting.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl text-left space-y-2 hover:border-slate-700 transition-all">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm">
                🚶
              </div>
              <h3 className="text-sm font-extrabold text-white">Smart Route Directions</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Realistic OSRM walking and driving directions replacing straight lines.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: FINAL CTA */}
        <section className="flex flex-col items-center text-center p-8 md:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Ready for your next journey?
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-md font-normal leading-relaxed">
            Join thousands of travelers planning smarter, weather-aware itineraries today.
          </p>
          <div className="flex items-center justify-center gap-3.5">
            <button
              onClick={() => setView('register')}
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Start Planning Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('login')}
              className="px-6 py-3 rounded-full bg-slate-950 hover:bg-slate-800 active:scale-95 border border-slate-800 text-slate-200 font-bold text-sm backdrop-blur-xl transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-6 py-4 border-t border-slate-900 text-center text-xs text-slate-500">
        © 2026 Voyager. Built with React, Leaflet & Spring Boot.
      </footer>
    </div>
  );
};

export default LandingPage;
