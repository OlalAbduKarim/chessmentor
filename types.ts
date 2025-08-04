export enum UserRole {
  STUDENT = 'STUDENT',
  COACH = 'COACH',
}

export interface User {
  id: string; // Firebase UID
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
}

export interface Coach extends User {
  bio: string;
  rating: number;
  experience: number; // years
  languages: string[];
  specialties: string[];
  hourlyRate: number;
  availability: Record<string, string[]>; // e.g., { "2024-08-20": ["09:00", "11:00"] }
}

export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  description: string;
  pgn: string; // PGN for interactive board
}

export interface Course {
  id: string;
  title: string;
  description: string;
  coachId: string;
  level: CourseLevel;
  lessons: Lesson[];
  price: number;
}

export interface Session {
  id: string;
  studentId: string;
  coachId: string;
  studentName: string;
  coachName: string;
  studentAvatar: string;
  coachAvatar: string;
  startTime: string; // ISO string for dates to work well with Firestore
  duration: number; // minutes
  status: 'upcoming' | 'completed' | 'cancelled';
}

export enum Page {
  AUTH,
  STUDENT_DASHBOARD,
  COACH_DASHBOARD,
  EXPLORE,
  COACH_PROFILE,
  COURSE_VIEW,
  SESSION_VIEW,
  SCHEDULE,
}

export interface AppContextType {
  user: User | null;
  role: UserRole | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  page: Page;
  pageData: any;
  setPage: <T,>(page: Page, data?: T) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}