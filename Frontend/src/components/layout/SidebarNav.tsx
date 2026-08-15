import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

interface SidebarNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenCreateTrip: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  onTabChange,
  onOpenCreateTrip,
}) => {
  const { user, logout } = useAuthStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'my-trips', label: 'My Trips', icon: 'map' },
    { id: 'explore', label: 'Explore', icon: 'explore' },
    { id: 'memories', label: 'Memories', icon: 'photo_library' },
    { id: 'saved', label: 'Saved', icon: 'bookmark' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#F1EDE7] z-50 flex flex-col shadow-[1px_0_12px_rgba(27,48,34,0.06)] border-r border-[#8FA88E]/20">
      {/* Brand Header */}
      <div className="p-6 mb-4 flex items-center justify-between">
        <div
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#1B3022] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px]">explore</span>
          </div>
          <div>
            <h1 className="font-display-lg text-[24px] leading-none text-[#242924]">Voyager</h1>
            <span className="font-label-caps text-[9px] text-[#737973] uppercase tracking-widest">AI TRAVEL CONCIERGE</span>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="px-4 mb-4">
        <button
          onClick={onOpenCreateTrip}
          className="w-full bg-[#1B3022] text-white py-3 px-6 rounded-full font-body-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#2c4634] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
          Plan New Journey
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all text-left group ${
                isActive
                  ? 'bg-[#cfeacd] text-[#1B3022] font-body-semibold shadow-xs'
                  : 'text-[#434843] hover:bg-[#ebe8e2] hover:text-[#1c1c18]'
              }`}
            >
              <span className={`material-symbols-outlined mr-3 text-[20px] transition-transform ${
                isActive ? 'scale-110 text-[#1B3022]' : 'group-hover:scale-110 text-[#737973]'
              }`}>
                {item.icon}
              </span>
              <span className="font-body-base text-sm">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1B3022]"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="mt-auto p-4 border-t border-[#8FA88E]/20">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#ebe8e2] transition-colors">
          <div
            onClick={() => onTabChange('settings')}
            className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
          >
            <div className="w-10 h-10 rounded-full bg-[#1B3022] flex items-center justify-center shrink-0 text-white shadow-sm font-body-semibold">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'ER'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-body-semibold text-sm text-[#242924] truncate">
                {user?.name || 'Elena Rossi'}
              </span>
              <span className="font-label-caps text-[9px] text-[#737973] uppercase">
                Explorer Level
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-2 text-[#737973] hover:text-[#ba1a1a] hover:bg-white rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;
