import { Lecturer, Student, AppointmentRequest, SystemAnnouncement } from '../types/booking';

export const ADMIN_CREDENTIALS = {
  email: 'admin@polyibadan.edu.ng',
  password: 'Admin@PolyIbadan2026',
  name: 'Academic Affairs Admin',
  role: 'admin'
};

export const LECTURER_DEFAULT_PASSWORD = 'lecturer123';

export const POLY_FACULTIES_AND_DEPTS = [
  {
    faculty: 'Faculty of Science',
    departments: ['Computer Science', 'Mathematics & Statistics', 'Science Laboratory Technology (SLT)', 'Applied Chemistry', 'Physics with Electronics']
  },
  {
    faculty: 'Faculty of Engineering',
    departments: ['Electrical & Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Computer Engineering', 'Mechatronics Engineering']
  },
  {
    faculty: 'Faculty of Financial Management Studies (FFMS)',
    departments: ['Accountancy', 'Banking & Finance', 'Insurance']
  },
  {
    faculty: 'Faculty of Business & Communication Studies (FBCS)',
    departments: ['Business Administration', 'Mass Communication', 'Public Administration', 'Marketing', 'Office Technology & Management']
  },
  {
    faculty: 'Faculty of Environmental Studies',
    departments: ['Architecture', 'Estate Management', 'Urban & Regional Planning', 'Quantity Surveying', 'Building Technology']
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    matricNumber: '2024/ND/CSC/0842',
    fullName: 'Haleelat Adebayo',
    email: 'adebayohaleelat6@gmail.com',
    password: 'password123',
    department: 'Computer Science',
    faculty: 'Faculty of Science',
    level: 'ND II',
    phone: '+234 812 345 6789',
    registeredAt: '2024-11-10'
  },
  {
    id: 'stu-2',
    matricNumber: '2023/HND/EEE/0194',
    fullName: 'Babatunde Olumide Alabi',
    email: 'babatunde.alabi@student.polyibadan.edu.ng',
    password: 'password123',
    department: 'Electrical & Electronics Engineering',
    faculty: 'Faculty of Engineering',
    level: 'HND II',
    phone: '+234 803 987 6543',
    registeredAt: '2023-12-05'
  },
  {
    id: 'stu-3',
    matricNumber: '2024/ND/ACC/0512',
    fullName: 'Zainab Folake Olawale',
    email: 'zainab.olawale@student.polyibadan.edu.ng',
    password: 'password123',
    department: 'Accountancy',
    faculty: 'Faculty of Financial Management Studies (FFMS)',
    level: 'ND I',
    phone: '+234 814 555 1234',
    registeredAt: '2024-11-18'
  }
];

