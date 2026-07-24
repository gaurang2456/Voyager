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

const SUGGESTIONS = [
  { text: "Shorten today's itinerary...", icon: Route, iconColor: 'text-blue-500' },
  { text: "Replace today's lunch with a local favorite...", icon: Utensils, iconColor: 'text-emerald-500' },
  { text: "Rain expected this afternoon. Rearrange the plan?", icon: CloudRain, iconColor: 'text-sky-500' },
  { text: "Find a hidden photo spot nearby...", icon: Camera, iconColor: 'text-purple-500' },
  { text: "Reduce walking distance today...", icon: Footprints, iconColor: 'text-amber-500' },
  { text: "Save money on today's activities...", icon: DollarSign, iconColor: 'text-emerald-500' },
  { text: "Add one more landmark...", icon: Landmark, iconColor: 'text-blue-500' },
  { text: "Find the best sunset viewpoint...", icon: Sun, iconColor: 'text-amber-500' },
];

export const AICommandBar: React.FC = () => {
  const [input, setInput] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const { executeAiCommand } = useTravelStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setSuggestionIndex((prev) => (prev + 1) % SUGGESTIONS.length);
        setFade(true);
      }, 400);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  const currentSuggestion = SUGGESTIONS[suggestionIndex];
  const SuggestionIcon = currentSuggestion.icon;

  const handleSend = (text: string) => {
    if (!text.trim() || isProcessing) return;
    setIsProcessing(true);
    setAiFeedback(null);

    setTimeout(() => {
      const resultMsg = executeAiCommand(text);
      setAiFeedback(resultMsg);
      setIsProcessing(false);
      setInput('');

      setTimeout(() => {
        setAiFeedback(null);
      }, 4000);
    }, 400);
  };

  const handlePlaceholderClick = () => {
    setInput(currentSuggestion.text);
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-lg pointer-events-auto flex flex-col items-center gap-1.5">
      {aiFeedback && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-lg backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{aiFeedback}</span>
        </div>
      )}

      {/* Main Search Bar Input with Dynamic Context Icon & Color */}
      <div className="w-full bg-slate-900 dark:bg-slate-900 text-white backdrop-blur-2xl border border-slate-800 shadow-2xl rounded-full px-3.5 py-2 flex items-center gap-2.5 transition-all">
        {input ? (
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
        ) : (
          <SuggestionIcon className={`w-4 h-4 shrink-0 transition-all duration-300 ${currentSuggestion.iconColor}`} />
        )}
        
        <div className="relative flex-1 flex items-center">
          {!input && (
            <span
              onClick={handlePlaceholderClick}
              className={`absolute left-0 text-xs font-medium text-slate-400 pointer-events-auto cursor-pointer transition-all duration-400 transform ${
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
            className="w-full bg-transparent text-xs font-medium text-white placeholder-slate-400 focus:outline-none z-10"
          />
        </div>

        <button
          onClick={() => handleSend(input || currentSuggestion.text)}
          disabled={isProcessing}
          aria-label="Send AI Command"
          className={`flex items-center justify-center w-6.5 h-6.5 rounded-full transition-all cursor-pointer ${
            input.trim()
              ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500 scale-105'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          {isProcessing ? (
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
