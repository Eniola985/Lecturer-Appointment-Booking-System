import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle
} from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../data/polyIbadanData';
import { SchoolLogo } from './SchoolLogo';

interface AdminAuthProps {
  onLoginSuccess: () => void;
  onSwitchToStudentLogin: () => void;
  onSwitchToLecturerLogin: () => void;
}

export function AdminAuth({
  onLoginSuccess,
  onSwitchToStudentLogin,
  onSwitchToLecturerLogin
}: AdminAuthProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check strict credentials requested by user: username 'admin', password 'admin123'
    if (
      cleanUsername === ADMIN_CREDENTIALS.username.toLowerCase() &&
      cleanPassword === ADMIN_CREDENTIALS.password
    ) {
      onLoginSuccess();
    } else {
      setError('Invalid administrator username or password. Access is restricted to authorized personnel.');
    }
  };

  return (
    <div className="max-w-xl mx-auto my-6 sm:my-12 px-4">
      {/* Emblem */}
      <div className="text-center mb-8 space-y-3">
        <div className="flex justify-center mb-2">
          <SchoolLogo size="xl" className="shadow-2xl hover:scale-105 transition-transform" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C5638] bg-[#F5EFEB] px-3 py-1 rounded-full border border-[#E2D7CF]">
            The Polytechnic, Ibadan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2211] mt-2 tracking-tight">
            System Administrator Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#784728] max-w-md mx-auto mt-1">
            Directorate of Academic Affairs & Master Appointment Registry.
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#4A2E1B]/5 space-y-6">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="border-b border-[#EFE6DF] pb-3">
            <h2 className="text-lg font-bold text-[#3B2211]">Administrator Sign In</h2>
            <p className="text-xs text-[#784728]">
              Enter administrator username and password to access the academic control console.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#D97706]" />
              Admin Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              autoCapitalize="none"
              autoComplete="username"
              className="w-full px-4 py-3 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B] lowercase"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#D97706]" />
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#4A2E1B]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Log In to Admin Dashboard</span>
            <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
          </button>
        </form>
      </div>

      {/* Cross link if needed */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#784728]">
        <span>Return to other user portals:</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSwitchToStudentLogin}
            className="font-bold text-[#4A2E1B] hover:text-[#D97706] underline cursor-pointer"
          >
            Student Portal &rarr;
          </button>
          <span>&bull;</span>
          <button
            type="button"
            onClick={onSwitchToLecturerLogin}
            className="font-bold text-[#4A2E1B] hover:text-[#D97706] underline cursor-pointer"
          >
            Lecturer Portal &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
