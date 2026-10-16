import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { Lecturer } from '../types/booking';
import { POLY_FACULTIES_AND_DEPTS } from '../data/polyIbadanData';

interface LecturerAuthProps {
  lecturers: Lecturer[];
  onLoginSuccess: (lecturer: Lecturer) => void;
  onRegisterSuccess: (lecturer: Lecturer) => void;
  onSwitchToStudentLogin: () => void;
  onSwitchToAdminLogin: () => void;
}

export function LecturerAuth({
  lecturers,
  onLoginSuccess,
  onRegisterSuccess,
  onSwitchToStudentLogin,
  onSwitchToAdminLogin
}: LecturerAuthProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('Engr. Dr. O. A. Babalola');
  const [loginPassword, setLoginPassword] = useState('babalola2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regTitle, setRegTitle] = useState('Senior Lecturer');
  const [regFaculty, setRegFaculty] = useState(POLY_FACULTIES_AND_DEPTS[0].faculty);
  const [regDept, setRegDept] = useState(POLY_FACULTIES_AND_DEPTS[0].departments[0]);
  const [regStaffId, setRegStaffId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regOffice, setRegOffice] = useState('');
  const [regDays, setRegDays] = useState('Tuesdays & Thursdays (10:00 AM - 1:00 PM)');
  const [regSpecialties, setRegSpecialties] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  const selectedFacultyObj = POLY_FACULTIES_AND_DEPTS.find(f => f.faculty === regFaculty) || POLY_FACULTIES_AND_DEPTS[0];

  const handleFacultyChange = (fName: string) => {
    setRegFaculty(fName);
    const found = POLY_FACULTIES_AND_DEPTS.find(f => f.faculty === fName);
    if (found && found.departments.length > 0) {
      setRegDept(found.departments[0]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const u = loginUsername.trim().toLowerCase();
    const p = loginPassword.trim();

    // Match lecturer by Full Name (username) or email or staffId
    const lecturer = lecturers.find(
      l => l.name.toLowerCase() === u ||
           l.name.toLowerCase().includes(u) ||
           l.email.toLowerCase() === u ||
           l.staffId.toLowerCase() === u
    );

    if (!lecturer) {
      setLoginError('No faculty member found with this Name/Username. Please check spelling or register below.');
      return;
    }

    // Verify lecturer personal password
    if (lecturer.password && lecturer.password !== p) {
      setLoginError('Incorrect password entered. Please enter your personal lecturer password.');
      return;
    }

    onLoginSuccess(lecturer);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Please fill in all mandatory fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    if (regPassword.length < 4) {
      setRegError('Password should be at least 4 characters long.');
      return;
    }

    // Check if email or name exists
    const exists = lecturers.some(
      l => l.email.toLowerCase() === regEmail.trim().toLowerCase() ||
           l.name.toLowerCase() === regName.trim().toLowerCase()
    );
    if (exists) {
      setRegError('A lecturer with this Name or Email already exists. Please log in.');
      return;
    }

    const newLecturer: Lecturer = {
      id: `lec-${Date.now()}`,
      staffId: regStaffId.trim() || `TPI/STF/2026/${Math.floor(100 + Math.random() * 900)}`,
      name: regName.trim(),
      title: regTitle.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword.trim(),
      faculty: regFaculty,
      department: regDept,
      officeLocation: regOffice.trim() || `Departmental Staff Wing, ${regDept}`,
      specialties: regSpecialties ? regSpecialties.split(',').map(s => s.trim()).filter(Boolean) : ['Student Project Guidance', 'Academic Mentorship'],
      phone: regPhone.trim() || '+234 800 000 0000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isAvailable: true,
      consultationDays: regDays.trim()
    };

    onRegisterSuccess(newLecturer);
  };

  const quickFillLecturer = (name: string, pass: string) => {
    setLoginUsername(name);
    setLoginPassword(pass);
    setLoginError(null);
  };

  return (
    <div className="max-w-2xl mx-auto my-6 sm:my-10 px-4">
      {/* Emblem */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#4A2E1B] text-[#FDFBF7] shadow-xl border-2 border-[#D97706]/40 mb-2">
          <Building2 className="w-10 h-10 text-[#F59E0B]" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C5638] bg-[#F5EFEB] px-3 py-1 rounded-full border border-[#E2D7CF]">
            The Polytechnic, Ibadan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2211] mt-2 tracking-tight">
            Lecturer & Faculty Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#784728] max-w-md mx-auto mt-1">
            Review student appointment requests, confirm office availability, and manage consultation schedules.
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
            Lecturer Sign In
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
            Create Faculty Account
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#4A2E1B]/5 space-y-6">
        {activeTab === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="border-b border-[#EFE6DF] pb-3">
              <h2 className="text-lg font-bold text-[#3B2211]">Lecturer Sign In</h2>
              <p className="text-xs text-[#784728]">
                Enter your lecturer name as your username, and your personal password.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Username (Name) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#D97706]" />
                Lecturer Username (Your Name)
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="e.g. Engr. Dr. O. A. Babalola or Mr. Eniola"
                required
                className="w-full px-4 py-3 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#D97706]" />
                Your Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your personal lecturer password"
                required
                className="w-full px-4 py-3 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#4A2E1B]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Access Faculty Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
            </button>

            {/* Quick Demo Preloads */}
            <div className="pt-4 border-t border-[#EFE6DF] space-y-2">
              <span className="text-[11px] font-semibold text-[#8C5638] uppercase tracking-wider block">
                Quick Test Faculty Logins (Click to fill):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => quickFillLecturer('Engr. Dr. O. A. Babalola', 'babalola2026')}
                  className="p-2.5 rounded-xl border border-[#E2D7CF] bg-[#FAF7F5] hover:bg-[#F5EFEB] text-left transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[#3B2211] block">Engr. Dr. O. A. Babalola</span>
                  <span className="text-[11px] text-[#784728] font-mono">Password: babalola2026</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickFillLecturer('Dr. (Mrs.) F. O. Adeleke', 'adeleke2026')}
                  className="p-2.5 rounded-xl border border-[#E2D7CF] bg-[#FAF7F5] hover:bg-[#F5EFEB] text-left transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[#3B2211] block">Dr. (Mrs.) F. O. Adeleke</span>
                  <span className="text-[11px] text-[#784728] font-mono">Password: adeleke2026</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickFillLecturer('Engr. M. B. Sanusi', 'sanusi2026')}
                  className="p-2.5 rounded-xl border border-[#E2D7CF] bg-[#FAF7F5] hover:bg-[#F5EFEB] text-left transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[#3B2211] block">Engr. M. B. Sanusi</span>
                  <span className="text-[11px] text-[#784728] font-mono">Password: sanusi2026</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickFillLecturer('Mrs. B. A. Oladipo', 'oladipo2026')}
                  className="p-2.5 rounded-xl border border-[#E2D7CF] bg-[#FAF7F5] hover:bg-[#F5EFEB] text-left transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[#3B2211] block">Mrs. B. A. Oladipo</span>
                  <span className="text-[11px] text-[#784728] font-mono">Password: oladipo2026</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="border-b border-[#EFE6DF] pb-3">
              <h2 className="text-lg font-bold text-[#3B2211]">Create Faculty Account</h2>
              <p className="text-xs text-[#784728]">
                Register as a lecturer with your name as your username, and set your own password.
              </p>
            </div>

            {regError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{regError}</span>
              </div>
            )}

            {/* Name & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#D97706]" />
                  Full Name (Your Username) *
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Mr. Eniola A. Adeleke"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Academic Title *
                </label>
                <select
                  value={regTitle}
                  onChange={(e) => setRegTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
                >
                  <option value="Chief Lecturer">Chief Lecturer</option>
                  <option value="Principal Lecturer">Principal Lecturer</option>
                  <option value="Senior Lecturer">Senior Lecturer</option>
                  <option value="Lecturer I">Lecturer I</option>
                  <option value="Lecturer II">Lecturer II</option>
                  <option value="Assistant Lecturer">Assistant Lecturer</option>
                </select>
              </div>
            </div>

            {/* Faculty & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
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
            </div>

            {/* Email & Staff ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Staff Email *
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. lecturer@polyibadan.edu.ng"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Staff ID (Optional)
                </label>
                <input
                  type="text"
                  value={regStaffId}
                  onChange={(e) => setRegStaffId(e.target.value)}
                  placeholder="e.g. TPI/STF/2026/044"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B] font-mono"
                />
              </div>
            </div>

            {/* Office Venue & Consultation Days */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                  Office Venue *
                </label>
                <input
                  type="text"
                  value={regOffice}
                  onChange={(e) => setRegOffice(e.target.value)}
                  placeholder="e.g. Room 14, CS Complex, North Campus"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                  Weekly Consultation Days *
                </label>
                <input
                  type="text"
                  value={regDays}
                  onChange={(e) => setRegDays(e.target.value)}
                  placeholder="e.g. Tuesdays & Thursdays (10:00 AM - 1:00 PM)"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>
            </div>

            {/* Password Creation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#D97706]" />
                  Create Password *
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#D97706]" />
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#4A2E1B]/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>Create Account & Enter Portal</span>
              <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" />
            </button>
          </form>
        )}
      </div>

      {/* Switch to other portals if not signed in */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#784728]">
        <span>Are you a student or administrator?</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSwitchToStudentLogin}
            className="font-bold text-[#4A2E1B] hover:text-[#D97706] underline cursor-pointer"
          >
            Student Login &rarr;
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
