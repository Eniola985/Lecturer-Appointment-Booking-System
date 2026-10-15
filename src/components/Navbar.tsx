import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Bell, 
  LogOut, 
  Home, 
  User, 
  KeyRound, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Student, Lecturer, NotificationItem } from '../types/booking';

export type ActiveView = 
  | 'landing'
  | 'student-auth'
  | 'lecturer-auth'
  | 'admin-auth'
  | 'student-dashboard'
  | 'lecturer-dashboard'
  | 'admin-dashboard';

interface NavbarProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  currentStudent: Student | null;
  currentLecturer: Lecturer | null;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
}

export function Navbar({
  currentView,
  onNavigate,
  currentStudent,
  currentLecturer,
  isAdminLoggedIn,
  onLogout,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications
}: NavbarProps) {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b-2 border-[#E2D7CF] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#4A2E1B] text-[#FDFBF7] flex items-center justify-center shadow-md border-2 border-[#D97706]/40 shrink-0 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-[#F59E0B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-tight text-[#3B2211]">
                The Polytechnic, Ibadan
              </span>
              <span className="hidden md:inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FAF7F5] text-[#8C5638] border border-[#E2D7CF] uppercase tracking-wider">
                Appointment Portal
              </span>
            </div>
            <p className="text-[11px] text-[#784728] font-medium hidden sm:block">
              Faculty Consultation & Student Availability System
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Home Button */}
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === 'landing'
                ? 'bg-[#4A2E1B] text-white shadow-sm'
                : 'text-[#784728] hover:text-[#3B2211] hover:bg-[#F5EFEB]'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Home</span>
          </button>

          {/* Student Portal Link */}
          <button
            type="button"
            onClick={() => onNavigate(currentStudent ? 'student-dashboard' : 'student-auth')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === 'student-auth' || currentView === 'student-dashboard'
                ? 'bg-[#4A2E1B] text-white shadow-sm'
                : 'text-[#784728] hover:text-[#3B2211] hover:bg-[#F5EFEB]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Student Portal {currentStudent ? '(Logged In)' : ''}</span>
          </button>

          {/* Lecturer Portal Link */}
          <button
            type="button"
            onClick={() => onNavigate(currentLecturer ? 'lecturer-dashboard' : 'lecturer-auth')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === 'lecturer-auth' || currentView === 'lecturer-dashboard'
                ? 'bg-[#4A2E1B] text-white shadow-sm'
                : 'text-[#784728] hover:text-[#3B2211] hover:bg-[#F5EFEB]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Lecturer Portal {currentLecturer ? '(Logged In)' : ''}</span>
          </button>

          {/* Admin Portal Link */}
          <button
            type="button"
            onClick={() => onNavigate(isAdminLoggedIn ? 'admin-dashboard' : 'admin-auth')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === 'admin-auth' || currentView === 'admin-dashboard'
                ? 'bg-[#4A2E1B] text-white shadow-sm'
                : 'text-[#784728] hover:text-[#3B2211] hover:bg-[#F5EFEB]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Right side: Notifications & Active User Info */}
        <div className="flex items-center gap-3">
          {/* Notifications bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2.5 rounded-xl bg-[#FAF7F5] border border-[#E2D7CF] text-[#784728] hover:text-[#3B2211] hover:bg-[#F5EFEB] transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D97706] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border-2 border-[#E2D7CF] shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-[#EFE6DF] pb-2">
                  <span className="text-xs font-bold text-[#4A2E1B] uppercase tracking-wider">
                    Notifications ({notifications.length})
                  </span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={onClearAllNotifications}
                      className="text-[11px] text-[#D97706] hover:underline font-bold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#784728]">No alerts recorded.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => onMarkNotificationRead(n.id)}
                        className={`p-3 rounded-xl border text-xs transition-colors cursor-pointer ${
                          n.read
                            ? 'bg-[#FAF7F5] border-[#E2D7CF] text-[#784728]'
                            : 'bg-amber-50 border-amber-300 text-[#3B2211]'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="text-[#4A2E1B]">{n.title}</span>
                          <span className="text-[10px] text-[#8C5638] font-mono">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Active User session pill / Sign Out */}
          {(currentStudent || currentLecturer || isAdminLoggedIn) && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#E2D7CF] text-xs">
              <div className="text-right">
                <div className="font-extrabold text-[#3B2211] leading-tight max-w-[130px] truncate">
                  {currentStudent ? currentStudent.fullName : currentLecturer ? currentLecturer.name : 'Director (Admin)'}
                </div>
                <div className="text-[10px] text-[#8C5638] font-mono">
                  {currentStudent ? currentStudent.matricNumber : currentLecturer ? currentLecturer.staffId : 'ADMIN'}
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg text-[#8C5638] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Sign Out / Back to Home"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-xl bg-[#FAF7F5] border border-[#E2D7CF] text-[#4A2E1B] lg:hidden cursor-pointer"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-[#E2D7CF] bg-white p-4 space-y-2 shadow-lg">
          <button
            type="button"
            onClick={() => { onNavigate('landing'); setShowMobileMenu(false); }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold text-[#4A2E1B] hover:bg-[#FAF7F5] flex items-center gap-2"
          >
            <Home className="w-4 h-4 text-[#D97706]" />
            <span>Home / Landing Page</span>
          </button>

          <button
            type="button"
            onClick={() => { onNavigate(currentStudent ? 'student-dashboard' : 'student-auth'); setShowMobileMenu(false); }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold text-[#4A2E1B] hover:bg-[#FAF7F5] flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4 text-[#D97706]" />
            <span>Student Portal {currentStudent ? '(Logged In)' : '(Login/Register)'}</span>
          </button>

          <button
            type="button"
            onClick={() => { onNavigate(currentLecturer ? 'lecturer-dashboard' : 'lecturer-auth'); setShowMobileMenu(false); }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold text-[#4A2E1B] hover:bg-[#FAF7F5] flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 text-[#D97706]" />
            <span>Lecturer Portal {currentLecturer ? '(Logged In)' : '(Login)'}</span>
          </button>

          <button
            type="button"
            onClick={() => { onNavigate(isAdminLoggedIn ? 'admin-dashboard' : 'admin-auth'); setShowMobileMenu(false); }}
            className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold text-[#4A2E1B] hover:bg-[#FAF7F5] flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#D97706]" />
            <span>Administrator Portal {isAdminLoggedIn ? '(Logged In)' : '(Login)'}</span>
          </button>

          {(currentStudent || currentLecturer || isAdminLoggedIn) && (
            <div className="pt-2 border-t border-[#E2D7CF]">
              <button
                type="button"
                onClick={() => { onLogout(); setShowMobileMenu(false); }}
                className="w-full text-left py-2.5 px-3 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Sign Out of Active Session</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
