import React from 'react';
import { X, User, LogOut, Settings, Bookmark, Sliders } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMyTripsQuery } from '../../hooks/useTrips';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, token, logout } = useAuthStore();
  const { data: myTrips = [] } = useMyTripsQuery(Boolean(token));

  if (!isOpen) return null;

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'US';

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B18]/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#FAF8F3] border border-[#E8E2D5] rounded-3xl shadow-2xl p-6 text-[#2F2A24]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#C19A6B]" />
            <h2 className="font-serif-luxury text-base font-bold tracking-tight text-[#2F2A24]">Account & Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#EFE8DD] text-[#6E665C] hover:text-[#2F2A24] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Avatar & Info */}
        <div className="mt-4 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[#4A443D] flex items-center justify-center text-[#FAF8F3] font-bold text-lg shadow-md border border-[#5C5346]">
            {initials}
          </div>
          <h3 className="font-serif-luxury font-bold text-lg text-[#2F2A24] mt-2.5">{user?.name || 'Voyager Traveler'}</h3>
          <p className="text-xs text-[#6E665C] font-semibold">{user?.email || 'explorer@voyager.app'}</p>

          {/* Stat Cards */}
          <div className="w-full grid grid-cols-2 gap-2.5 mt-4">
            <div className="p-3 rounded-2xl bg-[#F3EFE8] border border-[#E8E2D5]">
              <div className="text-lg font-bold text-[#C19A6B]">{myTrips.length}</div>
              <div className="text-[10px] text-[#A59E93] font-bold uppercase tracking-wider">Saved Trips</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F3EFE8] border border-[#E8E2D5]">
              <div className="text-lg font-bold text-[#5FAF8D]">Pro</div>
              <div className="text-[10px] text-[#A59E93] font-bold uppercase tracking-wider">Membership</div>
            </div>
          </div>
        </div>

        {/* Action List */}
        <div className="mt-5 pt-3 border-t border-[#E8E2D5] flex flex-col gap-1 text-xs font-semibold">
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F3EFE8] text-[#2F2A24] transition-colors cursor-pointer text-left">
            <User className="w-4 h-4 text-[#C19A6B]" />
            <span>Profile Information</span>
          </button>

          <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F3EFE8] text-[#2F2A24] transition-colors cursor-pointer text-left">
            <Settings className="w-4 h-4 text-[#6E665C]" />
            <span>Settings</span>
          </button>

          <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F3EFE8] text-[#A59E93] transition-colors cursor-not-allowed opacity-60 text-left">
            <Sliders className="w-4 h-4" />
            <span>Preferences (Coming Soon)</span>
          </button>

          <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F3EFE8] text-[#A59E93] transition-colors cursor-not-allowed opacity-60 text-left">
            <Bookmark className="w-4 h-4" />
            <span>Saved Trips (Coming Soon)</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer text-left mt-1"
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
