import React, { useState } from 'react';
import { Sparkles, Eye, EyeOff, Lock, Mail, User, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

function getPasswordStrength(password: string): { label: string; percent: number; color: string } {
  if (!password) return { label: '', percent: 0, color: 'bg-slate-700' };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { label: 'Weak', percent: 33, color: 'bg-rose-500' };
  if (score <= 4) return { label: 'Medium', percent: 66, color: 'bg-amber-500' };
  return { label: 'Strong', percent: 100, color: 'bg-emerald-500' };
}

export const RegisterPage: React.FC = () => {
  const { register, setView, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const strength = getPasswordStrength(password);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    await register({ name, email, password });
  };

  return (
    <div className="relative w-screen h-screen overflow-y-auto bg-slate-950 text-slate-100 font-sans antialiased select-none custom-scrollbar flex flex-col justify-between">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 max-w-6xl w-full mx-auto px-6 py-5 flex items-center justify-between">
        <button
          onClick={() => setView('landing')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-white font-extrabold text-xs shadow-sm tracking-wide cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
          <span>Voyager</span>
        </button>

        <button
          onClick={() => setView('login')}
          className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all cursor-pointer"
        >
          Sign In
        </button>
      </header>

      {/* Register Form Floating Card */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-8 my-auto">
        <div className="bg-slate-900/85 backdrop-blur-2xl border border-slate-800/80 shadow-2xl shadow-slate-950/80 rounded-3xl p-6 md:p-8 animate-fadeIn">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black tracking-tight text-white mb-1">Create an Account</h2>
            <p className="text-xs text-slate-400 font-medium">Join Voyager to plan and save your AI journeys</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              {fieldErrors.name && (
                <p className="text-[10px] text-rose-400 font-semibold mt-1">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email */}
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
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
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

              {/* Password Strength Indicator Bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>Password Strength:</span>
                    <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                </div>
              )}

              {fieldErrors.password && (
                <p className="text-[10px] text-rose-400 font-semibold mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-[10px] text-rose-400 font-semibold mt-1">{fieldErrors.confirmPassword}</p>
              )}
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
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => setView('login')}
              className="font-bold text-blue-400 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>

        </div>
      </main>

      <footer className="relative z-10 max-w-6xl w-full mx-auto px-6 py-4 border-t border-slate-900 text-center text-xs text-slate-500">
        © 2026 Voyager. Secure Spring Boot JWT Authentication.
      </footer>
    </div>
  );
};

export default RegisterPage;
