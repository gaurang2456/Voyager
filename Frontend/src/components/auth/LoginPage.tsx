import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const LoginPage: React.FC = () => {
  const { login, setView, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required';
    if (!password) errs.password = 'Password is required';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    await login({ email, password });
  };

  return (
    <div className="relative w-screen h-screen overflow-y-auto bg-[#1E1B18] text-[#FAF8F3] font-sans antialiased select-none custom-scrollbar flex flex-col justify-between">
      
      {/* Cinematic Destination Background Image */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1920&q=85"
          alt="Santorini Coast"
          className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.05] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E1B18]/60 via-[#1E1B18]/40 to-[#1E1B18]/90" />
      </div>

      {/* Top Luxury Header */}
      <header className="relative z-20 max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={() => setView('landing')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2F2A24]/60 backdrop-blur-md border border-[#E8E2D5]/20 text-[#FAF8F3] shadow-lg cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#C19A6B] fill-[#C19A6B]" />
          <span className="font-serif-luxury font-bold text-sm tracking-wider">Voyager</span>
        </button>

        <button
          onClick={() => setView('register')}
          className="px-5 py-2 rounded-full text-xs font-semibold text-[#FAF8F3]/90 hover:text-white hover:bg-white/10 transition-all cursor-pointer backdrop-blur-sm"
        >
          Create Account
        </button>
      </header>

      {/* Login Form Luxury Card */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-8 my-auto">
        <div className="bg-[#FAF8F3] text-[#2F2A24] border border-[#E8E2D5] shadow-2xl rounded-3xl p-6 md:p-8 animate-fadeIn">
          
          <div className="text-center mb-6">
            <h2 className="font-serif-luxury text-2xl md:text-3xl font-bold tracking-tight text-[#2F2A24] mb-1">
              Welcome Back
            </h2>
            <p className="text-xs text-[#6E665C] font-medium">
              Sign in to access your interactive travel journeys
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold text-[#6E665C] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E665C]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="jane@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#EFE8DD] text-xs font-semibold text-[#2F2A24] placeholder-[#A59E93] focus:outline-none focus:border-[#C19A6B] transition-colors"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[10px] text-rose-600 font-semibold mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-[#6E665C] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link has been dispatched to your email address.')}
                  className="text-[11px] font-semibold text-[#C19A6B] hover:text-[#A88254] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E665C]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-[#EFE8DD] text-xs font-semibold text-[#2F2A24] placeholder-[#A59E93] focus:outline-none focus:border-[#C19A6B] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E665C] hover:text-[#2F2A24] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[10px] text-rose-600 font-semibold mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#E8E2D5] text-[#C19A6B] focus:ring-0 cursor-pointer accent-[#C19A6B]"
              />
              <label htmlFor="remember" className="text-xs text-[#6E665C] font-semibold cursor-pointer">
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-[#C19A6B] hover:bg-[#A88254] active:scale-98 text-white font-bold text-xs shadow-lg shadow-amber-950/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-[#6E665C] font-medium">
            Don't have an account?{' '}
            <button
              onClick={() => setView('register')}
              className="font-bold text-[#C19A6B] hover:text-[#A88254] hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </div>

        </div>
      </main>

      <footer className="relative z-10 max-w-6xl w-full mx-auto px-6 py-4 border-t border-white/10 text-center text-xs text-[#FAF8F3]/60">
        © 2026 Voyager. Connected to Spring Boot Backend API.
      </footer>
    </div>
  );
};

export default LoginPage;
