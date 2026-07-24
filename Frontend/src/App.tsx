import { useEffect, useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { LandingPage } from './components/auth/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { MapView } from './components/map/MapView';
import { TopNavbar } from './components/layout/TopNavbar';
import { WeatherCard } from './components/weather/WeatherCard';
import { FloatingTimeline } from './components/timeline/FloatingTimeline';
import { ActivityDetailPanel } from './components/panel/ActivityDetailPanel';
import { AICommandBar } from './components/ai/AICommandBar';
import { TripsModal } from './components/modals/TripsModal';
import { ExploreModal } from './components/modals/ExploreModal';
import { ProfileModal } from './components/modals/ProfileModal';

export function App() {
  const { currentView, checkAuth } = useAuthStore();
  const [activeModal, setActiveModal] = useState<'trips' | 'explore' | 'profile' | null>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Stage 1: Landing Page
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  // Stage 2: Login Page
  if (currentView === 'login') {
    return <LoginPage />;
  }

  // Stage 2: Register Page
  if (currentView === 'register') {
    return <RegisterPage />;
  }

  // Stage 3: Authenticated Main Map Application
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-900 font-sans antialiased select-none animate-fadeIn">
      {/* 1. Large Interactive Map Canvas */}
      <MapView />

      {/* 2. Minimal Top Floating Navbar */}
      <TopNavbar
        onOpenTrips={() => setActiveModal('trips')}
        onOpenExplore={() => setActiveModal('explore')}
        onOpenProfile={() => setActiveModal('profile')}
      />

      {/* 3. Compact Weather Card Overlay at Top */}
      <WeatherCard />

      {/* 4. Thin Floating Vertical Timeline on Left */}
      <FloatingTimeline />

      {/* 5. Interactive Activity Detail Side Panel */}
      <ActivityDetailPanel />

      {/* 6. Natural AI Interaction Command Bar at Bottom */}
      <AICommandBar />

      {/* 7. Modal Overlays */}
      <TripsModal isOpen={activeModal === 'trips'} onClose={() => setActiveModal(null)} />
      <ExploreModal isOpen={activeModal === 'explore'} onClose={() => setActiveModal(null)} />
      <ProfileModal isOpen={activeModal === 'profile'} onClose={() => setActiveModal(null)} />
    </main>
  );
}

export default App;