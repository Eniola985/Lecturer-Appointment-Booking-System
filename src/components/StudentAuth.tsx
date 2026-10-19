import React, { useState } from 'react';
import { 
  GraduationCap, 
  Lock, 
  User, 
  Hash, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { Student, StudentLevel } from '../types/booking';
import { POLY_FACULTIES_AND_DEPTS } from '../data/polyIbadanData';
import { SchoolLogo } from './SchoolLogo';

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
  const [loginUsername, setLoginUsername] = useState('Haleelat Adebayo');
  const [loginPassword, setLoginPassword] = useState('2024/ND/CSC/0842');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regMatric, setRegMatric] = useState('');
  const [regConfirmMatric, setRegConfirmMatric] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFaculty, setRegFaculty] = useState(POLY_FACULTIES_AND_DEPTS[0].faculty);
  const [regDept, setRegDept] = useState(POLY_FACULTIES_AND_DEPTS[0].departments[0]);
  const [regLevel, setRegLevel] = useState<StudentLevel>('ND II');
  const [regPhone, setRegPhone] = useState('');
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

    const u = loginUsername.trim().toLowerCase();
    const p = loginPassword.trim().toLowerCase();

    // Match student by Full Name (username) or partial name or matric / email
    const student = students.find(s => {
      const sName = s.fullName.toLowerCase();
      return (
        sName === u ||
        s.matricNumber.toLowerCase() === u ||
        s.email.toLowerCase() === u ||
        sName.includes(u) ||
        u.includes(sName)
      );
    });

    if (!student) {
      setLoginError('No student account found with this username. Please ensure you entered your Full Name or registered Matric Number.');
      return;
    }

    // Login password MUST be their matric number (case-insensitive)
    const expectedMatricPassword = student.matricNumber.toLowerCase();
    const customPassword = student.password ? student.password.toLowerCase() : expectedMatricPassword;

    if (p !== expectedMatricPassword && p !== customPassword) {
      setLoginError('Incorrect password entered. Reminder: Your Matriculation Number is your login password (e.g. 2024/ND/CSC/0842).');
      return;
    }

    onLoginSuccess(student);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regFullName.trim() || !regMatric.trim() || !regConfirmMatric.trim() || !regEmail.trim()) {
      setRegError('Please fill in all mandatory fields.');
      return;
    }

    // Confirm matric number matches
    if (regMatric.trim().toUpperCase() !== regConfirmMatric.trim().toUpperCase()) {
      setRegError('Matriculation numbers do not match. Please re-check both fields.');
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

    const cleanMatric = regMatric.trim().toUpperCase();

    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      matricNumber: cleanMatric,
      fullName: regFullName.trim(),
      email: regEmail.trim().toLowerCase(),
      password: cleanMatric, // Matric number is the password!
      faculty: regFaculty,
      department: regDept,
      level: regLevel,
      phone: regPhone.trim() || '+234 800 000 0000',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    onRegisterSuccess(newStudent);
  };

  const quickFillDemoStudent = (name: string, matric: string) => {
    setLoginUsername(name);
    setLoginPassword(matric);
    setLoginError(null);
  };

  return (
    <div className="max-w-2xl mx-auto my-6 sm:my-10 px-4">
      {/* Institution Emblem & Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="flex justify-center mb-2">
          <SchoolLogo size="xl" className="shadow-2xl hover:scale-105 transition-transform" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C5638] bg-[#F5EFEB] px-3 py-1 rounded-full border border-[#E2D7CF]">
            The Polytechnic, Ibadan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2211] mt-2 tracking-tight">
            Student Advisory & Booking Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#784728] max-w-md mx-auto mt-1">
            Book consultations, track availability, and connect with your course lecturers.
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
            Student Sign In
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
            Create Student Account
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
                Log in with your full name as your username, and your matriculation number as your password.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Instruction Notice Banner */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] flex items-start gap-3 text-xs text-[#4A2E1B]">
              <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#3B2211]">Student Credentials:</span>
                <span className="text-[#784728]">
                  • <strong>Username:</strong> Your full registered name<br />
                  • <strong>Password:</strong> Your official Matriculation Number
                </span>
              </div>
            </div>

            {/* Username (Full Name) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#D97706]" />
                Username (Your Full Name)
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="e.g. Haleelat Adebayo"
                required
                className="w-full px-4 py-3 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B] focus:ring-1 focus:ring-[#4A2E1B]"
              />
            </div>

            {/* Password (Matric Number) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#D97706]" />
                Password (Your Matric Number)
              </label>
              <input
                type="text"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="e.g. 2024/ND/CSC/0842"
                required
                className="w-full px-4 py-3 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B] focus:ring-1 focus:ring-[#4A2E1B] font-mono uppercase"
              />
              <span className="text-[11px] text-[#8C5638] block">
                Enter your exact matriculation number (including slashes).
              </span>
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
                Quick Test Student Accounts (Click to auto-fill):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => quickFillDemoStudent('Haleelat Adebayo', '2024/ND/CSC/0842')}
                  className="p-2.5 rounded-xl border border-[#E2D7CF] bg-[#FAF7F5] hover:bg-[#F5EFEB] text-left transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[#3B2211] block">Haleelat Adebayo</span>
                  <span className="text-[11px] text-[#784728] font-mono">Password: 2024/ND/CSC/0842</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickFillDemoStudent('Babatunde Olumide Alabi', '2023/HND/EEE/0194')}
                  className="p-2.5 rounded-xl border border-[#E2D7CF] bg-[#FAF7F5] hover:bg-[#F5EFEB] text-left transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[#3B2211] block">Babatunde Olumide Alabi</span>
                  <span className="text-[11px] text-[#784728] font-mono">Password: 2023/HND/EEE/0194</span>
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
                Register with your full name as your username. Your matric number will automatically be your login password.
              </p>
            </div>

            {/* Notice banner: Matric number is password */}
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs flex items-start gap-3">
              <Info className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#4A2E1B] text-sm">Notice: Your Matric Number is your Password!</strong>
                <p className="text-xs text-[#784728] mt-1">
                  You do not need to create a separate password. When logging in, your <strong>Username is your Name</strong> and your <strong>Password is your Matriculation Number</strong>. Please confirm your matric number carefully below.
                </p>
              </div>
            </div>

            {regError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{regError}</span>
              </div>
            )}

            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5 h-5">
                  <User className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Student Full Name (Username) *</span>
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Adebayo Haleelat Funmilayo"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B] h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center h-5">
                  Student Email Address *
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. student@polyibadan.edu.ng"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B] h-11"
                />
              </div>
            </div>

            {/* Row 2: Matriculation Number & Confirmation (Your Password) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5 h-5">
                  <Hash className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Matriculation No. (Your Password) *</span>
                </label>
                <input
                  type="text"
                  value={regMatric}
                  onChange={(e) => setRegMatric(e.target.value)}
                  placeholder="e.g. 2024/ND/CSC/0842"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B] font-mono uppercase h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5 h-5">
                  <Hash className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Confirm Matriculation No. *</span>
                </label>
                <input
                  type="text"
                  value={regConfirmMatric}
                  onChange={(e) => setRegConfirmMatric(e.target.value)}
                  placeholder="Re-enter matric number"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B] font-mono uppercase h-11"
                />
              </div>
            </div>

            {/* Row 3: Faculty & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center h-5">
                  Faculty *
                </label>
                <select
                  value={regFaculty}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B] h-11 cursor-pointer"
                >
                  {POLY_FACULTIES_AND_DEPTS.map((f) => (
                    <option key={f.faculty} value={f.faculty}>
                      {f.faculty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center h-5">
                  Department *
                </label>
                <select
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B] h-11 cursor-pointer"
                >
                  {selectedFacultyObj.departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Academic Level & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center h-5">
                  Academic Level *
                </label>
                <select
                  value={regLevel}
                  onChange={(e) => setRegLevel(e.target.value as StudentLevel)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B] h-11 cursor-pointer"
                >
                  <option value="ND I">ND I (National Diploma 1)</option>
                  <option value="ND II">ND II (National Diploma 2)</option>
                  <option value="HND I">HND I (Higher National Diploma 1)</option>
                  <option value="HND II">HND II (Higher National Diploma 2)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center h-5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="e.g. +234 812 345 6789"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B] h-11"
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

      {/* Switch to other portals if not signed in */}
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
