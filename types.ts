export interface AppUser {
  id: string;
  name: string;
  email?: string;
  role?: 'Student' | 'Coach';
  avatarUrl: string;
  country: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  bio?: string;
  followers?: string[];
  following?: string[];
}

export interface Coach {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  bio: string;
  country: string;
}

export interface Course {
  id: string;
  title: string;
  thumbnailUrl: string;
  coach: Coach;
  rating: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass';
  isFree: boolean;
  topic: 'Openings' | 'Midgame' | 'Endgame' | 'Strategy';
}

export interface LiveSession {
  id: string;
  title: string;
  coach: Coach;
  startTime: Date;
  status: 'Live' | 'Upcoming' | 'Past';
}

export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: any; // Firestore Timestamp
}
