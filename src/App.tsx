import React, { useState, useEffect } from 'react';
import { 
  Student, 
  Lecturer, 
  AppointmentRequest, 
  NotificationItem, 
  SystemAnnouncement 
} from './types/booking';
import { 
  INITIAL_STUDENTS, 
  INITIAL_LECTURERS, 
  INITIAL_REQUESTS, 
  INITIAL_ANNOUNCEMENTS
} from './data/polyIbadanData';
import { Navbar, ActiveView } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentAuth } from './components/StudentAuth';
import { LecturerAuth } from './components/LecturerAuth';
import { AdminAuth } from './components/AdminAuth';
import { StudentPortal } from './components/StudentPortal';
import { LecturerPortal } from './components/LecturerPortal';
import { AdminPortal } from './components/AdminPortal';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  // Persistent State
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('tpi_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [lecturers, setLecturers] = useState<Lecturer[]>(() => {
    try {
      const saved = localStorage.getItem('tpi_lecturers');
      return saved ? JSON.parse(saved) : INITIAL_LECTURERS;
    } catch {
      return INITIAL_LECTURERS;
    }
  });

  const [requests, setRequests] = useState<AppointmentRequest[]>(() => {
    try {
      const saved = localStorage.getItem('tpi_requests');
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem('tpi_announcements');
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('tpi_notifications');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'notif-1',
          userId: 'stu-1',
          userType: 'student',
          title: 'Lecturer Availability Confirmed',
          message: 'Engr. Dr. O. A. Babalola has accepted your consultation request for 2026-10-20 at 11:00 AM. Venue: Room 12, Computer Science HOD Block.',
          timestamp: 'Yesterday at 3:30 PM',
          read: false,
          statusType: 'accepted'
        },
        {
          id: 'notif-2',
          userId: 'stu-2',
          userType: 'student',
          title: 'Lecturer Unavailable Notice',
          message: 'Engr. M. B. Sanusi is unavailable on 2026-10-16. Note: Attending external accreditation visit. Please re-book for next Wednesday afternoon.',
          timestamp: '14 Oct 2026',
          read: false,
          statusType: 'rejected'
        }
      ];
    } catch {
      return [];
    }
  });

  // Current view starts on the official LANDING PAGE!
  const [currentView, setCurrentView] = useState<ActiveView>('landing');

  // User Sessions
  const [loggedStudent, setLoggedStudent] = useState<Student | null>(null);
  const [loggedLecturer, setLoggedLecturer] = useState<Lecturer | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Toast feedback state
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('tpi_students', JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('tpi_lecturers', JSON.stringify(lecturers));
    } catch (e) {
      console.error(e);
    }
  }, [lecturers]);

  useEffect(() => {
    try {
      localStorage.setItem('tpi_requests', JSON.stringify(requests));
    } catch (e) {
      console.error(e);
    }
  }, [requests]);

  useEffect(() => {
    try {
      localStorage.setItem('tpi_announcements', JSON.stringify(announcements));
    } catch (e) {
      console.error(e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem('tpi_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  // STRICT VIEW NAVIGATION & ROUTE GUARD
  const handleNavigate = (targetView: ActiveView) => {
    // 1. If student is logged in: cannot view lecturer or admin portals
    if (loggedStudent) {
      if (
        targetView === 'lecturer-dashboard' ||
        targetView === 'lecturer-auth' ||
        targetView === 'admin-dashboard' ||
        targetView === 'admin-auth'
      ) {
        showToast('Access restricted: You are currently logged in as a Student. Sign out to switch roles.', 'error');
        setCurrentView('student-dashboard');
        return;
      }
    }

    // 2. If lecturer is logged in: cannot view student or admin portals
    if (loggedLecturer) {
      if (
        targetView === 'student-dashboard' ||
        targetView === 'student-auth' ||
        targetView === 'admin-dashboard' ||
        targetView === 'admin-auth'
      ) {
        showToast('Access restricted: You are currently logged in as Faculty. Sign out to switch roles.', 'error');
        setCurrentView('lecturer-dashboard');
        return;
      }
    }

    // 3. If admin is logged in: cannot view student or lecturer dashboards
    if (isAdminLoggedIn) {
      if (
        targetView === 'student-dashboard' ||
        targetView === 'student-auth' ||
        targetView === 'lecturer-dashboard' ||
        targetView === 'lecturer-auth'
      ) {
        showToast('Access restricted: You are currently logged in as Administrator. Sign out to switch roles.', 'error');
        setCurrentView('admin-dashboard');
        return;
      }
    }

    setCurrentView(targetView);
  };

  // STUDENT ACTIONS
  const handleStudentSubmitRequest = (newReq: AppointmentRequest) => {
    setRequests(prev => [newReq, ...prev]);

    // Dispatch notifications
    const studentNotif: NotificationItem = {
      id: `notif-${Date.now()}-1`,
      userId: newReq.studentId,
      userType: 'student',
      title: 'Appointment Request Dispatched',
      message: `Your availability proposal for ${newReq.proposedDate} (${newReq.proposedTime}) was sent to ${newReq.lecturerName}.`,
      timestamp: 'Just now',
      read: false,
      appointmentId: newReq.id,
      statusType: 'pending'
    };

    const lecturerNotif: NotificationItem = {
      id: `notif-${Date.now()}-2`,
      userId: newReq.lecturerId,
      userType: 'lecturer',
      title: 'New Student Availability Proposal',
      message: `${newReq.studentName} (${newReq.studentMatric}, ${newReq.studentLevel}) proposed to see you on ${newReq.proposedDate} for "${newReq.purposeCategory}".`,
      timestamp: 'Just now',
      read: false,
      appointmentId: newReq.id,
      statusType: 'pending'
    };

    setNotifications(prev => [studentNotif, lecturerNotif, ...prev]);
    showToast(`Appointment request ${newReq.referenceNumber} submitted!`);
  };

  const handleStudentCancelRequest = (requestId: string) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    showToast('Appointment request withdrawn', 'info');
  };

  // LECTURER ACTIONS
  const handleLecturerAcceptRequest = (requestId: string, responseNote: string, venue: string) => {
    let targetReq: AppointmentRequest | undefined;

    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          targetReq = {
            ...r,
            status: 'accepted',
            lecturerResponseNote: responseNote,
            confirmedVenue: venue,
            updatedAt: new Date().toISOString()
          };
          return targetReq;
        }
        return r;
      })
    );

    if (targetReq || requests.find(r => r.id === requestId)) {
      const current = targetReq || requests.find(r => r.id === requestId)!;
      const studentAlert: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: current.studentId,
        userType: 'student',
        title: 'Lecturer Available: Request Accepted! 🎉',
        message: `${current.lecturerName} confirmed availability for ${current.proposedDate} at ${current.proposedTime}. Venue: ${venue}. Note: "${responseNote}"`,
        timestamp: 'Just now',
        read: false,
        appointmentId: requestId,
        statusType: 'accepted'
      };
      setNotifications(prev => [studentAlert, ...prev]);
    }

    showToast('Availability confirmed! Student has been notified in their dashboard.');
  };

  const handleLecturerRejectRequest = (requestId: string, rejectionReason: string) => {
    let targetReq: AppointmentRequest | undefined;

    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          targetReq = {
            ...r,
            status: 'rejected',
            lecturerResponseNote: rejectionReason,
            updatedAt: new Date().toISOString()
          };
          return targetReq;
        }
        return r;
      })
    );

    if (targetReq || requests.find(r => r.id === requestId)) {
      const current = targetReq || requests.find(r => r.id === requestId)!;
      const studentAlert: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: current.studentId,
        userType: 'student',
        title: 'Consultation Unavailable',
        message: `${current.lecturerName} is unavailable for ${current.proposedDate}. Reason: "${rejectionReason}"`,
        timestamp: 'Just now',
        read: false,
        appointmentId: requestId,
        statusType: 'rejected'
      };
      setNotifications(prev => [studentAlert, ...prev]);
    }

    showToast('Rejection sent with explanation note. Student notified.', 'info');
  };

  const handleLecturerCompleteAppointment = (requestId: string) => {
    setRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'completed', updatedAt: new Date().toISOString() } : r))
    );
    showToast('Consultation marked as concluded');
  };

  const handleLecturerUpdateOfficeHours = (lecturerId: string, daysText: string, officeText: string, titleText?: string) => {
    setLecturers(prev =>
      prev.map(l => (l.id === lecturerId ? { 
        ...l, 
        consultationDays: daysText, 
        officeLocation: officeText,
        title: titleText && titleText.trim() ? titleText.trim() : l.title
      } : l))
    );
    if (loggedLecturer && loggedLecturer.id === lecturerId) {
      setLoggedLecturer(prev => prev ? { 
        ...prev, 
        consultationDays: daysText, 
        officeLocation: officeText,
        title: titleText && titleText.trim() ? titleText.trim() : prev.title
      } : null);
    }
  };

  // ADMIN ACTIONS
  const handleAdminAddLecturer = (newLec: Lecturer) => {
    setLecturers(prev => [newLec, ...prev]);
    showToast(`Added ${newLec.name} to PolyIbadan faculty directory`);
  };

  const handleAdminDeleteLecturer = (lecId: string) => {
    setLecturers(prev => prev.filter(l => l.id !== lecId));
    showToast('Lecturer removed from directory', 'info');
  };

  const handleAdminPostAnnouncement = (newAnc: SystemAnnouncement) => {
    setAnnouncements(prev => [newAnc, ...prev]);
    const broadcastNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'all',
      userType: 'student',
      title: `Notice: ${newAnc.title}`,
      message: newAnc.content,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [broadcastNotif, ...prev]);
    showToast('Official notice broadcasted to portal');
  };

  const handleAdminDeleteAnnouncement = (ancId: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== ancId));
    showToast('Notice removed');
  };

  // NOTIFICATION UTILS
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSignOut = () => {
    setLoggedStudent(null);
    setLoggedLecturer(null);
    setIsAdminLoggedIn(false);
    setCurrentView('landing');
    showToast('Signed out of session. Returned to Home.');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#3B2211] flex flex-col font-sans selection:bg-[#D97706] selection:text-white">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#4A2E1B] text-[#FDFBF7] shadow-2xl text-xs border border-[#D97706]/40 animate-in slide-in-from-top-2">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
          )}
          <span className="font-semibold">{toast.text}</span>
        </div>
      )}

      {/* Navigation Header with Home & All Portals */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentStudent={loggedStudent}
        currentLecturer={loggedLecturer}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleSignOut}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearAllNotifications={handleClearAllNotifications}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home Breadcrumb when on an auth or interior page */}
        {currentView !== 'landing' && (
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => handleNavigate('landing')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#8C5638] hover:text-[#4A2E1B] bg-white px-3.5 py-1.5 rounded-xl border border-[#E2D7CF] transition-colors cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>&larr; Back to Home</span>
            </button>

            <span className="text-xs font-mono font-bold text-[#784728] uppercase">
              Current: {currentView.replace('-', ' ')}
            </span>
          </div>
        )}

        {/* 1. OFFICIAL LANDING PAGE */}
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            announcements={announcements}
            stats={{
              totalLecturers: lecturers.length,
              totalStudents: students.length,
              totalAppointments: requests.length
            }}
            isStudentLoggedIn={!!loggedStudent}
            isLecturerLoggedIn={!!loggedLecturer}
            isAdminLoggedIn={isAdminLoggedIn}
            studentName={loggedStudent?.fullName}
            lecturerName={loggedLecturer?.name}
          />
        )}

        {/* 2. STUDENT AUTH (LOGIN & REGISTER) PAGE */}
        {currentView === 'student-auth' && (
          <StudentAuth
            students={students}
            onLoginSuccess={(s) => {
              setLoggedStudent(s);
              setCurrentView('student-dashboard');
              showToast(`Welcome back, ${s.fullName}!`);
            }}
            onRegisterSuccess={(newS) => {
              setStudents(prev => [newS, ...prev]);
              setLoggedStudent(newS);
              setCurrentView('student-dashboard');
              showToast(`Registration complete! Welcome, ${newS.fullName}`);
            }}
            onSwitchToLecturerLogin={() => handleNavigate('lecturer-auth')}
            onSwitchToAdminLogin={() => handleNavigate('admin-auth')}
          />
        )}

        {/* 3. STUDENT DASHBOARD */}
        {currentView === 'student-dashboard' && (
          loggedStudent ? (
            <StudentPortal
              currentStudent={loggedStudent}
              lecturers={lecturers}
              requests={requests}
              notifications={notifications}
              announcements={announcements}
              onSubmitRequest={handleStudentSubmitRequest}
              onCancelRequest={handleStudentCancelRequest}
              onMarkNotificationRead={handleMarkNotificationRead}
            />
          ) : (
            <StudentAuth
              students={students}
              onLoginSuccess={(s) => {
                setLoggedStudent(s);
                setCurrentView('student-dashboard');
              }}
              onRegisterSuccess={(newS) => {
                setStudents(prev => [newS, ...prev]);
                setLoggedStudent(newS);
                setCurrentView('student-dashboard');
              }}
              onSwitchToLecturerLogin={() => handleNavigate('lecturer-auth')}
              onSwitchToAdminLogin={() => handleNavigate('admin-auth')}
            />
          )
        )}

        {/* 4. LECTURER AUTH (LOGIN & REGISTER) PAGE */}
        {currentView === 'lecturer-auth' && (
          <LecturerAuth
            lecturers={lecturers}
            onLoginSuccess={(lec) => {
              setLoggedLecturer(lec);
              setCurrentView('lecturer-dashboard');
              showToast(`Signed in as ${lec.name}`);
            }}
            onRegisterSuccess={(newLec) => {
              setLecturers(prev => [newLec, ...prev]);
              setLoggedLecturer(newLec);
              setCurrentView('lecturer-dashboard');
              showToast(`Welcome to PolyIbadan Faculty Portal, ${newLec.name}!`);
            }}
            onSwitchToStudentLogin={() => handleNavigate('student-auth')}
            onSwitchToAdminLogin={() => handleNavigate('admin-auth')}
          />
        )}

        {/* 5. LECTURER DASHBOARD (Strictly filtered to this lecturer) */}
        {currentView === 'lecturer-dashboard' && (
          loggedLecturer ? (
            <LecturerPortal
              currentLecturer={loggedLecturer}
              requests={requests}
              onAcceptRequest={handleLecturerAcceptRequest}
              onRejectRequest={handleLecturerRejectRequest}
              onCompleteAppointment={handleLecturerCompleteAppointment}
              onUpdateOfficeHours={handleLecturerUpdateOfficeHours}
            />
          ) : (
            <LecturerAuth
              lecturers={lecturers}
              onLoginSuccess={(lec) => {
                setLoggedLecturer(lec);
                setCurrentView('lecturer-dashboard');
              }}
              onRegisterSuccess={(newLec) => {
                setLecturers(prev => [newLec, ...prev]);
                setLoggedLecturer(newLec);
                setCurrentView('lecturer-dashboard');
              }}
              onSwitchToStudentLogin={() => handleNavigate('student-auth')}
              onSwitchToAdminLogin={() => handleNavigate('admin-auth')}
            />
          )
        )}

        {/* 6. ADMIN AUTH (LOGIN) PAGE */}
        {currentView === 'admin-auth' && (
          <AdminAuth
            onLoginSuccess={() => {
              setIsAdminLoggedIn(true);
              setCurrentView('admin-dashboard');
              showToast('Welcome to Academic Affairs Admin Portal');
            }}
            onSwitchToStudentLogin={() => handleNavigate('student-auth')}
            onSwitchToLecturerLogin={() => handleNavigate('lecturer-auth')}
          />
        )}

        {/* 7. ADMIN DASHBOARD */}
        {currentView === 'admin-dashboard' && (
          isAdminLoggedIn ? (
            <AdminPortal
              lecturers={lecturers}
              students={students}
              requests={requests}
              announcements={announcements}
              onAddLecturer={handleAdminAddLecturer}
              onDeleteLecturer={handleAdminDeleteLecturer}
              onPostAnnouncement={handleAdminPostAnnouncement}
              onDeleteAnnouncement={handleAdminDeleteAnnouncement}
            />
          ) : (
            <AdminAuth
              onLoginSuccess={() => {
                setIsAdminLoggedIn(true);
                setCurrentView('admin-dashboard');
              }}
              onSwitchToStudentLogin={() => handleNavigate('student-auth')}
              onSwitchToLecturerLogin={() => handleNavigate('lecturer-auth')}
            />
          )
        )}
      </main>

      {/* Official PolyIbadan Institutional Footer */}
      <footer className="bg-white border-t-2 border-[#E2D7CF] py-8 text-center text-xs text-[#784728] mt-12 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#4A2E1B] text-[#F59E0B] flex items-center justify-center font-bold text-[10px]">
            TPI
          </div>
          <span className="font-extrabold text-[#3B2211]">
            THE POLYTECHNIC, IBADAN &bull; ESTABLISHED 1970
          </span>
        </div>
        <p className="text-[#8C5638]">
          Faculty Consultation & Student Appointment Booking System &bull; Directorate of Academic Affairs
        </p>
        <p className="text-[11px] text-[#A89282]">
          North Campus & South Campus &bull; P.M.B. 22, U.I. Post Office, Ibadan, Oyo State, Nigeria
        </p>
      </footer>
    </div>
  );
}
