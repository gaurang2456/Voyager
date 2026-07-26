import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  RefreshCw,
  CheckCircle2,
  CloudRain,
  DollarSign,
  Footprints,
  Landmark,
  Sun,
  Camera,
  Utensils,
  Route,
} from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useMyTripsQuery } from '../../hooks/useTrips';
import { useAIRegenerateMutation } from '../../hooks/useAI';

const SUGGESTIONS = [
  { text: "Shorten today's itinerary...", icon: Route, iconColor: 'text-[#C19A6B]' },
  { text: "Replace today's lunch with something local...", icon: Utensils, iconColor: 'text-[#5FAF8D]' },
  { text: "Reduce walking distance...", icon: Footprints, iconColor: 'text-[#D97724]' },
  { text: "Add a coffee stop...", icon: DollarSign, iconColor: 'text-[#5FAF8D]' },
  { text: "Replace this attraction...", icon: Camera, iconColor: 'text-[#8E2A59]' },
  { text: "Remove museums...", icon: Landmark, iconColor: 'text-[#C19A6B]' },
  { text: "Rain expected this afternoon. Rearrange the plan?", icon: CloudRain, iconColor: 'text-[#38BDF8]' },
  { text: "Find the best sunset viewpoint...", icon: Sun, iconColor: 'text-[#D97724]' },
];

export const AICommandBar: React.FC = () => {
  const [input, setInput] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const { activeTripId } = useTravelStore();
  const { token } = useAuthStore();

  const { data: myTrips = [] } = useMyTripsQuery(Boolean(token));
  const activeTrip = myTrips.find((t) => String(t.id) === String(activeTripId));

  const regenerateMutation = useAIRegenerateMutation();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setSuggestionIndex((prev) => (prev + 1) % SUGGESTIONS.length);
        setFade(true);
      }, 5500);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  const currentSuggestion = SUGGESTIONS[suggestionIndex];

  const handleSend = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    setIsProcessing(true);
    setAiFeedback(null);

    const numericTripId = activeTrip ? Number(activeTrip.id) : null;

    if (numericTripId) {
      try {
        const res = await regenerateMutation.mutateAsync({ tripId: numericTripId, prompt: text });
        setAiFeedback(res.modificationSummary || 'AI updated your itinerary with live backend AI recommendations!');
      } catch (e: any) {
        setAiFeedback("I wasn't able to modify the itinerary.");
      }
    } else {
      setAiFeedback('Please create or select a journey first.');
    }

    setIsProcessing(false);
    setInput('');

    setTimeout(() => {
      setAiFeedback(null);
    }, 5000);
  };

  const handlePlaceholderClick = () => {
    setInput(currentSuggestion.text);
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-lg pointer-events-auto flex flex-col items-center gap-1.5">
      {aiFeedback && (
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#4A443D] border border-[#5C5346] text-white text-xs font-semibold shadow-lg backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{aiFeedback}</span>
        </div>
      )}

      {/* Main Luxury Concierge Command Bar */}
      <div className="w-full bg-[#FAF8F3] text-[#2F2A24] backdrop-blur-2xl border border-[#EFE8DD] shadow-xl shadow-amber-950/8 rounded-full px-4 py-2 flex items-center gap-2.5 transition-all hover:shadow-2xl">
        <Sparkles className="w-4 h-4 text-[#8E2A59] fill-[#8E2A59] shrink-0" />
        
        <div className="relative flex-1 flex items-center">
          {!input && (
            <span
              onClick={handlePlaceholderClick}
              className={`absolute left-0 text-xs font-medium text-[#6E665C] pointer-events-auto cursor-pointer transition-all duration-400 transform ${
                fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
              }`}
            >
              {currentSuggestion.text}
            </span>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => {
              if (!input) setInput(currentSuggestion.text);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            className="w-full bg-transparent text-xs font-semibold text-[#2F2A24] placeholder-[#6E665C] focus:outline-none z-10"
          />
        </div>

        <button
          onClick={() => handleSend(input || currentSuggestion.text)}
          disabled={isProcessing || regenerateMutation.isPending}
          aria-label="Send Concierge Command"
          className="flex items-center justify-center w-7 h-7 rounded-full bg-[#C19A6B] hover:bg-[#A88254] text-white shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          {isProcessing || regenerateMutation.isPending ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default AICommandBar;
