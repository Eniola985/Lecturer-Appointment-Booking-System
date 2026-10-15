import React, { useState } from 'react';
import { 
  Lecturer, 
  AppointmentRequest, 
  NotificationItem, 
  SystemAnnouncement 
} from '../types/booking';
import { 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Search, 
  Check, 
  FileText, 
  Sparkles, 
  Settings, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface LecturerPortalProps {
  currentLecturer: Lecturer;
  allLecturers: Lecturer[];
  onSwitchLecturer: (lecturerId: string) => void;
  requests: AppointmentRequest[];
  onAcceptRequest: (requestId: string, responseNote: string, venue: string) => void;
  onRejectRequest: (requestId: string, rejectionReason: string) => void;
  onCompleteAppointment: (requestId: string, notes?: string) => void;
  onUpdateOfficeHours: (lecturerId: string, daysText: string, officeText: string) => void;
}

export function LecturerPortal({
  currentLecturer,
  allLecturers,
  onSwitchLecturer,
  requests,
  onAcceptRequest,
  onRejectRequest,
  onCompleteAppointment,
  onUpdateOfficeHours
}: LecturerPortalProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'schedule' | 'history' | 'settings'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [acceptingRequest, setAcceptingRequest] = useState<AppointmentRequest | null>(null);
  const [acceptVenue, setAcceptVenue] = useState(currentLecturer.officeLocation);
  const [acceptNote, setAcceptNote] = useState('Availability confirmed. Please be punctual and bring your academic materials.');

  const [rejectingRequest, setRejectingRequest] = useState<AppointmentRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('Unavailable during this proposed time slot due to department schedule. Please re-book on my routine consultation day.');

  // Office settings
  const [editDays, setEditDays] = useState(currentLecturer.consultationDays);
  const [editOffice, setEditOffice] = useState(currentLecturer.officeLocation);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Filter requests for this lecturer
  const lecturerRequests = requests.filter(r => r.lecturerId === currentLecturer.id);
  const pendingRequests = lecturerRequests.filter(r => r.status === 'pending');
  const acceptedRequests = lecturerRequests.filter(r => r.status === 'accepted');
  const completedOrRejected = lecturerRequests.filter(r => r.status === 'completed' || r.status === 'rejected');

  const handleOpenAccept = (req: AppointmentRequest) => {
    setAcceptingRequest(req);
    setAcceptVenue(currentLecturer.officeLocation);
    setAcceptNote('Availability confirmed. Please come along with relevant materials.');
  };

  const handleConfirmAccept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptingRequest) return;
    onAcceptRequest(acceptingRequest.id, acceptNote.trim(), acceptVenue.trim());
    setAcceptingRequest(null);
  };

  const handleOpenReject = (req: AppointmentRequest) => {
    setRejectingRequest(req);
    setRejectReason('Unavailable during this proposed time slot. Please choose another consultation day.');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingRequest) return;
    onRejectRequest(rejectingRequest.id, rejectReason.trim());
    setRejectingRequest(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateOfficeHours(currentLecturer.id, editDays.trim(), editOffice.trim());
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Lecturer Identity Banner in Brown & White */}
      <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#4A2E1B]/5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={currentLecturer.avatar}
              alt={currentLecturer.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-[#D97706]/40 shadow-lg shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#4A2E1B] text-[#FDFBF7]">
                  {currentLecturer.title}
                </span>
                <span className="text-xs font-mono font-bold text-[#8C5638] bg-[#FAF7F5] px-2.5 py-0.5 rounded-full border border-[#E2D7CF]">
                  STAFF ID: {currentLecturer.staffId}
                </span>
                <span className="text-xs text-[#784728] font-medium hidden sm:inline">&bull; {currentLecturer.faculty}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2211] mt-1 tracking-tight">
                {currentLecturer.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#784728] mt-0.5">
                Department of {currentLecturer.department} &bull; {currentLecturer.officeLocation}
              </p>
            </div>
          </div>

          {/* Quick Faculty Switcher for Demo testing */}
          <div className="bg-[#FAF7F5] border border-[#E2D7CF] rounded-2xl p-3 flex items-center gap-3 w-full lg:w-auto">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-[#8C5638] block">Switch Lecturer Account</span>
              <span className="text-xs text-[#4A2E1B] font-semibold">Test other departmental desks</span>
            </div>
            <select
              value={currentLecturer.id}
              onChange={(e) => onSwitchLecturer(e.target.value)}
              className="px-3.5 py-2 bg-white border border-[#D1C2B6] rounded-xl text-xs font-bold text-[#3B2211] focus:outline-none focus:border-[#4A2E1B] cursor-pointer w-full sm:w-auto"
            >
              {allLecturers.map((lec) => (
                <option key={lec.id} value={lec.id}>
                  {lec.name} ({lec.department.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#EFE6DF]">
          <div 
            onClick={() => setActiveTab('pending')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              pendingRequests.length > 0 
                ? 'bg-amber-50 border-amber-300' 
                : 'bg-[#FAF7F5] border-[#E2D7CF]'
            }`}
          >
            <div className="text-2xl font-black font-mono text-[#D97706]">
              {pendingRequests.length}
            </div>
            <div className="text-xs font-bold text-[#4A2E1B] mt-1">Pending Review</div>
            <div className="text-[10px] text-[#784728]">Student availability proposals</div>
          </div>

          <div 
            onClick={() => setActiveTab('schedule')}
            className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] hover:border-emerald-500 transition-all cursor-pointer"
          >
            <div className="text-2xl font-black font-mono text-emerald-700">
              {acceptedRequests.length}
            </div>
            <div className="text-xs font-bold text-[#4A2E1B] mt-1">Confirmed Consultations</div>
            <div className="text-[10px] text-[#784728]">Scheduled office visits</div>
          </div>

          <div 
            onClick={() => setActiveTab('history')}
            className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] hover:border-[#4A2E1B] transition-all cursor-pointer"
          >
            <div className="text-2xl font-black font-mono text-[#4A2E1B]">
              {completedOrRejected.length}
            </div>
            <div className="text-xs font-bold text-[#4A2E1B] mt-1">Archive History</div>
            <div className="text-[10px] text-[#784728]">Past consultations</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF]">
            <div className="text-2xl font-black font-mono text-[#4A2E1B]">
              {currentLecturer.consultationDays.split('&')[0]}
            </div>
            <div className="text-xs font-bold text-[#4A2E1B] mt-1">Office Hours</div>
            <div className="text-[10px] text-[#784728] truncate">{currentLecturer.consultationDays}</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-t border-[#EFE6DF] mt-6 pt-4 gap-2 overflow-x-auto">
          {[
            { id: 'pending', label: `Pending Student Requests (${pendingRequests.length})`, icon: Clock },
            { id: 'schedule', label: `Confirmed Schedule (${acceptedRequests.length})`, icon: Calendar },
            { id: 'history', label: 'History Archive', icon: FileText },
            { id: 'settings', label: 'Office Hours & Location', icon: Settings }
          ].map((t) => {
            const Icon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#4A2E1B] text-white shadow-md'
                    : 'text-[#784728] hover:text-[#3B2211] hover:bg-[#F5EFEB]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#F59E0B]" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: PENDING STUDENT REQUESTS (REVIEW & ACCEPT/REJECT) */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2D7CF] pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#3B2211] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D97706]" />
                Review Student Appointment Requests
              </h2>
              <p className="text-xs text-[#784728]">
                Students have specified their proposed availability and reason for meeting. Accept if you will be available, or reject with alternative guidance.
              </p>
            </div>
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              {pendingRequests.length} awaiting action
            </span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#3B2211]">All student requests have been reviewed!</h3>
              <p className="text-xs text-[#784728] max-w-sm mx-auto">
                No pending requests in your queue. Whenever students submit new availability requests, they will appear right here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#EFE6DF] pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-extrabold text-[#8C5638] bg-[#FAF7F5] px-2.5 py-1 rounded-lg border border-[#E2D7CF]">
                        {req.referenceNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> Action Required
                      </span>
                    </div>

                    <span className="text-[11px] text-[#8C5638] font-mono">
                      Received: {new Date(req.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Student profile info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-[#8C5638] uppercase tracking-wider block">
                        Student Identity
                      </span>
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#4A2E1B] text-[#F59E0B] font-extrabold flex items-center justify-center text-sm shrink-0">
                          {req.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-[#3B2211]">{req.studentName}</h4>
                          <p className="text-xs text-[#784728] font-mono font-bold">
                            MATRIC: {req.studentMatric} ({req.studentLevel})
                          </p>
                          <p className="text-xs text-[#784728]">Dept of {req.studentDepartment}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[#784728] pt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#D97706]" /> {req.studentPhone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#D97706]" /> {req.studentEmail}
                        </span>
                      </div>
                    </div>

                    {/* Proposed Timing */}
                    <div className="bg-[#FAF7F5] p-4 rounded-2xl border border-[#E2D7CF] space-y-2">
                      <span className="text-[10px] font-bold text-[#8C5638] uppercase tracking-wider block">
                        Student's Proposed Availability
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-[#784728] block">Date:</span>
                          <span className="font-extrabold text-[#3B2211] text-sm">{req.proposedDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#784728] block">Time Slot:</span>
                          <span className="font-extrabold text-[#D97706] text-sm">{req.proposedTime}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-[#4A2E1B] font-medium pt-1 border-t border-[#E2D7CF]">
                        Venue Mode: {req.meetingMode}
                      </div>
                    </div>
                  </div>

                  {/* Student Reason */}
                  <div className="space-y-1.5 bg-[#FDFBF7] p-4 rounded-2xl border border-[#E2D7CF]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#4A2E1B] uppercase tracking-wider">
                        Stated Purpose:
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#4A2E1B] text-[#FDFBF7] text-xs font-bold">
                        {req.purposeCategory}
                      </span>
                      {req.courseCode && (
                        <span className="px-2 py-0.5 rounded bg-white border border-[#E2D7CF] text-xs font-mono font-bold text-[#784728]">
                          {req.courseCode}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#3B2211] italic leading-relaxed pt-1">
                      "{req.purposeDetails}"
                    </p>
                  </div>

                  {/* Accept / Reject Action Bar */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleOpenReject(req)}
                      className="px-5 py-2.5 rounded-xl border-2 border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject / State Unavailable</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAccept(req)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept & Confirm Availability</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONFIRMED SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2D7CF] pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#3B2211] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                Confirmed Consultation Appointments
              </h2>
              <p className="text-xs text-[#784728]">
                Students whose availability you have accepted. Marked meetings show on both your schedule and their portal.
              </p>
            </div>
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {acceptedRequests.length} scheduled
            </span>
          </div>

          {acceptedRequests.length === 0 ? (
            <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-12 text-center space-y-3">
              <Calendar className="w-12 h-12 text-[#8C5638] mx-auto opacity-40" />
              <h3 className="text-base font-bold text-[#3B2211]">No confirmed appointments yet</h3>
              <p className="text-xs text-[#784728]">
                Review pending requests and click "Accept" to populate your appointment calendar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {acceptedRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border-2 border-emerald-200 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#EFE6DF] pb-2">
                      <span className="font-mono text-xs font-bold text-emerald-800">
                        {req.referenceNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        Confirmed Available
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-[#3B2211]">{req.studentName}</h4>
                      <p className="text-xs text-[#784728] font-mono">
                        {req.studentMatric} &bull; {req.studentLevel} &bull; {req.studentDepartment}
                      </p>
                    </div>

                    <div className="p-3 bg-[#FAF7F5] rounded-2xl border border-[#E2D7CF] grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-[#8C5638] font-bold uppercase block">Date</span>
                        <span className="font-bold text-[#3B2211]">{req.proposedDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8C5638] font-bold uppercase block">Time</span>
                        <span className="font-bold text-[#D97706]">{req.proposedTime}</span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <span className="font-bold text-[#4A2E1B]">{req.purposeCategory}</span>
                      <p className="text-xs text-[#784728] italic">"{req.purposeDetails}"</p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 text-xs text-emerald-900 border border-emerald-200">
                      <strong>Venue:</strong> {req.confirmedVenue || req.lecturerOffice}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EFE6DF] flex items-center justify-between">
                    <span className="text-xs text-[#784728] font-mono">Phone: {req.studentPhone}</span>
                    <button
                      type="button"
                      onClick={() => onCompleteAppointment(req.id, 'Consultation concluded successfully')}
                      className="px-4 py-2 bg-[#4A2E1B] hover:bg-[#3B2211] text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                    >
                      Mark as Concluded
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HISTORY ARCHIVE */}
      {activeTab === 'history' && (
        <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-[#3B2211] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D97706]" />
            Consultation History & Past Records
          </h2>
          <p className="text-xs text-[#784728]">
            Log of concluded and rejected appointment requests for this academic session.
          </p>

          {completedOrRejected.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#784728]">
              No archived records yet.
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {completedOrRejected.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#4A2E1B]">{req.referenceNumber}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'completed'
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {req.status === 'completed' ? 'Concluded' : 'Rejected'}
                      </span>
                    </div>
                    <div className="font-bold text-[#3B2211]">
                      {req.studentName} ({req.studentMatric}) &bull; {req.purposeCategory}
                    </div>
                    {req.lecturerResponseNote && (
                      <p className="text-xs text-[#784728] italic">Note: "{req.lecturerResponseNote}"</p>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-[#8C5638] shrink-0">{req.proposedDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: OFFICE HOURS & VENUE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl">
          <div>
            <h2 className="text-lg font-bold text-[#3B2211] flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#D97706]" />
              Update Consultation Office Hours & Location
            </h2>
            <p className="text-xs text-[#784728]">
              Students see these details when browsing the faculty booking directory.
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Office hours and location updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                Departmental Office Location
              </label>
              <input
                type="text"
                value={editOffice}
                onChange={(e) => setEditOffice(e.target.value)}
                placeholder="e.g. Room 12, Computer Science HOD Block, North Campus"
                required
                className="w-full px-4 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                Routine Office Consultation Days & Hours
              </label>
              <input
                type="text"
                value={editDays}
                onChange={(e) => setEditDays(e.target.value)}
                placeholder="e.g. Tuesdays & Thursdays (10:00 AM - 1:30 PM)"
                required
                className="w-full px-4 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all"
            >
              Save Schedule Settings
            </button>
          </form>
        </div>
      )}

      {/* ACCEPT MODAL */}
      {acceptingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B2211]/60 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EFE6DF] pb-3">
              <h3 className="font-extrabold text-[#3B2211] text-base">
                Confirm Availability with {acceptingRequest.studentName}
              </h3>
              <button
                type="button"
                onClick={() => setAcceptingRequest(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#784728] space-y-1 bg-[#FAF7F5] p-3 rounded-2xl border border-[#E2D7CF]">
              <div><strong>Matric:</strong> {acceptingRequest.studentMatric} ({acceptingRequest.studentLevel})</div>
              <div><strong>Requested:</strong> {acceptingRequest.proposedDate} at {acceptingRequest.proposedTime}</div>
              <div><strong>Topic:</strong> {acceptingRequest.purposeCategory}</div>
            </div>

            <form onSubmit={handleConfirmAccept} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Confirmed Meeting Venue
                </label>
                <input
                  type="text"
                  value={acceptVenue}
                  onChange={(e) => setAcceptVenue(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Lecturer's Instructions / Confirmation Message to Student
                </label>
                <textarea
                  value={acceptNote}
                  onChange={(e) => setAcceptNote(e.target.value)}
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFE6DF]">
                <button
                  type="button"
                  onClick={() => setAcceptingRequest(null)}
                  className="px-4 py-2 rounded-xl border border-[#D1C2B6] text-xs font-bold text-[#784728]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Confirm & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B2211]/60 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EFE6DF] pb-3">
              <h3 className="font-extrabold text-[#3B2211] text-base">
                State Unavailability for {rejectingRequest.studentName}
              </h3>
              <button
                type="button"
                onClick={() => setRejectingRequest(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#784728]">
              The student will receive an instant dashboard notification explaining why you are unavailable, along with your recommended alternative date.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Reason for Unavailability & Recommended Alternative Time *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  required
                  placeholder="e.g. Attending Academic Board meeting on this date. Please re-book for Thursday 11:00 AM."
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFE6DF]">
                <button
                  type="button"
                  onClick={() => setRejectingRequest(null)}
                  className="px-4 py-2 rounded-xl border border-[#D1C2B6] text-xs font-bold text-[#784728]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Send Rejection & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
