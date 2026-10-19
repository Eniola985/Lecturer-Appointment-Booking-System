import React, { useState } from 'react';
import { 
  Student, 
  Lecturer, 
  AppointmentRequest, 
  NotificationItem, 
  PurposeCategory,
  SystemAnnouncement 
} from '../types/booking';
import { POLY_FACULTIES_AND_DEPTS } from '../data/polyIbadanData';
import { SchoolLogo } from './SchoolLogo';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Send, 
  User, 
  BookOpen, 
  Phone, 
  Mail, 
  Bell, 
  Check, 
  Printer, 
  ArrowRight,
  Sparkles,
  Building2,
  Tag
} from 'lucide-react';

interface StudentPortalProps {
  currentStudent: Student;
  lecturers: Lecturer[];
  requests: AppointmentRequest[];
  notifications: NotificationItem[];
  announcements: SystemAnnouncement[];
  onSubmitRequest: (newReq: AppointmentRequest) => void;
  onCancelRequest: (requestId: string) => void;
  onMarkNotificationRead: (notifId: string) => void;
}

export function StudentPortal({
  currentStudent,
  lecturers,
  requests,
  notifications,
  announcements,
  onSubmitRequest,
  onCancelRequest,
  onMarkNotificationRead
}: StudentPortalProps) {
  const [activeTab, setActiveTab] = useState<'book' | 'track' | 'notifications' | 'notices'>('book');
  
  // Department filter for booking
  const [selectedDept, setSelectedDept] = useState<string>(currentStudent.department || 'Computer Science');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Lecturer for booking modal
  const [bookingLecturer, setBookingLecturer] = useState<Lecturer | null>(null);
  
  // Booking Form State
  const [proposedDate, setProposedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [proposedTime, setProposedTime] = useState('11:00 AM - 12:00 PM');
  const [purposeCategory, setPurposeCategory] = useState<PurposeCategory>('Project / Thesis Supervision');
  const [courseCode, setCourseCode] = useState('');
  const [purposeDetails, setPurposeDetails] = useState('');
  const [meetingMode, setMeetingMode] = useState<AppointmentRequest['meetingMode']>('Physical (Lecturer Office)');
  const [formError, setFormError] = useState<string | null>(null);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<AppointmentRequest | null>(null);

  // Track tab sub-filter
  const [trackStatusFilter, setTrackStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  // Filter student's own requests
  const studentRequests = requests.filter(r => r.studentId === currentStudent.id || r.studentMatric === currentStudent.matricNumber);

  const pendingCount = studentRequests.filter(r => r.status === 'pending').length;
  const acceptedCount = studentRequests.filter(r => r.status === 'accepted').length;
  const rejectedCount = studentRequests.filter(r => r.status === 'rejected').length;

  // Filter student notifications
  const studentNotifications = notifications.filter(
    n => n.userId === currentStudent.id || n.userId === currentStudent.matricNumber || n.userType === 'student'
  );
  const unreadNotifs = studentNotifications.filter(n => !n.read).length;

  // All departments list
  const allDepartments = POLY_FACULTIES_AND_DEPTS.flatMap(f => f.departments);

  // Filtered lecturers
  const filteredLecturers = lecturers.filter(lec => {
    if (selectedDept !== 'All' && lec.department !== selectedDept) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = lec.name.toLowerCase().includes(q);
      const matchSpecialty = lec.specialties.some(s => s.toLowerCase().includes(q));
      const matchOffice = lec.officeLocation.toLowerCase().includes(q);
      if (!matchName && !matchSpecialty && !matchOffice) return false;
    }
    return true;
  });

  const handleOpenBookingModal = (lec: Lecturer) => {
    setBookingLecturer(lec);
    setFormError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingLecturer) return;

    if (!proposedDate) {
      setFormError('Please select a proposed appointment date.');
      return;
    }
    if (!proposedTime) {
      setFormError('Please select a proposed consultation time slot.');
      return;
    }
    if (!purposeDetails.trim()) {
      setFormError('Please explain the reason and questions you want to discuss with the lecturer.');
      return;
    }

    const refNum = `TPI-APT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: AppointmentRequest = {
      id: `req-${Date.now()}`,
      referenceNumber: refNum,
      studentId: currentStudent.id,
      studentMatric: currentStudent.matricNumber,
      studentName: currentStudent.fullName,
      studentEmail: currentStudent.email,
      studentDepartment: currentStudent.department,
      studentLevel: currentStudent.level,
      studentPhone: currentStudent.phone,
      
      lecturerId: bookingLecturer.id,
      lecturerName: bookingLecturer.name,
      lecturerDepartment: bookingLecturer.department,
      lecturerOffice: bookingLecturer.officeLocation,
      
      proposedDate,
      proposedTime,
      purposeCategory,
      purposeDetails: purposeDetails.trim(),
      courseCode: courseCode.trim() || undefined,
      meetingMode,
      
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onSubmitRequest(newRequest);
    setBookingSuccessModal(newRequest);
    setBookingLecturer(null);
    setPurposeDetails('');
    setCourseCode('');
  };

  const getStatusBadge = (status: AppointmentRequest['status']) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Accepted & Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Awaiting Lecturer Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Unavailable / Declined
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold">
            <Check className="w-3.5 h-3.5 text-slate-600" /> Consultation Completed
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Student Identity Card Banner in PolyIbadan Brown & White */}
      <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#4A2E1B]/5 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#F5EFEB] to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <SchoolLogo size="lg" className="shadow-lg ring-4 ring-[#D97706]/20" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#4A2E1B] text-[#FDFBF7]">
                  {currentStudent.level}
                </span>
                <span className="text-xs font-mono font-bold text-[#8C5638] bg-[#FAF7F5] px-2.5 py-0.5 rounded-full border border-[#E2D7CF]">
                  MATRIC: {currentStudent.matricNumber}
                </span>
                <span className="text-xs text-[#784728] font-medium hidden sm:inline">&bull; {currentStudent.faculty}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2211] mt-1 tracking-tight">
                {currentStudent.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-[#784728] mt-0.5">
                Department of {currentStudent.department} &bull; {currentStudent.email}
              </p>
            </div>
          </div>

          {/* KPI Counters */}
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <div 
              onClick={() => { setActiveTab('track'); setTrackStatusFilter('pending'); }}
              className="flex-1 sm:flex-none p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] hover:border-[#D97706] text-center cursor-pointer transition-all min-w-[95px]"
            >
              <div className="text-2xl font-black text-[#D97706] font-mono leading-none">
                {pendingCount}
              </div>
              <div className="text-[10px] font-bold text-[#784728] uppercase mt-1">Pending</div>
            </div>

            <div 
              onClick={() => { setActiveTab('track'); setTrackStatusFilter('accepted'); }}
              className="flex-1 sm:flex-none p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] hover:border-emerald-500 text-center cursor-pointer transition-all min-w-[95px]"
            >
              <div className="text-2xl font-black text-emerald-700 font-mono leading-none">
                {acceptedCount}
              </div>
              <div className="text-[10px] font-bold text-[#784728] uppercase mt-1">Accepted</div>
            </div>

            <div 
              onClick={() => { setActiveTab('track'); setTrackStatusFilter('all'); }}
              className="flex-1 sm:flex-none p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] hover:border-[#4A2E1B] text-center cursor-pointer transition-all min-w-[95px]"
            >
              <div className="text-2xl font-black text-[#4A2E1B] font-mono leading-none">
                {studentRequests.length}
              </div>
              <div className="text-[10px] font-bold text-[#784728] uppercase mt-1">Total Sent</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-[#EFE6DF] mt-6 pt-4 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('book')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'book'
                ? 'bg-[#4A2E1B] text-white shadow-md'
                : 'text-[#784728] hover:text-[#3B2211] hover:bg-[#F5EFEB]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#F59E0B]" />
            <span>Select & Book Lecturer</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'track'
                ? 'bg-[#4A2E1B] text-white shadow-md'
                : 'text-[#784728] hover:text-[#3B2211] hover:bg-[#F5EFEB]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#F59E0B]" />
            <span>Track Requests ({studentRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-[#4A2E1B] text-white shadow-md'
                : 'text-[#784728] hover:text-[#3B2211] hover:bg-[#F5EFEB]'
            }`}
          >
            <Bell className="w-4 h-4 text-[#F59E0B]" />
            <span>Alerts & Notifications</span>
            {unreadNotifs > 0 && (
              <span className="px-1.5 py-0.2 bg-[#D97706] text-white text-[10px] font-bold rounded-full">
                {unreadNotifs}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'notices'
                ? 'bg-[#4A2E1B] text-white shadow-md'
                : 'text-[#784728] hover:text-[#3B2211] hover:bg-[#F5EFEB]'
            }`}
          >
            <Tag className="w-4 h-4 text-[#F59E0B]" />
            <span>PolyIbadan Notices</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SELECT & BOOK LECTURER */}
      {activeTab === 'book' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white border-2 border-[#E2D7CF] rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8C5638] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lecturer by name, specialization, or office room..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>

              {/* Department Dropdown Selector */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-[#4A2E1B] whitespace-nowrap">Filter Dept:</span>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] font-semibold focus:outline-none focus:border-[#4A2E1B] w-full md:w-64 cursor-pointer"
                >
                  <option value="All">All PolyIbadan Departments</option>
                  {allDepartments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Department Shortcuts */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin text-xs">
              <span className="text-[#8C5638] font-bold shrink-0 self-center">Frequent:</span>
              {['Computer Science', 'Electrical & Electronics Engineering', 'Accountancy', 'Mathematics & Statistics', 'Mass Communication'].map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                    selectedDept === dept
                      ? 'bg-[#4A2E1B] text-white'
                      : 'bg-[#F5EFEB] text-[#784728] hover:bg-[#E2D7CF]'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Lecturers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLecturers.map((lec) => (
              <div
                key={lec.id}
                className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 flex flex-col justify-between hover:border-[#D97706] hover:shadow-xl transition-all duration-200 group"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={lec.avatar}
                      alt={lec.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#D97706]/40 group-hover:ring-[#D97706] transition-all shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] block">
                        {lec.title}
                      </span>
                      <h3 className="font-extrabold text-[#3B2211] text-base group-hover:text-[#4A2E1B] leading-snug truncate">
                        {lec.name}
                      </h3>
                      <p className="text-xs text-[#784728] truncate">{lec.department}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs bg-[#FAF7F5] p-3.5 rounded-2xl border border-[#E2D7CF]">
                    <div className="flex items-start gap-2 text-[#4A2E1B]">
                      <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                      <span className="font-medium text-[11px] leading-tight">{lec.officeLocation}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#784728]">
                      <Clock className="w-3.5 h-3.5 text-[#8C5638] shrink-0 mt-0.5" />
                      <span className="text-[11px]">{lec.consultationDays}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#784728]">
                      <Mail className="w-3.5 h-3.5 text-[#8C5638] shrink-0" />
                      <span className="text-[11px] font-mono truncate">{lec.email}</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1">
                    {lec.specialties.slice(0, 3).map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-[#F5EFEB] text-[#784728] rounded-md text-[10px] font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EFE6DF] flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Available for Booking
                  </span>

                  <button
                    onClick={() => handleOpenBookingModal(lec)}
                    className="px-4 py-2 bg-[#4A2E1B] hover:bg-[#3B2211] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Book Appointment</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TRACK MY REQUESTS */}
      {activeTab === 'track' && (
        <div className="space-y-6">
          {/* Sub filter buttons */}
          <div className="flex items-center gap-2 border-b border-[#E2D7CF] pb-3 overflow-x-auto">
            {[
              { id: 'all', label: `All Requests (${studentRequests.length})` },
              { id: 'pending', label: `Awaiting Lecturer Review (${pendingCount})` },
              { id: 'accepted', label: `Confirmed / Available (${acceptedCount})` },
              { id: 'rejected', label: `Unavailable / Declined (${rejectedCount})` }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTrackStatusFilter(f.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  trackStatusFilter === f.id
                    ? 'bg-[#4A2E1B] text-white shadow-sm'
                    : 'text-[#784728] hover:text-[#3B2211] hover:bg-[#F5EFEB]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {studentRequests.length === 0 ? (
            <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F5EFEB] text-[#8C5638] flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#3B2211]">No appointment requests submitted yet</h3>
              <p className="text-xs text-[#784728] max-w-sm mx-auto">
                Select your course lecturer or project supervisor from the booking directory to submit your consultation availability request.
              </p>
              <button
                onClick={() => setActiveTab('book')}
                className="px-5 py-2.5 bg-[#4A2E1B] text-white rounded-xl text-xs font-bold shadow"
              >
                Browse Lecturers
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentRequests
                .filter(r => {
                  if (trackStatusFilter === 'all') return true;
                  return r.status === trackStatusFilter;
                })
                .map((req) => (
                  <div
                    key={req.id}
                    className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Reference & Status */}
                      <div className="flex items-center justify-between border-b border-[#EFE6DF] pb-3">
                        <span className="font-mono text-xs font-extrabold text-[#8C5638]">
                          {req.referenceNumber}
                        </span>
                        {getStatusBadge(req.status)}
                      </div>

                      {/* Lecturer details */}
                      <div>
                        <span className="text-[10px] font-bold text-[#8C5638] uppercase tracking-wider block">
                          Lecturer
                        </span>
                        <h4 className="text-base font-extrabold text-[#3B2211]">
                          {req.lecturerName}
                        </h4>
                        <p className="text-xs text-[#784728]">
                          Department of {req.lecturerDepartment} &bull; {req.lecturerOffice}
                        </p>
                      </div>

                      {/* Proposed Timing */}
                      <div className="p-3 bg-[#FAF7F5] rounded-2xl border border-[#E2D7CF] grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-[#8C5638] uppercase block">
                            Requested Date
                          </span>
                          <span className="font-bold text-[#3B2211]">{req.proposedDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#8C5638] uppercase block">
                            Proposed Time
                          </span>
                          <span className="font-bold text-[#D97706]">{req.proposedTime}</span>
                        </div>
                      </div>

                      {/* Purpose & Course */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-[#4A2E1B]">
                          <BookOpen className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{req.purposeCategory}</span>
                          {req.courseCode && (
                            <span className="px-2 py-0.5 bg-[#F5EFEB] border border-[#E2D7CF] rounded text-[10px] font-mono text-[#784728]">
                              {req.courseCode}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#784728] italic bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E2D7CF]">
                          "{req.purposeDetails}"
                        </p>
                      </div>

                      {/* Lecturer Response Box (ACCEPTED or REJECTED) */}
                      {req.status === 'accepted' && (
                        <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-xs space-y-1">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Lecturer Availability Confirmed:
                          </span>
                          <p className="text-emerald-800 font-medium">
                            {req.lecturerResponseNote || 'Lecturer has confirmed they will be available at this time in their office.'}
                          </p>
                          <div className="pt-1 text-[11px] text-emerald-900 font-mono">
                            VENUE: {req.confirmedVenue || req.lecturerOffice}
                          </div>
                        </div>
                      )}

                      {req.status === 'rejected' && (
                        <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-xs space-y-1">
                          <span className="font-bold text-rose-900 flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-rose-600" />
                            Lecturer Unavailable Note:
                          </span>
                          <p className="text-rose-800">
                            {req.lecturerResponseNote || 'Lecturer is unavailable during the proposed time due to department schedule.'}
                          </p>
                          <p className="text-[11px] text-rose-700 italic pt-0.5">
                            Tip: You may submit a new request on another day when this lecturer holds office hours.
                          </p>
                        </div>
                      )}

                      {req.status === 'pending' && (
                        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Waiting for {req.lecturerName} to review your availability proposal.</span>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-[#EFE6DF] flex items-center justify-between text-xs">
                      <span className="text-[10px] text-[#8C5638] font-mono">
                        Submitted: {new Date(req.createdAt).toLocaleDateString()}
                      </span>

                      {req.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => onCancelRequest(req.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold transition-colors cursor-pointer"
                        >
                          Withdraw Request
                        </button>
                      )}

                      {req.status === 'accepted' && (
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="px-3 py-1.5 rounded-xl bg-[#4A2E1B] text-white hover:bg-[#3B2211] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>Print Pass</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS & ALERTS */}
      {activeTab === 'notifications' && (
        <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#EFE6DF] pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#3B2211] flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#D97706]" />
                Lecturer Response Notifications
              </h2>
              <p className="text-xs text-[#784728]">
                Instant alerts sent whenever a lecturer accepts, rejects, or responds to your appointment request.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#8C5638] bg-[#FAF7F5] px-3 py-1 rounded-full border border-[#E2D7CF]">
              {studentNotifications.length} alerts
            </span>
          </div>

          {studentNotifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#784728]">
              No notifications yet. You will receive real-time notifications here as soon as a lecturer acts on your request.
            </div>
          ) : (
            <div className="space-y-3">
              {studentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onMarkNotificationRead(notif.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-[#FAF7F5] border-[#E2D7CF] text-[#784728]'
                      : 'bg-white border-[#D97706] text-[#3B2211] shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-sm text-[#4A2E1B] flex items-center gap-2">
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-[#D97706]" />}
                      {notif.title}
                    </span>
                    <span className="text-[11px] text-[#8C5638] font-mono">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{notif.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: POLYIBADAN NOTICES */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-[#3B2211] flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#D97706]" />
              Polytechnic of Ibadan Official Notice Board
            </h2>
            <p className="text-xs text-[#784728]">
              Academic advisory announcements from the Directorate of Academic Affairs and Deans of Faculties.
            </p>

            <div className="space-y-4 pt-2">
              {announcements.map((anc) => (
                <div
                  key={anc.id}
                  className="p-5 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#4A2E1B]">{anc.title}</span>
                    <span className="text-[11px] font-mono font-bold text-[#D97706]">{anc.date}</span>
                  </div>
                  <p className="text-xs text-[#784728] leading-relaxed">{anc.content}</p>
                  <div className="text-[10px] font-semibold text-[#8C5638] uppercase">
                    Issued By: {anc.postedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {bookingLecturer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#3B2211]/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl w-full max-w-2xl my-6 shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#4A2E1B] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={bookingLecturer.avatar}
                  alt={bookingLecturer.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#D97706]"
                />
                <div>
                  <h3 className="font-bold text-base leading-snug">
                    Book Appointment with {bookingLecturer.name}
                  </h3>
                  <p className="text-xs text-[#EFE6DF]">
                    {bookingLecturer.title} &bull; {bookingLecturer.department}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBookingLecturer(null)}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Office & Days Notice */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] text-xs space-y-1">
                <div className="font-bold text-[#4A2E1B]">Lecturer Office & Routine Hours:</div>
                <div className="text-[#784728]">{bookingLecturer.officeLocation}</div>
                <div className="text-[#D97706] font-semibold">{bookingLecturer.consultationDays}</div>
              </div>

              {/* Proposed Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                    Date You Want To See Lecturer *
                  </label>
                  <input
                    type="date"
                    value={proposedDate}
                    onChange={(e) => setProposedDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                    Time You Will Be Available *
                  </label>
                  <select
                    value={proposedTime}
                    onChange={(e) => setProposedTime(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
                  >
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM (Morning Slot 1)</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM (Morning Slot 2)</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM (Mid-day Slot 1)</option>
                    <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM (Mid-day Slot 2)</option>
                    <option value="01:30 PM - 02:30 PM">01:30 PM - 02:30 PM (Afternoon Slot 1)</option>
                    <option value="02:30 PM - 03:30 PM">02:30 PM - 03:30 PM (Afternoon Slot 2)</option>
                    <option value="03:30 PM - 04:30 PM">03:30 PM - 04:30 PM (Late Slot)</option>
                  </select>
                </div>
              </div>

              {/* Purpose Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Reason Why You Want to Book this Lecturer *
                </label>
                <select
                  value={purposeCategory}
                  onChange={(e) => setPurposeCategory(e.target.value as PurposeCategory)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
                >
                  <option value="Project / Thesis Supervision">Project / Thesis Supervision & Proposal Review</option>
                  <option value="Continuous Assessment (CA) / Test Query">Continuous Assessment (CA) Score / Test Query</option>
                  <option value="Assignment & Coursework Guidance">Assignment, Proofs & Coursework Help</option>
                  <option value="SIWES / Industrial Training Logbook">SIWES / IT Logbook Verification & Signing</option>
                  <option value="Course Registration & Clearance">Course Registration, Add/Drop & Clearance</option>
                  <option value="General Academic Mentorship">General Academic Guidance & Career Mentorship</option>
                </select>
              </div>

              {/* Course code & Meeting mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                    Course Code (If Applicable)
                  </label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. COM 228 or MTH 111"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                    Preferred Meeting Venue / Mode
                  </label>
                  <select
                    value={meetingMode}
                    onChange={(e) => setMeetingMode(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
                  >
                    <option value="Physical (Lecturer Office)">Physical (Lecturer's Departmental Office)</option>
                    <option value="Faculty Staff Room">Faculty Staff Common Room</option>
                    <option value="Virtual / Phone Call">Phone Call / WhatsApp Consultation</option>
                  </select>
                </div>
              </div>

              {/* Detailed Reason Explanation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Detailed Explanation for the Lecturer *
                </label>
                <textarea
                  value={purposeDetails}
                  onChange={(e) => setPurposeDetails(e.target.value)}
                  rows={3}
                  placeholder="State specifically what you are bringing to the meeting (e.g. Chapter 1 draft, marked test script, clearance receipt)..."
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] placeholder-[#A89282] focus:outline-none focus:border-[#4A2E1B] resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-[#EFE6DF] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBookingLecturer(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#D1C2B6] text-xs font-bold text-[#784728] hover:bg-[#FAF7F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4A2E1B] hover:bg-[#3B2211] text-white text-xs font-bold shadow-md shadow-[#4A2E1B]/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Send Request to Lecturer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION MODAL */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B2211]/60 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 shadow-2xl">
            <div className="flex items-center justify-center gap-3">
              <SchoolLogo size="md" />
              <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                Request Dispatched Successfully
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#3B2211] mt-1">
                Your Appointment Request is Sent!
              </h2>
              <p className="text-xs text-[#784728] max-w-sm mx-auto mt-2">
                Your proposed availability has been routed to <strong>{bookingSuccessModal.lecturerName}</strong>. You will receive an immediate dashboard notification once the lecturer accepts or provides an alternative date.
              </p>
            </div>

            <div className="bg-[#FAF7F5] border border-[#E2D7CF] rounded-2xl p-4 text-left font-mono text-xs text-[#3B2211] space-y-2">
              <div className="flex justify-between border-b border-[#EFE6DF] pb-1.5">
                <span className="text-[#8C5638]">Ref Number:</span>
                <span className="font-bold text-[#4A2E1B]">{bookingSuccessModal.referenceNumber}</span>
              </div>
              <div className="flex justify-between border-b border-[#EFE6DF] pb-1.5">
                <span className="text-[#8C5638]">Lecturer:</span>
                <span>{bookingSuccessModal.lecturerName}</span>
              </div>
              <div className="flex justify-between border-b border-[#EFE6DF] pb-1.5">
                <span className="text-[#8C5638]">Date & Time:</span>
                <span>{bookingSuccessModal.proposedDate} ({bookingSuccessModal.proposedTime})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C5638]">Status:</span>
                <span className="text-[#D97706] font-bold">Pending Lecturer Review</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setBookingSuccessModal(null);
                setActiveTab('track');
              }}
              className="w-full py-3 px-4 bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
            >
              Track Request in Dashboard &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
