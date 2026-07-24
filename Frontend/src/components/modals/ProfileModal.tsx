import React from 'react';
import { X, User, LogOut, Settings, Bookmark, Sliders, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();

  if (!isOpen) return null;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'US';

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-2xl p-5 text-slate-800 dark:text-slate-100 backdrop-blur-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-extrabold tracking-tight">Account & Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
            {initials}
          </div>
          <h3 className="font-extrabold text-base mt-2">{user?.name || 'Voyager Traveler'}</h3>
          <p className="text-xs text-slate-400 font-medium">{user?.email || 'authenticated@voyager.app'}</p>

          <div className="w-full grid grid-cols-2 gap-2 mt-3.5">
            <div className="p-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="text-base font-black text-blue-600 dark:text-blue-400">12</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Saved Trips</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="text-base font-black text-sky-600 dark:text-sky-400">Pro</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Membership</div>
            </div>
          </div>
        </div>

        {/* Action List */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1 text-xs font-semibold">
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-left">
            <User className="w-4 h-4 text-blue-500" />
            <span>Profile Information</span>
          </button>

          <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-left">
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Settings</span>
          </button>

          <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-400 transition-colors cursor-not-allowed opacity-60 text-left">
            <Sliders className="w-4 h-4" />
            <span>Preferences (Coming Soon)</span>
          </button>

          <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-400 transition-colors cursor-not-allowed opacity-60 text-left">
            <Bookmark className="w-4 h-4" />
            <span>Saved Trips (Coming Soon)</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer text-left mt-1"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileModal;