export const INITIAL_LECTURERS: Lecturer[] = [
  {
    id: 'lec-1',
    staffId: 'TPI/STF/2012/045',
    name: 'Engr. Dr. O. A. Babalola',
    title: 'Chief Lecturer & Head of Department',
    email: 'o.babalola@polyibadan.edu.ng',
    department: 'Computer Science',
    faculty: 'Faculty of Science',
    officeLocation: 'Room 12, Computer Science HOD Block, North Campus',
    specialties: ['Database Systems', 'Software Engineering', 'System Analysis', 'Final Year ND/HND Projects'],
    phone: '+234 802 334 1122',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    consultationDays: 'Tuesdays & Thursdays (10:00 AM - 1:30 PM)'
  },
  {
    id: 'lec-2',
    staffId: 'TPI/STF/2015/108',
    name: 'Dr. (Mrs.) F. O. Adeleke',
    title: 'Principal Lecturer',
    email: 'f.adeleke@polyibadan.edu.ng',
    department: 'Computer Science',
    faculty: 'Faculty of Science',
    officeLocation: 'Office 08, Staff Wing A, North Campus',
    specialties: ['Web Technologies', 'Programming in Java/C++', 'Object-Oriented Design', 'SIWES Coordinator'],
    phone: '+234 805 771 9900',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    consultationDays: 'Mondays & Wednesdays (11:00 AM - 2:00 PM)'
  },
  {
    id: 'lec-3',
    staffId: 'TPI/STF/2010/019',
    name: 'Mr. K. T. Oloyede',
    title: 'Senior Lecturer',
    email: 'k.oloyede@polyibadan.edu.ng',
    department: 'Mathematics & Statistics',
    faculty: 'Faculty of Science',
    officeLocation: 'Math Departmental Complex, South Campus',
    specialties: ['Calculus & Differential Equations', 'Numerical Methods', 'Statistical Quality Control'],
    phone: '+234 803 221 4455',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    consultationDays: 'Tuesdays & Fridays (9:00 AM - 12:00 PM)'
  },
  {
    id: 'lec-4',
    staffId: 'TPI/STF/2014/083',
    name: 'Engr. M. B. Sanusi',
    title: 'Chief Lecturer',
    email: 'm.sanusi@polyibadan.edu.ng',
    department: 'Electrical & Electronics Engineering',
    faculty: 'Faculty of Engineering',
    officeLocation: 'Engineering Workshop Block B, North Campus',
    specialties: ['Control Systems', 'Power Electronics', 'Renewable Energy Integration', 'HND Project Supervision'],
    phone: '+234 806 112 3344',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    consultationDays: 'Wednesdays & Thursdays (1:00 PM - 4:00 PM)'
  },
  {
    id: 'lec-5',
    staffId: 'TPI/STF/2017/142',
    name: 'Mrs. B. A. Oladipo',
    title: 'Principal Lecturer',
    email: 'b.oladipo@polyibadan.edu.ng',
    department: 'Accountancy',
    faculty: 'Faculty of Financial Management Studies (FFMS)',
    officeLocation: 'Room 204, FFMS Academic Block, South Campus',
    specialties: ['Financial Accounting', 'Auditing & Investigation', 'Taxation Practice'],
    phone: '+234 807 445 6677',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    consultationDays: 'Mondays & Thursdays (10:00 AM - 1:00 PM)'
  },
  {
    id: 'lec-6',
    staffId: 'TPI/STF/2016/099',
    name: 'Dr. A. J. Ogundele',
    title: 'Senior Lecturer',
    email: 'a.ogundele@polyibadan.edu.ng',
    department: 'Mass Communication',
    faculty: 'Faculty of Business & Communication Studies (FBCS)',
    officeLocation: 'Broadcasting Studio Wing, FBCS Complex',
    specialties: ['Broadcast Journalism', 'Media Ethics & Law', 'Public Relations Campaigns'],
    phone: '+234 813 998 7766',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    isAvailable: true,
    consultationDays: 'Tuesdays & Wednesdays (12:00 PM - 3:00 PM)'
  }
];

