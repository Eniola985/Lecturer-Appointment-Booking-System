export type StudentLevel = 'ND I' | 'ND II' | 'HND I' | 'HND II';

export interface Student {
  id: string;
  matricNumber: string; // e.g. "2024/ND/CSC/0842"
  fullName: string;
  email: string;
  password?: string;
  department: string;
  faculty: string;
  level: StudentLevel;
  phone: string;
  avatar?: string;
  registeredAt: string;
}

export interface Lecturer {
  id: string;
  staffId: string; // e.g. "TPI/STF/2018/042"
  name: string;
  title: string; // e.g. "Chief Lecturer", "Dr. (Mrs.)", "Engr."
  email: string;
  password?: string;
  department: string;
  faculty: string;
  officeLocation: string; // e.g. "Room 14, CS Complex, North Campus"
  specialties: string[];
  phone: string;
  avatar: string;
  isAvailable: boolean;
  consultationDays: string; // e.g. "Tuesdays & Thursdays (10:00 AM - 2:00 PM)"
}

export type AppointmentStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export type PurposeCategory = 
  | 'Project / Thesis Supervision'
  | 'Continuous Assessment (CA) / Test Query'
  | 'Assignment & Coursework Guidance'
  | 'SIWES / Industrial Training Logbook'
  | 'Course Registration & Clearance'
  | 'General Academic Mentorship';

export interface AppointmentRequest {
  id: string;
  referenceNumber: string; // e.g. "TPI-APT-2026-9041"
  studentId: string;
  studentMatric: string;
  studentName: string;
  studentEmail: string;
  studentDepartment: string;
  studentLevel: StudentLevel;
  studentPhone: string;
  
  lecturerId: string;
  lecturerName: string;
  lecturerDepartment: string;
  lecturerOffice: string;
  
  proposedDate: string; // YYYY-MM-DD
  proposedTime: string; // e.g. "10:00 AM - 11:00 AM"
  purposeCategory: PurposeCategory;
  purposeDetails: string;
  courseCode?: string; // e.g. "COM 311"
  meetingMode: 'Physical (Lecturer Office)' | 'Faculty Staff Room' | 'Virtual / Phone Call';
  
  status: AppointmentStatus;
  lecturerResponseNote?: string; // Feedback from lecturer when accepting/rejecting
  confirmedVenue?: string;
  confirmedDateTime?: string;
  
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // studentId or lecturerId or "admin"
  userType: 'student' | 'lecturer' | 'admin';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  appointmentId?: string;
  statusType?: 'accepted' | 'rejected' | 'pending' | 'info';
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'students' | 'lecturers';
  date: string;
  postedBy: string;
  priority: 'normal' | 'important';
}
