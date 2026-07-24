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
    <div className="relative w-screen h-screen overflow-y-auto bg-slate-950 text-slate-100 font-sans antialiased select-none custom-scrollbar flex flex-col justify-between">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[140px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 max-w-6xl w-full mx-auto px-6 py-5 flex items-center justify-between">
        <button
          onClick={() => setView('landing')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-white font-extrabold text-xs shadow-sm tracking-wide cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
          <span>Voyager</span>
        </button>

        <button
          onClick={() => setView('register')}
          className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all cursor-pointer"
        >
          Create Account
        </button>
      </header>

      {/* Login Form Floating Card */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-8 my-auto">
        <div className="bg-slate-900/85 backdrop-blur-2xl border border-slate-800/80 shadow-2xl shadow-slate-950/80 rounded-3xl p-6 md:p-8 animate-fadeIn">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black tracking-tight text-white mb-1">Welcome Back</h2>
            <p className="text-xs text-slate-400 font-medium">Sign in to access your interactive journeys</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="jane@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[10px] text-rose-400 font-semibold mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset placeholder. Please contact support or register a new account.')}
                  className="text-[11px] font-medium text-blue-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[10px] text-rose-400 font-semibold mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-400 font-medium cursor-pointer">
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
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
          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => setView('register')}
              className="font-bold text-blue-400 hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </div>

        </div>
      </main>

      <footer className="relative z-10 max-w-6xl w-full mx-auto px-6 py-4 border-t border-slate-900 text-center text-xs text-slate-500">
        © 2026 Voyager. Connected to Spring Boot Backend API.
      </footer>
    </div>
  );
};

export default LoginPage;
