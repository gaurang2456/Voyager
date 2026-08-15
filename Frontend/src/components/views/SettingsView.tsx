import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export const SettingsView: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col w-full px-6 md:px-8 pb-16 space-y-8 mt-6 max-w-3xl animate-fadeIn">
      <div>
        <span className="font-label-caps text-[#1B3022] text-[10px]">Preferences & Account</span>
        <h1 className="font-headline-lg text-3xl md:text-4xl text-[#2B241E]">Settings</h1>
        <p className="font-body-base text-sm text-[#685D52] mt-1">
          Manage your personal Voyager profile, AI preferences, and travel settings.
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(43,36,30,0.05)] border border-[#E8E2D5]/60 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#E8E2D5]/60">
          <div className="w-16 h-16 rounded-full bg-[#1B3022] text-white flex items-center justify-center font-headline-lg text-2xl shadow-md">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : 'ER'}
          </div>
          <div>
            <h3 className="font-title-lg text-xl text-[#2B241E]">{user?.name || 'Elena Rossi'}</h3>
            <p className="font-body-base text-xs text-[#685D52]">{user?.email || 'elena.rossi@voyager.travel'}</p>
            <span className="inline-block mt-1 font-label-caps text-[9px] bg-[#cfeacd] text-[#1B3022] px-2.5 py-0.5 rounded-full font-body-semibold">
              Explorer Premier Member
            </span>
          </div>
        </div>

        {/* Preferences Form */}
        <div className="space-y-4">
          <h4 className="font-body-semibold text-sm text-[#2B241E]">AI Travel Preferences</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-body-semibold text-[#574239] mb-1">
                Default Currency
              </label>
              <select className="w-full bg-[#fdf9f3] border border-[#E8E2D5] rounded-xl py-2 px-3 text-xs font-body-base">
                <option value="USD">USD ($) United States Dollar</option>
                <option value="EUR">EUR (€) Euro</option>
                <option value="GBP">GBP (£) British Pound</option>
                <option value="JPY">JPY (¥) Japanese Yen</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-body-semibold text-[#574239] mb-1">
                Travel Style Pace
              </label>
              <select className="w-full bg-[#fdf9f3] border border-[#E8E2D5] rounded-xl py-2 px-3 text-xs font-body-base">
                <option value="balanced">Balanced (2-3 curated activities/day)</option>
                <option value="relaxed">Relaxed & Leisure (1-2 activities/day)</option>
                <option value="packed">Immersive (4+ activities/day)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="pt-4 border-t border-[#E8E2D5]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-body-semibold text-[#2B241E]">
              Spring Boot API Connected (http://localhost:8080)
            </span>
          </div>

          <button
            onClick={logout}
            className="bg-[#ba1a1a]/10 hover:bg-[#ba1a1a] text-[#ba1a1a] hover:text-white px-4 py-2 rounded-xl font-body-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