export const INITIAL_REQUESTS: AppointmentRequest[] = [
  {
    id: 'req-101',
    referenceNumber: 'TPI-APT-2026-9041',
    studentId: 'stu-1',
    studentMatric: '2024/ND/CSC/0842',
    studentName: 'Haleelat Adebayo',
    studentEmail: 'adebayohaleelat6@gmail.com',
    studentDepartment: 'Computer Science',
    studentLevel: 'ND II',
    studentPhone: '+234 812 345 6789',
    
    lecturerId: 'lec-1',
    lecturerName: 'Engr. Dr. O. A. Babalola',
    lecturerDepartment: 'Computer Science',
    lecturerOffice: 'Room 12, Computer Science HOD Block, North Campus',
    
    proposedDate: '2026-10-20',
    proposedTime: '11:00 AM - 11:30 AM',
    purposeCategory: 'Project / Thesis Supervision',
    purposeDetails: 'Sir, I would like to present my ND II final project proposal on "Design and Implementation of an Automated Result Processing System for PolyIbadan" and discuss Chapter 1 methodology.',
    courseCode: 'COM 228 (Project)',
    meetingMode: 'Physical (Lecturer Office)',
    
    status: 'accepted',
    lecturerResponseNote: 'Proposal approved for discussion. Come along with your printed questionnaire sample and Entity-Relationship Diagram.',
    confirmedVenue: 'Room 12, Computer Science HOD Block, North Campus',
    confirmedDateTime: '2026-10-20 at 11:00 AM',
    createdAt: '2026-10-14T10:15:00Z',
    updatedAt: '2026-10-14T15:30:00Z'
  },
  {
    id: 'req-102',
    referenceNumber: 'TPI-APT-2026-9082',
    studentId: 'stu-1',
    studentMatric: '2024/ND/CSC/0842',
    studentName: 'Haleelat Adebayo',
    studentEmail: 'adebayohaleelat6@gmail.com',
    studentDepartment: 'Computer Science',
    studentLevel: 'ND II',
    studentPhone: '+234 812 345 6789',
    
    lecturerId: 'lec-2',
    lecturerName: 'Dr. (Mrs.) F. O. Adeleke',
    lecturerDepartment: 'Computer Science',
    lecturerOffice: 'Office 08, Staff Wing A, North Campus',
    
    proposedDate: '2026-10-21',
    proposedTime: '12:00 PM - 12:30 PM',
    purposeCategory: 'Continuous Assessment (CA) / Test Query',
    purposeDetails: 'Ma, I observed a discrepancy on the recently pasted Continuous Assessment score sheet for COM 221 (Java Programming) and brought my marked test booklet for verification.',
    courseCode: 'COM 221',
    meetingMode: 'Physical (Lecturer Office)',
    
    status: 'pending',
    createdAt: '2026-10-15T09:45:00Z'
  },
  {
    id: 'req-103',
    referenceNumber: 'TPI-APT-2026-8819',
    studentId: 'stu-2',
    studentMatric: '2023/HND/EEE/0194',
    studentName: 'Babatunde Olumide Alabi',
    studentEmail: 'babatunde.alabi@student.polyibadan.edu.ng',
    studentDepartment: 'Electrical & Electronics Engineering',
    studentLevel: 'HND II',
    studentPhone: '+234 803 987 6543',
    
    lecturerId: 'lec-4',
    lecturerName: 'Engr. M. B. Sanusi',
    lecturerDepartment: 'Electrical & Electronics Engineering',
    lecturerOffice: 'Engineering Workshop Block B, North Campus',
    
    proposedDate: '2026-10-16',
    proposedTime: '02:00 PM - 02:45 PM',
    purposeCategory: 'SIWES / Industrial Training Logbook',
    purposeDetails: 'Submission and endorsement of HND SIWES logbook and industrial supervisor evaluation form.',
    courseCode: 'EEE 310',
    meetingMode: 'Faculty Staff Room',
    
    status: 'rejected',
    lecturerResponseNote: 'I will be on an external accreditation visit to another institution on Friday. Please re-book for next Wednesday afternoon between 1:30 PM and 3:30 PM.',
    createdAt: '2026-10-13T12:00:00Z',
    updatedAt: '2026-10-14T08:20:00Z'
  }
];

export const INITIAL_ANNOUNCEMENTS: SystemAnnouncement[] = [
  {
    id: 'anc-1',
    title: 'Advisory Office Hours for 2nd Semester 2025/2026 Academic Session',
    content: 'All ND and HND students are reminded that consultation with course lecturers and project supervisors must be booked via this portal at least 24 hours in advance. Walk-ins without confirmation are discouraged.',
    targetAudience: 'all',
    date: '14 Oct 2026',
    postedBy: 'Academic Affairs Directorate',
    priority: 'important'
  },
  {
    id: 'anc-2',
    title: 'SIWES / Industrial Training Logbook Defence Notice',
    content: 'Students due for SIWES logbook signing must ensure all employer seals are stamped prior to booking appointment with their departmental coordinators.',
    targetAudience: 'students',
    date: '12 Oct 2026',
    postedBy: 'Centre for Industrial Liaison & Placement',
    priority: 'normal'
  }
];
