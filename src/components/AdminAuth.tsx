import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  Copy, 
  Check 
} from 'lucide-react';
import { ADMIN_CREDENTIALS } from '../data/polyIbadanData';

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
  const [email, setEmail] = useState(ADMIN_CREDENTIALS.email);
  const [password, setPassword] = useState(ADMIN_CREDENTIALS.password);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
      password.trim() === ADMIN_CREDENTIALS.password
    ) {
      onLoginSuccess();
    } else {
      setError(`Invalid credentials. Use official admin email: ${ADMIN_CREDENTIALS.email} and the generated password.`);
    }
  };

  const autoFillCredentials = () => {
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
    setError(null);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(ADMIN_CREDENTIALS.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto my-6 sm:my-12 px-4">
      {/* Emblem */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#4A2E1B] text-[#FDFBF7] shadow-xl border-2 border-[#D97706]/40 mb-2">
          <ShieldCheck className="w-10 h-10 text-[#F59E0B]" />
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
        {/* Prominent Admin Password Badge (As requested by user) */}
        <div className="p-4 rounded-2xl bg-[#F5EFEB] border-2 border-[#D97706]/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A2E1B] uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#D97706]" />
              Official Admin Master Password
            </span>
            <button
              type="button"
              onClick={copyPassword}
              className="text-[11px] text-[#784728] hover:text-[#3B2211] font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#E2D7CF] flex items-center justify-between font-mono text-xs">
            <div>
              <span className="text-[#8C5638] block text-[10px]">PASSWORD:</span>
              <span className="font-bold text-[#4A2E1B] text-sm">{ADMIN_CREDENTIALS.password}</span>
            </div>
            <button
              type="button"
              onClick={autoFillCredentials}
              className="px-3 py-1.5 bg-[#4A2E1B] hover:bg-[#3B2211] text-[#F59E0B] rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
            >
              Auto-Fill
            </button>
          </div>
          <p className="text-[11px] text-[#784728]">
            Email: <strong className="text-[#3B2211]">{ADMIN_CREDENTIALS.email}</strong>
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="border-b border-[#EFE6DF] pb-3">
            <h2 className="text-lg font-bold text-[#3B2211]">Administrator Sign In</h2>
            <p className="text-xs text-[#784728]">
              Authorized administrative personnel only.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#D97706]" />
              Administrator Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#D97706]" />
              Administrator Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

      <div className="mt-8 flex items-center justify-center gap-4 text-xs text-[#784728]">
        <button
          type="button"
          onClick={onSwitchToStudentLogin}
          className="font-bold text-[#4A2E1B] hover:text-[#D97706] underline cursor-pointer"
        >
          &larr; Student Portal
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
  );
}
