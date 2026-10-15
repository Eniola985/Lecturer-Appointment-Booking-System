import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  ShieldAlert,
  KeyRound,
  GraduationCap
} from 'lucide-react';
import { Lecturer } from '../types/booking';
import { LECTURER_DEFAULT_PASSWORD } from '../data/polyIbadanData';

interface LecturerAuthProps {
  lecturers: Lecturer[];
  onLoginSuccess: (lecturer: Lecturer) => void;
  onSwitchToStudentLogin: () => void;
  onSwitchToAdminLogin: () => void;
}

export function LecturerAuth({
  lecturers,
  onLoginSuccess,
  onSwitchToStudentLogin,
  onSwitchToAdminLogin
}: LecturerAuthProps) {
  const [selectedLecturerId, setSelectedLecturerId] = useState(lecturers[0]?.id || '');
  const [password, setPassword] = useState(LECTURER_DEFAULT_PASSWORD);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const lecturer = lecturers.find(l => l.id === selectedLecturerId);
    if (!lecturer) {
      setError('Please select a valid faculty member.');
      return;
    }

    // Single unified lecturer password as requested by user
    if (password.trim() !== LECTURER_DEFAULT_PASSWORD) {
      setError(`Incorrect lecturer password. Default unified password is: ${LECTURER_DEFAULT_PASSWORD}`);
      return;
    }

    onLoginSuccess(lecturer);
  };

  const currentSelected = lecturers.find(l => l.id === selectedLecturerId) || lecturers[0];

  return (
    <div className="max-w-xl mx-auto my-6 sm:my-12 px-4">
      {/* Institution Emblem */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#4A2E1B] text-[#FDFBF7] shadow-xl border-2 border-[#D97706]/40 mb-2">
          <Building2 className="w-10 h-10 text-[#F59E0B]" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C5638] bg-[#F5EFEB] px-3 py-1 rounded-full border border-[#E2D7CF]">
            The Polytechnic, Ibadan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2211] mt-2 tracking-tight">
            Lecturer / Faculty Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#784728] max-w-md mx-auto mt-1">
            Review student appointment requests, confirm office availability, and manage consultation schedules.
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#4A2E1B]/5 space-y-6">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="border-b border-[#EFE6DF] pb-3">
            <h2 className="text-lg font-bold text-[#3B2211]">Lecturer Sign In</h2>
            <p className="text-xs text-[#784728]">
              Select your faculty profile and enter the unified lecturer access password.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Unified password info notice */}
          <div className="p-3.5 rounded-xl bg-[#FAF7F5] border border-[#E2D7CF] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#D97706]" />
              <span className="text-[#4A2E1B] font-semibold">Faculty Unified Password:</span>
            </div>
            <code className="bg-[#4A2E1B] text-[#F59E0B] px-2.5 py-1 rounded-lg font-mono font-bold text-xs">
              {LECTURER_DEFAULT_PASSWORD}
            </code>
          </div>

          {/* Select Lecturer Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
              Select Faculty Member
            </label>
            <select
              value={selectedLecturerId}
              onChange={(e) => setSelectedLecturerId(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B] cursor-pointer"
            >
              {lecturers.map((lec) => (
                <option key={lec.id} value={lec.id}>
                  {lec.name} &mdash; {lec.department} ({lec.officeLocation.split(',')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Lecturer Card Preview */}
          {currentSelected && (
            <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] flex items-center gap-3.5">
              <img
                src={currentSelected.avatar}
                alt={currentSelected.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#D97706]/40"
              />
              <div className="text-xs flex-1 min-w-0">
                <span className="font-bold text-[#3B2211] block truncate">{currentSelected.name}</span>
                <span className="text-[#784728] block truncate">{currentSelected.title} &bull; {currentSelected.department}</span>
                <span className="text-[11px] text-[#8C5638] font-mono block truncate">{currentSelected.officeLocation}</span>
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#D97706]" />
              Lecturer Password
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
            <span>Log In to Faculty Dashboard</span>
            <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
          </button>
        </form>
      </div>

      {/* Cross links */}
      <div className="mt-8 flex items-center justify-center gap-4 text-xs text-[#784728]">
        <button
          type="button"
          onClick={onSwitchToStudentLogin}
          className="font-bold text-[#4A2E1B] hover:text-[#D97706] underline cursor-pointer"
        >
          &larr; Return to Student Portal
        </button>
        <span>&bull;</span>
        <button
          type="button"
          onClick={onSwitchToAdminLogin}
          className="font-bold text-[#4A2E1B] hover:text-[#D97706] underline cursor-pointer"
        >
          Administrator Login &rarr;
        </button>
      </div>
    </div>
  );
}
