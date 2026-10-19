import React from 'react';
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Bell, 
  BookOpen, 
  Users, 
  Sparkles, 
  Lock, 
  KeyRound,
  MapPin,
  Tag,
  HelpCircle
} from 'lucide-react';
import { SystemAnnouncement } from '../types/booking';
import { SchoolLogo } from './SchoolLogo';

interface LandingPageProps {
  onNavigate: (view: 'student-auth' | 'lecturer-auth' | 'admin-auth' | 'student-dashboard' | 'lecturer-dashboard' | 'admin-dashboard') => void;
  announcements: SystemAnnouncement[];
  stats: {
    totalLecturers: number;
    totalStudents: number;
    totalAppointments: number;
  };
  isStudentLoggedIn: boolean;
  isLecturerLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  studentName?: string;
  lecturerName?: string;
}

export function LandingPage({
  onNavigate,
  announcements,
  stats,
  isStudentLoggedIn,
  isLecturerLoggedIn,
  isAdminLoggedIn,
  studentName,
  lecturerName
}: LandingPageProps) {
  return (
    <div className="space-y-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-white border-2 border-[#E2D7CF] p-6 sm:p-12 shadow-xl shadow-[#4A2E1B]/5">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-[#F5EFEB] to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <SchoolLogo size="xl" className="shadow-2xl hover:scale-105 transition-transform duration-300 ring-4 ring-[#D97706]/20" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F5] border border-[#E2D7CF] text-[#8C5638] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
              <span>The Polytechnic, Ibadan &bull; Official Advisory Portal</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#3B2211] tracking-tight leading-tight sm:leading-none">
            Lecturer Appointment & <br />
            <span className="text-[#D97706]">Student Availability System</span>
          </h1>

          <p className="text-sm sm:text-base text-[#784728] max-w-2xl mx-auto leading-relaxed">
            A seamless academic portal connecting National Diploma (ND) and Higher National Diploma (HND) students with course lecturers, project supervisors, and departmental advisors across North & South Campuses.
          </p>

          {/* Quick Notice ticker */}
          {announcements.length > 0 && (
            <div className="inline-flex items-center gap-2 p-2 px-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] text-xs text-[#4A2E1B] max-w-xl text-left">
              <Tag className="w-4 h-4 text-[#D97706] shrink-0" />
              <span className="truncate">
                <strong>Notice:</strong> {announcements[0].title}
              </span>
            </div>
          )}
        </div>

        {/* 3 PORTAL GATEWAY CARDS */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Card 1: Student Portal */}
          <div className="rounded-3xl border-2 border-[#E2D7CF] bg-[#FAF7F5] p-6 sm:p-8 flex flex-col justify-between hover:border-[#D97706] hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#4A2E1B] text-[#F59E0B] flex items-center justify-center font-bold text-xl shadow-lg border border-[#D97706]/30">
                <GraduationCap className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D97706] block">
                  Students (ND & HND)
                </span>
                <h3 className="text-xl font-black text-[#3B2211] mt-0.5">
                  Student Portal
                </h3>
              </div>

              <p className="text-xs text-[#784728] leading-relaxed">
                Register with your matric number, search departmental lecturers, state the reason and propose your available time, track request approvals, and receive instant notifications.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-[#E2D7CF] text-xs text-[#4A2E1B]">
                <div className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Select lecturers by department</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Propose date & available times</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Live acceptance or rejection alerts</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E2D7CF] space-y-2">
              {isStudentLoggedIn ? (
                <button
                  type="button"
                  onClick={() => onNavigate('student-dashboard')}
                  className="w-full py-3 px-4 bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Go to My Student Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </button>
              ) : isLecturerLoggedIn || isAdminLoggedIn ? (
                <div className="p-3 rounded-xl bg-slate-100 text-slate-500 text-xs text-center font-medium border border-slate-200">
                  Access restricted to students. Sign out to switch roles.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('student-auth')}
                    className="w-full py-3 px-4 bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Student Login</span>
                    <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('student-auth')}
                    className="w-full py-2.5 px-4 bg-white border border-[#D1C2B6] hover:bg-[#EFE6DF] text-[#4A2E1B] font-bold text-xs rounded-xl cursor-pointer text-center"
                  >
                    Register New Student
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Lecturer Portal */}
          <div className="rounded-3xl border-2 border-[#E2D7CF] bg-[#FAF7F5] p-6 sm:p-8 flex flex-col justify-between hover:border-[#D97706] hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#4A2E1B] text-[#F59E0B] flex items-center justify-center font-bold text-xl shadow-lg border border-[#D97706]/30">
                <Building2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D97706] block">
                  Academic Faculty
                </span>
                <h3 className="text-xl font-black text-[#3B2211] mt-0.5">
                  Lecturer Portal
                </h3>
              </div>

              <p className="text-xs text-[#784728] leading-relaxed">
                Review incoming appointment requests from students showing their availability, accept or decline with notes, configure office hours, and track confirmed consultations.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-[#E2D7CF] text-xs text-[#4A2E1B]">
                <div className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Review student proposed times</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Accept or reject with reason</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Personal credentials for each faculty member</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E2D7CF] space-y-2">
              {isLecturerLoggedIn ? (
                <button
                  type="button"
                  onClick={() => onNavigate('lecturer-dashboard')}
                  className="w-full py-3 px-4 bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Go to Lecturer Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </button>
              ) : isStudentLoggedIn || isAdminLoggedIn ? (
                <div className="p-3 rounded-xl bg-slate-100 text-slate-500 text-xs text-center font-medium border border-slate-200">
                  Access restricted to faculty. Sign out to switch roles.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('lecturer-auth')}
                    className="w-full py-3 px-4 bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Lecturer Login</span>
                    <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('lecturer-auth')}
                    className="w-full py-2.5 px-4 bg-white border border-[#D1C2B6] hover:bg-[#EFE6DF] text-[#4A2E1B] font-bold text-xs rounded-xl cursor-pointer text-center"
                  >
                    Create Faculty Account
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Administrator Portal */}
          <div className="rounded-3xl border-2 border-[#E2D7CF] bg-[#FAF7F5] p-6 sm:p-8 flex flex-col justify-between hover:border-[#D97706] hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#4A2E1B] text-[#F59E0B] flex items-center justify-center font-bold text-xl shadow-lg border border-[#D97706]/30">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D97706] block">
                  Academic Affairs
                </span>
                <h3 className="text-xl font-black text-[#3B2211] mt-0.5">
                  Administrator Portal
                </h3>
              </div>

              <p className="text-xs text-[#784728] leading-relaxed">
                Institution-wide master appointment registry, student database, faculty department management, appointment CSV export, and official announcement broadcasting.
              </p>

              <div className="space-y-1.5 pt-2 border-t border-[#E2D7CF] text-xs text-[#4A2E1B]">
                <div className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Master audit of student requests</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Add & manage lecturers across departments</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Secure administrative access control</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E2D7CF]">
              {isAdminLoggedIn ? (
                <button
                  type="button"
                  onClick={() => onNavigate('admin-dashboard')}
                  className="w-full py-3 px-4 bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Go to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </button>
              ) : isStudentLoggedIn || isLecturerLoggedIn ? (
                <div className="p-3 rounded-xl bg-slate-100 text-slate-500 text-xs text-center font-medium border border-slate-200">
                  Access restricted to admin. Sign out to switch roles.
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('admin-auth')}
                  className="w-full py-3 px-4 bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Administrator Sign In</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">
            Workflow Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#3B2211]">
            How the Booking System Works
          </h2>
          <p className="text-xs sm:text-sm text-[#784728]">
            Designed to eliminate unscheduled office congestion and provide structured academic advisory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
          {[
            {
              step: '01',
              title: 'Student Registration',
              desc: 'Student inputs full name, matric number (e.g. 2024/ND/CSC/0842), department, and creates a secure password.'
            },
            {
              step: '02',
              title: 'Propose Availability',
              desc: 'Select a lecturer, specify reason (project, CA test query, SIWES, clearance), and state available date and time slot.'
            },
            {
              step: '03',
              title: 'Lecturer Reviews',
              desc: 'Request appears directly in lecturer dashboard. Lecturer reviews availability and clicks Accept or Reject with feedback.'
            },
            {
              step: '04',
              title: 'Instant Notification',
              desc: 'Student receives instant dashboard notification showing confirmed office venue or the lecturer\'s reason for rescheduling.'
            }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] space-y-2 text-center">
              <span className="font-mono text-2xl font-black text-[#D97706] block">
                {item.step}
              </span>
              <h4 className="font-extrabold text-sm text-[#3B2211]">{item.title}</h4>
              <p className="text-xs text-[#784728] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INSTITUTION STATS & GUIDELINES */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PolyIbadan Stats */}
        <div className="lg:col-span-5 bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">
              Campus Statistics
            </span>
            <h3 className="text-xl font-black text-[#3B2211]">
              Academic Advisory Activity
            </h3>
            <p className="text-xs text-[#784728]">
              Live metric counts for the current second semester 2025/2026 academic session.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] text-center">
              <div className="text-3xl font-black font-mono text-[#4A2E1B]">{stats.totalStudents}</div>
              <div className="text-xs font-bold text-[#784728] mt-1">Registered Students</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] text-center">
              <div className="text-3xl font-black font-mono text-[#4A2E1B]">{stats.totalLecturers}</div>
              <div className="text-xs font-bold text-[#784728] mt-1">Faculty Staff</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] text-center">
              <div className="text-3xl font-black font-mono text-[#D97706]">{stats.totalAppointments}</div>
              <div className="text-xs font-bold text-[#784728] mt-1">Total Bookings</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] text-center">
              <div className="text-3xl font-black font-mono text-emerald-700">5</div>
              <div className="text-xs font-bold text-[#784728] mt-1">Faculties Connected</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] text-xs text-[#784728] space-y-1">
            <div className="font-bold text-[#4A2E1B]">North Campus & South Campus</div>
            <div>Computer Science, Engineering, Accountancy, Mass Comm, Math & Stats</div>
          </div>
        </div>

        {/* Advisory Consultation Rules */}
        <div className="lg:col-span-7 bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">
              Academic Guidelines
            </span>
            <h3 className="text-xl font-black text-[#3B2211]">
              Consultation & Office Hour Regulations
            </h3>
            <p className="text-xs text-[#784728]">
              All students and academic staff must adhere to the following PolyIbadan consultation rules:
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] space-y-1">
              <h5 className="font-bold text-[#4A2E1B]">1. 24-Hour Advance Booking Required</h5>
              <p className="text-[#784728]">Students must send availability proposals at least 24 hours prior to the requested meeting date to allow faculty to schedule accordingly.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] space-y-1">
              <h5 className="font-bold text-[#4A2E1B]">2. Continuous Assessment (CA) Score Verifications</h5>
              <p className="text-[#784728]">When querying marked test scores or assignments, students must bring along their original marked test answer booklet and official student ID card.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] space-y-1">
              <h5 className="font-bold text-[#4A2E1B]">3. SIWES & Industrial Training Logbooks</h5>
              <p className="text-[#784728]">Logbooks will only be endorsed if the student's company supervisor stamps and weekly summary records have been properly filled in advance.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] space-y-1">
              <h5 className="font-bold text-[#4A2E1B]">4. Final Year Project / Thesis Defence Supervision</h5>
              <p className="text-[#784728]">Students must attach or bring their latest draft chapter printouts along with their research approval slips when meeting their project supervisor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUTIONAL FOOTER */}
      <footer className="border-t-2 border-[#E2D7CF] pt-10 pb-6 text-center text-xs text-[#784728] space-y-4">
        <div className="flex justify-center">
          <SchoolLogo showText size="lg" textVariant="footer" subtext="North Campus & South Campus &bull; P.M.B. 22, U.I. Post Office, Ibadan, Oyo State, Nigeria" />
        </div>
        <p className="text-[11px] text-[#A89282]">
          &copy; {new Date().getFullYear()} The Polytechnic, Ibadan. All Rights Reserved. Directorate of Academic Affairs & ICT Center.
        </p>
      </footer>
    </div>
  );
}
