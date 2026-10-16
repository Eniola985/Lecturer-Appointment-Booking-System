import React, { useState } from 'react';
import { 
  Lecturer, 
  Student, 
  AppointmentRequest, 
  SystemAnnouncement 
} from '../types/booking';
import { POLY_FACULTIES_AND_DEPTS, ADMIN_CREDENTIALS } from '../data/polyIbadanData';
import { 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Send, 
  Download, 
  BarChart2, 
  KeyRound, 
  Building2, 
  FileText,
  Tag,
  Copy,
  Check
} from 'lucide-react';

interface AdminPortalProps {
  lecturers: Lecturer[];
  students: Student[];
  requests: AppointmentRequest[];
  announcements: SystemAnnouncement[];
  onAddLecturer: (newLecturer: Lecturer) => void;
  onDeleteLecturer: (lecturerId: string) => void;
  onPostAnnouncement: (announcement: SystemAnnouncement) => void;
  onDeleteAnnouncement: (announcementId: string) => void;
}

export function AdminPortal({
  lecturers,
  students,
  requests,
  announcements,
  onAddLecturer,
  onDeleteLecturer,
  onPostAnnouncement,
  onDeleteAnnouncement
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'lecturers' | 'students' | 'announcements'>('overview');
  
  // Search states
  const [aptSearch, setAptSearch] = useState('');
  const [aptStatusFilter, setAptStatusFilter] = useState<string>('all');
  const [aptDeptFilter, setAptDeptFilter] = useState<string>('all');
  
  // New Lecturer modal
  const [showAddLecturerModal, setShowAddLecturerModal] = useState(false);
  const [lecName, setLecName] = useState('');
  const [lecTitle, setLecTitle] = useState('Senior Lecturer');
  const [lecFaculty, setLecFaculty] = useState(POLY_FACULTIES_AND_DEPTS[0].faculty);
  const [lecDept, setLecDept] = useState(POLY_FACULTIES_AND_DEPTS[0].departments[0]);
  const [lecEmail, setLecEmail] = useState('');
  const [lecStaffId, setLecStaffId] = useState('');
  const [lecOffice, setLecOffice] = useState('');
  const [lecDays, setLecDays] = useState('Tuesdays & Thursdays (10:00 AM - 1:00 PM)');
  const [lecPhone, setLecPhone] = useState('+234 800 000 0000');
  const [lecSpecialties, setLecSpecialties] = useState('');

  // New Announcement
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeTarget, setNewNoticeTarget] = useState<'all' | 'students' | 'lecturers'>('all');
  const [noticePostedSuccess, setNoticePostedSuccess] = useState(false);


  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const acceptedRequests = requests.filter(r => r.status === 'accepted').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
  const acceptanceRate = totalRequests > 0 ? Math.round((acceptedRequests / totalRequests) * 100) : 0;

  const handleFacultyChange = (fName: string) => {
    setLecFaculty(fName);
    const found = POLY_FACULTIES_AND_DEPTS.find(f => f.faculty === fName);
    if (found && found.departments.length > 0) {
      setLecDept(found.departments[0]);
    }
  };

  const handleCreateLecturer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lecName.trim() || !lecEmail.trim()) return;

    const newLec: Lecturer = {
      id: `lec-${Date.now()}`,
      staffId: lecStaffId.trim() || `TPI/STF/2026/${Math.floor(100 + Math.random() * 900)}`,
      name: lecName.trim(),
      title: lecTitle.trim(),
      email: lecEmail.trim().toLowerCase(),
      faculty: lecFaculty,
      department: lecDept,
      officeLocation: lecOffice.trim() || `Staff Wing, ${lecDept}`,
      specialties: lecSpecialties.split(',').map(s => s.trim()).filter(Boolean),
      phone: lecPhone.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isAvailable: true,
      consultationDays: lecDays.trim()
    };

    onAddLecturer(newLec);
    setShowAddLecturerModal(false);
    // Reset
    setLecName('');
    setLecEmail('');
    setLecOffice('');
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) return;

    const newAnc: SystemAnnouncement = {
      id: `anc-${Date.now()}`,
      title: newNoticeTitle.trim(),
      content: newNoticeContent.trim(),
      targetAudience: newNoticeTarget,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      postedBy: 'Directorate of Academic Affairs (Admin)',
      priority: 'important'
    };

    onPostAnnouncement(newAnc);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNoticePostedSuccess(true);
    setTimeout(() => setNoticePostedSuccess(false), 2500);
  };

  const exportRequestsCsv = () => {
    const headers = ['Reference,Matric,Student Name,Department,Level,Lecturer,Date,Time,Purpose,Status\n'];
    const rows = requests.map(r => 
      `"${r.referenceNumber}","${r.studentMatric}","${r.studentName}","${r.studentDepartment}","${r.studentLevel}","${r.lecturerName}","${r.proposedDate}","${r.proposedTime}","${r.purposeCategory}","${r.status}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `polyibadan-appointments-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered appointments
  const filteredRequests = requests.filter(r => {
    if (aptStatusFilter !== 'all' && r.status !== aptStatusFilter) return false;
    if (aptDeptFilter !== 'all' && r.studentDepartment !== aptDeptFilter && r.lecturerDepartment !== aptDeptFilter) return false;
    if (aptSearch.trim()) {
      const q = aptSearch.toLowerCase();
      const matchRef = r.referenceNumber.toLowerCase().includes(q);
      const matchStudent = r.studentName.toLowerCase().includes(q) || r.studentMatric.toLowerCase().includes(q);
      const matchLecturer = r.lecturerName.toLowerCase().includes(q);
      if (!matchRef && !matchStudent && !matchLecturer) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Administrator Institutional Header */}
      <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#4A2E1B]/5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#4A2E1B] text-[#F59E0B] flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-[#D97706]/40 shrink-0">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#4A2E1B] text-[#FDFBF7]">
                  ADMINISTRATIVE CONSOLE
                </span>
                <span className="text-xs text-[#8C5638] font-mono font-bold">THE POLYTECHNIC, IBADAN</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2211] mt-1 tracking-tight">
                Academic Affairs Master Registry
              </h1>
              <p className="text-xs sm:text-sm text-[#784728] mt-0.5">
                Central control for student bookings, faculty availability records, and institution-wide notices.
              </p>
            </div>
          </div>

          {/* Administrative Status Badge */}
          <div className="bg-[#FAF7F5] border border-[#E2D7CF] rounded-2xl p-3 px-4 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C5638] block">Academic Affairs Console</span>
              <span className="text-xs text-[#4A2E1B] font-bold">Registry Management Active</span>
            </div>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 mt-6 border-t border-[#EFE6DF]">
          <div 
            onClick={() => setActiveTab('students')}
            className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] hover:border-[#4A2E1B] transition-all cursor-pointer"
          >
            <div className="text-2xl font-black font-mono text-[#4A2E1B]">{students.length}</div>
            <div className="text-xs font-bold text-[#784728] mt-1">Students</div>
            <div className="text-[10px] text-[#8C5638]">Registered accounts</div>
          </div>

          <div 
            onClick={() => setActiveTab('lecturers')}
            className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] hover:border-[#4A2E1B] transition-all cursor-pointer"
          >
            <div className="text-2xl font-black font-mono text-[#4A2E1B]">{lecturers.length}</div>
            <div className="text-xs font-bold text-[#784728] mt-1">Faculty Staff</div>
            <div className="text-[10px] text-[#8C5638]">Active lecturers</div>
          </div>

          <div 
            onClick={() => setActiveTab('appointments')}
            className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] hover:border-[#D97706] transition-all cursor-pointer"
          >
            <div className="text-2xl font-black font-mono text-[#D97706]">{totalRequests}</div>
            <div className="text-xs font-bold text-[#784728] mt-1">Total Bookings</div>
            <div className="text-[10px] text-[#8C5638]">Submitted requests</div>
          </div>

          <div 
            onClick={() => { setActiveTab('appointments'); setAptStatusFilter('pending'); }}
            className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] hover:border-amber-500 transition-all cursor-pointer"
          >
            <div className="text-2xl font-black font-mono text-amber-700">{pendingRequests}</div>
            <div className="text-xs font-bold text-[#784728] mt-1">Pending</div>
            <div className="text-[10px] text-[#8C5638]">Awaiting response</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] col-span-2 sm:col-span-1">
            <div className="text-2xl font-black font-mono text-emerald-700">{acceptanceRate}%</div>
            <div className="text-xs font-bold text-[#784728] mt-1">Acceptance Rate</div>
            <div className="text-[10px] text-[#8C5638]">{acceptedRequests} confirmed</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-t border-[#EFE6DF] mt-6 pt-4 gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'System Overview', icon: BarChart2 },
            { id: 'appointments', label: `Master Appointments (${totalRequests})`, icon: Calendar },
            { id: 'lecturers', label: `Manage Lecturers (${lecturers.length})`, icon: Building2 },
            { id: 'students', label: `Registered Students (${students.length})`, icon: GraduationCap },
            { id: 'announcements', label: `Notices & Broadcasts (${announcements.length})`, icon: Tag }
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

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Breakdown Card */}
            <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm">
              <h3 className="font-extrabold text-[#3B2211] text-base flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#D97706]" />
                Appointment Status Distribution
              </h3>

              <div className="space-y-3 pt-1">
                {[
                  { label: 'Accepted by Lecturer', count: acceptedRequests, color: 'bg-emerald-600', text: 'text-emerald-700' },
                  { label: 'Pending Lecturer Review', count: pendingRequests, color: 'bg-amber-500', text: 'text-amber-700' },
                  { label: 'Unavailable / Declined', count: rejectedRequests, color: 'bg-rose-600', text: 'text-rose-700' },
                  { label: 'Completed Consultations', count: requests.filter(r => r.status === 'completed').length, color: 'bg-[#4A2E1B]', text: 'text-[#4A2E1B]' }
                ].map((item, i) => {
                  const pct = totalRequests > 0 ? Math.round((item.count / totalRequests) * 100) : 0;
                  return (
                    <div key={i} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-[#3B2211]">{item.label}</span>
                        <span className={item.text}>{item.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#FAF7F5] rounded-full h-2.5 overflow-hidden border border-[#E2D7CF]">
                        <div className={`${item.color} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions & Export */}
            <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-extrabold text-[#3B2211] text-base flex items-center gap-2">
                  <Download className="w-5 h-5 text-[#D97706]" />
                  Academic Reports & Export
                </h3>
                <p className="text-xs text-[#784728] leading-relaxed">
                  Download institutional appointment audit logs, consultation histories, and student inquiry reports in CSV format for official university documentation.
                </p>

                <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#784728]">Academic Session:</span>
                    <strong className="text-[#3B2211]">2025/2026 Session</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#784728]">Current Semester:</span>
                    <strong className="text-[#3B2211]">Second Semester</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#784728]">Campus:</span>
                    <strong className="text-[#3B2211]">North & South Campus Combined</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EFE6DF] flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={exportRequestsCsv}
                  className="flex-1 py-3 px-4 bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#F59E0B]" />
                  <span>Export Master Registry (CSV)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLecturerModal(true)}
                  className="py-3 px-4 bg-[#FAF7F5] border border-[#D1C2B6] hover:bg-[#EFE6DF] text-[#4A2E1B] font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#D97706]" />
                  <span>Add Faculty Member</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER APPOINTMENT REGISTRY */}
      {activeTab === 'appointments' && (
        <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#EFE6DF] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#3B2211] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D97706]" />
                Institution-wide Appointment Registry
              </h2>
              <p className="text-xs text-[#784728]">
                Audit log of all student-lecturer appointment requests across The Polytechnic, Ibadan.
              </p>
            </div>

            <button
              type="button"
              onClick={exportRequestsCsv}
              className="px-4 py-2 bg-[#FAF7F5] border border-[#D1C2B6] hover:bg-[#EFE6DF] text-[#4A2E1B] font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C5638] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={aptSearch}
                onChange={(e) => setAptSearch(e.target.value)}
                placeholder="Search reference, student matric, or lecturer..."
                className="w-full pl-10 pr-4 py-2 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
              />
            </div>

            <select
              value={aptStatusFilter}
              onChange={(e) => setAptStatusFilter(e.target.value)}
              className="px-3 py-2 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
            >
              <option value="all">All Appointment Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="accepted">Accepted / Confirmed</option>
              <option value="rejected">Rejected / Unavailable</option>
              <option value="completed">Completed Consultations</option>
            </select>

            <select
              value={aptDeptFilter}
              onChange={(e) => setAptDeptFilter(e.target.value)}
              className="px-3 py-2 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
            >
              <option value="all">All Departments</option>
              {POLY_FACULTIES_AND_DEPTS.flatMap(f => f.departments).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-[#E2D7CF] rounded-2xl overflow-hidden">
              <thead className="bg-[#FAF7F5] border-b border-[#E2D7CF] text-[#8C5638] uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Ref No</th>
                  <th className="py-3 px-4">Student & Matric</th>
                  <th className="py-3 px-4">Lecturer</th>
                  <th className="py-3 px-4">Proposed Schedule</th>
                  <th className="py-3 px-4">Topic Category</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE6DF]">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#4A2E1B] whitespace-nowrap">
                      {req.referenceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#3B2211]">{req.studentName}</div>
                      <div className="text-[11px] font-mono text-[#784728]">{req.studentMatric} ({req.studentLevel})</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#3B2211]">{req.lecturerName}</div>
                      <div className="text-[11px] text-[#784728]">{req.lecturerDepartment}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-bold text-[#3B2211]">{req.proposedDate}</div>
                      <div className="text-[11px] text-[#D97706] font-mono">{req.proposedTime}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-[#4A2E1B] truncate">{req.purposeCategory}</div>
                      <div className="text-[11px] text-[#784728] italic truncate">"{req.purposeDetails}"</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {req.status === 'accepted' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Accepted
                        </span>
                      )}
                      {req.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Pending
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                          Rejected
                        </span>
                      )}
                      {req.status === 'completed' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE LECTURERS */}
      {activeTab === 'lecturers' && (
        <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EFE6DF] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#3B2211] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#D97706]" />
                Polytechnic Faculty Staff Directory
              </h2>
              <p className="text-xs text-[#784728]">
                Add new faculty members, update departmental offices, and maintain consultation credentials.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddLecturerModal(true)}
              className="px-5 py-2.5 bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-[#F59E0B]" />
              <span>Add New Lecturer</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lecturers.map((lec) => (
              <div
                key={lec.id}
                className="p-5 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={lec.avatar}
                      alt={lec.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#D97706]/40"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#D97706] uppercase block">
                        {lec.title}
                      </span>
                      <h4 className="font-extrabold text-[#3B2211] text-sm truncate">{lec.name}</h4>
                      <p className="text-[11px] text-[#784728] truncate">{lec.department}</p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 font-mono text-[#8C5638] bg-white p-2.5 rounded-xl border border-[#E2D7CF]">
                    <div>STAFF ID: <strong className="text-[#3B2211]">{lec.staffId}</strong></div>
                    <div className="truncate">EMAIL: {lec.email}</div>
                    <div className="truncate">OFFICE: {lec.officeLocation}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EFE6DF] flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#784728] truncate">{lec.consultationDays}</span>
                  <button
                    type="button"
                    onClick={() => onDeleteLecturer(lec.id)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                    title="Remove Lecturer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REGISTERED STUDENTS */}
      {activeTab === 'students' && (
        <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-[#EFE6DF] pb-4">
            <h2 className="text-lg font-bold text-[#3B2211] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#D97706]" />
              Registered Student Accounts
            </h2>
            <p className="text-xs text-[#784728]">
              All students registered on the appointment booking system with their official matriculation numbers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {students.map((stu) => {
              const stuReqs = requests.filter(r => r.studentId === stu.id || r.studentMatric === stu.matricNumber);
              return (
                <div
                  key={stu.id}
                  className="p-5 rounded-2xl bg-[#FAF7F5] border border-[#E2D7CF] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#4A2E1B] text-[#FDFBF7]">
                      {stu.level}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#D97706] bg-white px-2 py-0.5 rounded border border-[#E2D7CF]">
                      {stu.matricNumber}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-[#3B2211] text-sm">{stu.fullName}</h4>
                    <p className="text-xs text-[#784728]">Dept of {stu.department}</p>
                    <p className="text-[11px] text-[#8C5638] font-mono">{stu.email}</p>
                  </div>

                  <div className="pt-2 border-t border-[#EFE6DF] flex items-center justify-between text-xs">
                    <span className="text-[#784728]">Appointments Booked:</span>
                    <span className="font-bold text-[#4A2E1B] font-mono">{stuReqs.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: BROADCAST NOTICES */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Post notice form */}
          <div className="lg:col-span-5 bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
            <div>
              <h3 className="font-extrabold text-[#3B2211] text-base flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#D97706]" />
                Broadcast Official Notice
              </h3>
              <p className="text-xs text-[#784728]">
                Publish institutional academic advisories to students and lecturers.
              </p>
            </div>

            {noticePostedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Notice broadcasted live across all dashboards!</span>
              </div>
            )}

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Notice Title *
                </label>
                <input
                  type="text"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="e.g. Rescheduled Consultation Hours for Examination Week"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Target Audience
                </label>
                <select
                  value={newNoticeTarget}
                  onChange={(e) => setNewNoticeTarget(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B]"
                >
                  <option value="all">Everyone (Students & Lecturers)</option>
                  <option value="students">Students Only</option>
                  <option value="lecturers">Lecturers Only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">
                  Notice Details / Content *
                </label>
                <textarea
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  rows={4}
                  placeholder="Type the full text of the announcement..."
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] focus:outline-none focus:border-[#4A2E1B] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Publish Official Notice</span>
              </button>
            </form>
          </div>

          {/* Active notices list */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-extrabold text-[#3B2211] text-base">Active Broadcast Notices</h3>
            <div className="space-y-3">
              {announcements.map((anc) => (
                <div
                  key={anc.id}
                  className="bg-white border-2 border-[#E2D7CF] rounded-2xl p-5 space-y-2 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#4A2E1B]">{anc.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F5] border border-[#E2D7CF] text-[#8C5638] uppercase">
                        {anc.targetAudience}
                      </span>
                    </div>
                    <p className="text-xs text-[#784728] leading-relaxed">{anc.content}</p>
                    <div className="text-[10px] font-mono text-[#8C5638] pt-1">
                      Posted on {anc.date} by {anc.postedBy}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteAnnouncement(anc.id)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 transition-colors cursor-pointer shrink-0"
                    title="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD LECTURER MODAL */}
      {showAddLecturerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B2211]/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-2 border-[#E2D7CF] rounded-3xl p-6 sm:p-8 max-w-xl w-full my-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EFE6DF] pb-3">
              <h3 className="font-extrabold text-[#3B2211] text-base">
                Add Faculty Member to Booking Directory
              </h3>
              <button
                type="button"
                onClick={() => setShowAddLecturerModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLecturer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">Title</label>
                  <input
                    type="text"
                    value={lecTitle}
                    onChange={(e) => setLecTitle(e.target.value)}
                    placeholder="e.g. Chief Lecturer or Dr."
                    required
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">Full Name</label>
                  <input
                    type="text"
                    value={lecName}
                    onChange={(e) => setLecName(e.target.value)}
                    placeholder="e.g. Engr. Dr. K. O. Alao"
                    required
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">Faculty</label>
                  <select
                    value={lecFaculty}
                    onChange={(e) => handleFacultyChange(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211]"
                  >
                    {POLY_FACULTIES_AND_DEPTS.map(f => (
                      <option key={f.faculty} value={f.faculty}>{f.faculty}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">Department</label>
                  <select
                    value={lecDept}
                    onChange={(e) => setLecDept(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211]"
                  >
                    {POLY_FACULTIES_AND_DEPTS.find(f => f.faculty === lecFaculty)?.departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">Staff Email</label>
                  <input
                    type="email"
                    value={lecEmail}
                    onChange={(e) => setLecEmail(e.target.value)}
                    placeholder="lecturer@polyibadan.edu.ng"
                    required
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">Staff ID</label>
                  <input
                    type="text"
                    value={lecStaffId}
                    onChange={(e) => setLecStaffId(e.target.value)}
                    placeholder="TPI/STF/2026/..."
                    className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">Departmental Office Location</label>
                <input
                  type="text"
                  value={lecOffice}
                  onChange={(e) => setLecOffice(e.target.value)}
                  placeholder="e.g. Room 05, Engineering Complex, North Campus"
                  required
                  className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A2E1B]">Office Consultation Days</label>
                <input
                  type="text"
                  value={lecDays}
                  onChange={(e) => setLecDays(e.target.value)}
                  placeholder="e.g. Tuesdays & Thursdays (10:00 AM - 1:00 PM)"
                  className="w-full px-3 py-2 bg-[#FAF7F5] border border-[#D1C2B6] rounded-xl text-xs text-[#3B2211]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EFE6DF]">
                <button
                  type="button"
                  onClick={() => setShowAddLecturerModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#D1C2B6] text-xs font-bold text-[#784728]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4A2E1B] hover:bg-[#3B2211] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Save Lecturer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
