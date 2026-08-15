import { useEffect, useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { useTravelStore } from './store/useTravelStore';

import { LandingPage } from './components/auth/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

import { SidebarNav } from './components/layout/SidebarNav';
import { TopNavbar } from './components/layout/TopNavbar';
import { CreateTripModal } from './components/modals/CreateTripModal';
import { ProfileModal } from './components/modals/ProfileModal';

import { DashboardView } from './components/views/DashboardView';
import { MyTripsView } from './components/views/MyTripsView';
import { ExploreView } from './components/views/ExploreView';
import { SavedView } from './components/views/SavedView';
import { SettingsView } from './components/views/SettingsView';
import { DestinationDetailView } from './components/views/DestinationDetailView';
import { MemoriesView } from './components/views/MemoriesView';
import { AlbumDetailView } from './components/views/AlbumDetailView';
import type { MemoryAlbum } from './types/memories';

import { MapView } from './components/map/MapView';
import { WeatherCard } from './components/weather/WeatherCard';
import { FloatingTimeline } from './components/timeline/FloatingTimeline';
import { ActivityDetailPanel } from './components/panel/ActivityDetailPanel';
import { AICommandBar } from './components/ai/AICommandBar';

import { useLiveTravelData } from './hooks/useLiveTravelData';

export function App() {
  const { currentView, checkAuth } = useAuthStore();
  const { setActiveTrip, selectedDestinationName, setSelectedDestination } = useTravelStore();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [presetDestination, setPresetDestination] = useState<string>('');
  const [selectedAlbum, setSelectedAlbum] = useState<MemoryAlbum | null>(null);

  const handleSelectAlbum = (album: MemoryAlbum) => {
    setSelectedAlbum(album);
    setActiveTab('album-detail');
  };

  // Synchronize active travel data with Spring Boot backend
  useLiveTravelData();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Stage 1: Landing Page
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  // Stage 2: Auth Pages
  if (currentView === 'login') {
    return <LoginPage />;
  }

  if (currentView === 'register') {
    return <RegisterPage />;
  }

  // Helper to view a specific trip itinerary
  const handleSelectTrip = (tripId: string) => {
    setActiveTrip(tripId);
    setActiveTab('trip-detail');
  };

  const handleOpenCreateTripPreset = (preset?: string) => {
    if (preset) {
      setPresetDestination(preset);
    }
    setIsCreateTripModalOpen(true);
  };

  const handleSelectDestinationFromNavbar = (destinationName: string) => {
    setSelectedDestination(destinationName);
    setActiveTab('destination-detail');
  };

  // Stage 3: Authenticated Main Application with Sun-Drenched Design System
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#fdf9f3] text-[#1c1c18] font-sans antialiased select-none flex">
      {/* 1. Fixed Left Sidebar Navigation */}
      <SidebarNav
        currentTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenCreateTrip={() => handleOpenCreateTripPreset()}
      />

      {/* 2. Main Content Area */}
      <div className="pl-72 w-full h-full flex flex-col overflow-hidden">
        {/* Fixed Top Header */}
        {activeTab !== 'trip-detail' && (
          <TopNavbar
            onOpenCreateTrip={() => handleOpenCreateTripPreset()}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onSelectDestination={handleSelectDestinationFromNavbar}
          />
        )}

        {/* Dynamic Tab Body */}
        <main
          className={`w-full h-full ${
            activeTab !== 'trip-detail' ? 'pt-20 overflow-y-auto custom-scrollbar' : 'relative overflow-hidden'
          }`}
        >
          {activeTab === 'dashboard' && (
            <DashboardView
              onSelectTrip={handleSelectTrip}
              onViewAllTrips={() => setActiveTab('my-trips')}
              onOpenCreateTrip={handleOpenCreateTripPreset}
              onViewMemories={() => setActiveTab('memories')}
            />
          )}

          {activeTab === 'my-trips' && (
            <MyTripsView
              onSelectTrip={handleSelectTrip}
              onOpenCreateTrip={() => handleOpenCreateTripPreset()}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreView
              onOpenCreateTrip={handleOpenCreateTripPreset}
              onSelectDestination={handleSelectDestinationFromNavbar}
            />
          )}

          {activeTab === 'memories' && (
            <MemoriesView
              onSelectAlbum={handleSelectAlbum}
            />
          )}

          {activeTab === 'album-detail' && selectedAlbum && (
            <AlbumDetailView
              album={selectedAlbum}
              onBack={() => setActiveTab('memories')}
            />
          )}

          {activeTab === 'saved' && (
            <SavedView
              onOpenCreateTrip={handleOpenCreateTripPreset}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}

          {activeTab === 'destination-detail' && (
            <DestinationDetailView
              destinationName={selectedDestinationName || 'Paris'}
              onOpenCreateTrip={handleOpenCreateTripPreset}
              onBack={() => setActiveTab('explore')}
            />
          )}

          {activeTab === 'trip-detail' && (
            <div className="relative w-full h-full overflow-hidden animate-fadeIn">
              {/* Back to Dashboard bar overlay */}
              <div className="absolute top-4 left-4 z-50">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="bg-white/90 backdrop-blur-md border border-[#E8E2D5] px-4 py-2 rounded-full font-body-semibold text-xs text-[#2B241E] shadow-md hover:bg-[#f7f3ed] flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  Dashboard
                </button>
              </div>

              {/* Interactive Map Canvas */}
              <MapView />

              {/* Weather & Day Header Overlay */}
              <WeatherCard />

              {/* Vertical Route Timeline */}
              <FloatingTimeline onOpenCreateTrip={() => handleOpenCreateTripPreset()} />

              {/* Activity Side Detail Panel */}
              <ActivityDetailPanel />

              {/* AI Command Bar */}
              <AICommandBar />
            </div>
          )}
        </main>
      </div>

      {/* Modal Overlays */}
      <CreateTripModal
        isOpen={isCreateTripModalOpen}
        onClose={() => setIsCreateTripModalOpen(false)}
        onTripCreated={(id) => handleSelectTrip(String(id))}
        initialDestination={presetDestination}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

export default App;