
export enum UserRole {
  LEARNER = 'LEARNER',
  COACH = 'COACH',
  ADMIN = 'ADMIN',
}

export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  PRO = 'Pro',
}

export interface User {
  uid: string;
  email: string | null;
  name: string;
  role: UserRole;
  level?: CourseLevel;
}

export interface Course {
  id: number;
  title: string;
  coach: {
    name: string;
    rating: number;
  };
  level: CourseLevel;
  price: number;
  duration: string;
  language: string;
  imageUrl: string;
}

export interface OnboardingSlide {
  title: string;
  description: string;
  icon: React.ReactNode;
}