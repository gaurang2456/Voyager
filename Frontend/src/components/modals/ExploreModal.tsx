import React from 'react';
import { X, Compass, Star } from 'lucide-react';

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DESTINATIONS = [
  { name: 'Kyoto, Japan', image: '⛩️', desc: 'Zen gardens, bamboo groves & ancient tea houses', score: '4.9' },
  { name: 'Reykjavik, Iceland', image: '🌋', desc: 'Northern lights, geothermal baths & volcanic glaciers', score: '4.8' },
  { name: 'Amalfi Coast, Italy', image: '🍋', desc: 'Cliffside colorful towns & Mediterranean dining', score: '4.9' },
];

export const ExploreModal: React.FC<ExploreModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 border border-white/40 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-800 dark:text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-extrabold tracking-tight">Explore Destinations</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {DESTINATIONS.map((dest, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 transition-all flex items-start gap-3">
              <span className="text-3xl">{dest.image}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>{dest.score}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{dest.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreModal;
