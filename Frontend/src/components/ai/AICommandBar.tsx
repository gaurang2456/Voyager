import React, { useState, useEffect } from 'react';
import { Sparkles, Send, RefreshCw, DollarSign, Footprints, Landmark, CheckCircle2 } from 'lucide-react';
import { useTravelStore } from '../../store/useTravelStore';

const PLACEHOLDERS = [
  "Replace today's lunch...",
  "Avoid long walks...",
  "Reduce today's budget...",
  "Find hidden gems nearby...",
  "Add a museum...",
  "Shorten today's itinerary...",
];

const QUICK_PROMPTS = [
  { label: 'Replace this activity', icon: RefreshCw },
  { label: 'Reduce my budget', icon: DollarSign },
  { label: 'Avoid walking', icon: Footprints },
  { label: 'Add a museum', icon: Landmark },
];

export const AICommandBar: React.FC = () => {
  const [input, setInput] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const { executeAiCommand } = useTravelStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setFade(true);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-lg pointer-events-auto flex flex-col items-center gap-1.5">
      {aiFeedback && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-lg backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{aiFeedback}</span>
        </div>
      )}

      {/* Main Search Bar Input with Fading Rotating Placeholder */}
      <div className="w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 shadow-xl rounded-full px-3.5 py-2 flex items-center gap-2.5 transition-all">
        <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
        
        <div className="relative flex-1 flex items-center">
          {!input && (
            <span
              onClick={() => handleSend(PLACEHOLDERS[placeholderIndex])}
              className={`absolute left-0 text-xs font-medium text-slate-400 pointer-events-auto cursor-pointer transition-all duration-300 transform ${
                fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
              }`}
            >
              {PLACEHOLDERS[placeholderIndex]}
            </span>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            className="w-full bg-transparent text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none z-10"
          />
        </div>

        <button
          onClick={() => handleSend(input || PLACEHOLDERS[placeholderIndex])}
          disabled={isProcessing}
          className={`flex items-center justify-center w-6 h-6 rounded-full transition-all cursor-pointer ${
            input.trim()
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs scale-105'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          {isProcessing ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            <Send className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Subtle Quick Action Chips */}
      <div className="flex items-center justify-center flex-wrap gap-1">
        {QUICK_PROMPTS.map((prompt, idx) => {
          const Icon = prompt.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(prompt.label)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/60 hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900 backdrop-blur-md border border-slate-200/50 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 text-[10px] font-medium transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Icon className="w-2.5 h-2.5 text-blue-500 dark:text-blue-400" />
              <span>{prompt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AICommandBar;
