import React, { useState } from 'react';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  Hash, 
  BookOpen, 
  Phone, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Building2,
  Sparkles
} from 'lucide-react';
import { Student, StudentLevel } from '../types/booking';
import { POLY_FACULTIES_AND_DEPTS } from '../data/polyIbadanData';

interface StudentAuthProps {
  students: Student[];
  onLoginSuccess: (student: Student) => void;
  onRegisterSuccess: (newStudent: Student) => void;
  onSwitchToLecturerLogin: () => void;
  onSwitchToAdminLogin: () => void;
}

export function StudentAuth({
  students,
  onLoginSuccess,
  onRegisterSuccess,
  onSwitchToLecturerLogin,
  onSwitchToAdminLogin
}: StudentAuthProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('2024/ND/CSC/0842');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMatric, setRegMatric] = useState('');
  const [regFaculty, setRegFaculty] = useState(POLY_FACULTIES_AND_DEPTS[0].faculty);
  const [regDept, setRegDept] = useState(POLY_FACULTIES_AND_DEPTS[0].departments[0]);
  const [regLevel, setRegLevel] = useState<StudentLevel>('ND II');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  const selectedFacultyObj = POLY_FACULTIES_AND_DEPTS.find(f => f.faculty === regFaculty) || POLY_FACULTIES_AND_DEPTS[0];

  const handleFacultyChange = (facultyName: string) => {
    setRegFaculty(facultyName);
    const found = POLY_FACULTIES_AND_DEPTS.find(f => f.faculty === facultyName);
    if (found && found.departments.length > 0) {
      setRegDept(found.departments[0]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const q = loginIdentifier.trim().toLowerCase();
    const student = students.find(
      s => s.matricNumber.toLowerCase() === q || s.email.toLowerCase() === q
    );

    if (!student) {
      setLoginError('No student account found with this Matric Number or Email.');
      return;
    }

    if (student.password && student.password !== loginPassword.trim()) {
      setLoginError('Incorrect password entered. Please check and try again.');
      return;
    }

    onLoginSuccess(student);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regFullName.trim() || !regEmail.trim() || !regMatric.trim() || !regPassword.trim()) {
      setRegError('Please fill in all mandatory fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter.');
      return;
    }

    // Check if matric or email exists
    const exists = students.some(
      s => s.matricNumber.toLowerCase() === regMatric.trim().toLowerCase() ||
           s.email.toLowerCase() === regEmail.trim().toLowerCase()
    );
    if (exists) {
      setRegError('A student with this Matric Number or Email is already registered. Please log in.');
      return;
    }

    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      matricNumber: regMatric.trim().toUpperCase(),
      fullName: regFullName.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword.trim(),
      faculty: regFaculty,
      department: regDept,
      level: regLevel,
      phone: regPhone.trim() || '+234 800 000 0000',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    onRegisterSuccess(newStudent);
  };

  const quickFillDemoStudent = (matric: string) => {
    const s = students.find(st => st.matricNumber === matric);
    if (s) {
      setLoginIdentifier(s.matricNumber);
      setLoginPassword(s.password || 'password123');
      setLoginError(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 sm:my-10 px-4">
      {/* Institution Emblem & Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#4A2E1B] text-[#FDFBF7] shadow-xl border-2 border-[#D97706]/40 mb-2">
          <GraduationCap className="w-10 h-10 text-[#F59E0B]" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C5638] bg-[#F5EFEB] px-3 py-1 rounded-full border border-[#E2D7CF]">
            The Polytechnic, Ibadan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2211] mt-2 tracking-tight">
            Student Advisory & Booking Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#784728] max-w-md mx-auto mt-1">
            Book consultations, track availability, and connect with your course lecturers and project supervisors.
          </p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex p-1 bg-[#F5EFEB] border border-[#E2D7CF] rounded-2xl shadow-inner mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#4A2E1B] text-white shadow-md'
                : 'text-[#784728] hover:text-[#3B2211]'
            }`}
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-[#4A2E1B] text-white shadow-md'
                : 'text-[#784728] hover:text-[#3B2211]'
            }`}
          >
            Create New Account (Register)
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#4A2E1B]/5 space-y-6">
        {activeTab === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="border-b border-[#EFE6DF] pb-3">
              <h2 className="text-lg font-bold text-[#3B2211]">Student Sign In</h2>
              <p className="text-xs text-[#784728]">
                Enter your registered Polytechnic of Ibadan matric number or student email.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#D97706]" />
                Matric Number or Email
              </label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. 2024/ND/CSC/0842 or student@email.com"
                required
                className="w-full px-4 py-3 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B] focus:ring-1 focus:ring-[#4A2E1B]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#D97706]" />
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your student password"
                required
                className="w-full px-4 py-3 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B] focus:ring-1 focus:ring-[#4A2E1B]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#4A2E1B]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Access Student Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
            </button>

            {/* Quick Demo Preload */}
            <div className="pt-4 border-t border-[#EFE6DF] space-y-2">
              <span className="text-[11px] font-semibold text-[#8C5638] uppercase tracking-wider block">
                Quick Test Accounts (Click to auto-fill):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => quickFillDemoStudent('2024/ND/CSC/0842')}
                  className="p-2.5 rounded-xl border border-[#E2D7CF] bg-[#FAF7F5] hover:bg-[#F5EFEB] text-left transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[#3B2211] block">Haleelat Adebayo</span>
                  <span className="text-[11px] text-[#784728] font-mono">2024/ND/CSC/0842 (Comp Sci ND II)</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickFillDemoStudent('2023/HND/EEE/0194')}
                  className="p-2.5 rounded-xl border border-[#E2D7CF] bg-[#FAF7F5] hover:bg-[#F5EFEB] text-left transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[#3B2211] block">Babatunde Alabi</span>
                  <span className="text-[11px] text-[#784728] font-mono">2023/HND/EEE/0194 (Elect Engr HND II)</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="border-b border-[#EFE6DF] pb-3">
              <h2 className="text-lg font-bold text-[#3B2211]">New Student Registration</h2>
              <p className="text-xs text-[#784728]">
                Provide your official PolyIbadan academic details to create your student account.
              </p>
            </div>

            {regError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{regError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Full Name (Surname First) *
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Adebayo Haleelat Funmilayo"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Matriculation Number *
                </label>
                <input
                  type="text"
                  value={regMatric}
                  onChange={(e) => setRegMatric(e.target.value)}
                  placeholder="e.g. 2024/ND/CSC/0842"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B] font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Student Email Address *
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. student@polyibadan.edu.ng"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="e.g. +234 812 345 6789"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Faculty *
                </label>
                <select
                  value={regFaculty}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
                >
                  {POLY_FACULTIES_AND_DEPTS.map((f) => (
                    <option key={f.faculty} value={f.faculty}>
                      {f.faculty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Academic Level *
                </label>
                <select
                  value={regLevel}
                  onChange={(e) => setRegLevel(e.target.value as StudentLevel)}
                  className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
                >
                  <option value="ND I">ND I (National Diploma 1)</option>
                  <option value="ND II">ND II (National Diploma 2)</option>
                  <option value="HND I">HND I (Higher National Diploma 1)</option>
                  <option value="HND II">HND II (Higher National Diploma 2)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                Department *
              </label>
              <select
                value={regDept}
                onChange={(e) => setRegDept(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
              >
                {selectedFacultyObj.departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Create Password *
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#4A2E1B]/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>Complete Registration & Sign In</span>
              <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" />
            </button>
          </form>
        )}
      </div>

      {/* Portal Cross Links */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#784728]">
        <span>Are you a faculty member or administrator?</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSwitchToLecturerLogin}
            className="font-bold text-[#4A2E1B] hover:text-[#D97706] underline cursor-pointer"
          >
            Lecturer Login &rarr;
          </button>
          <span>&bull;</span>
          <button
            type="button"
            onClick={onSwitchToAdminLogin}
            className="font-bold text-[#4A2E1B] hover:text-[#D97706] underline cursor-pointer"
          >
            Admin Login &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
