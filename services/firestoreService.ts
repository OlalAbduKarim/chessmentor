import { db } from './firebase';
import { User, Coach, Course, Session, UserRole } from '../types';

// Fetch a single user profile from 'users' collection
export const getUserProfile = async (uid: string): Promise<User | null> => {
    const userDocRef = db.collection('users').doc(uid);
    const userDocSnap = await userDocRef.get();
    if (userDocSnap.exists) {
        return { id: userDocSnap.id, ...userDocSnap.data() } as User;
    }
    return null;
};

// Fetch all coaches
export const getCoaches = async (): Promise<Coach[]> => {
    const coachesCol = db.collection('users');
    const q = coachesCol.where("role", "==", UserRole.COACH);
    const coachesSnapshot = await q.get();
    return coachesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coach));
};


// Fetch a single coach profile
export const getCoachProfile = async (uid: string): Promise<Coach | null> => {
    const user = await getUserProfile(uid);
    if (user && user.role === UserRole.COACH) {
        return user as Coach;
    }
    return null;
}

// Fetch all courses
export const getCourses = async (): Promise<Course[]> => {
    const coursesCol = db.collection('courses');
    const coursesSnapshot = await coursesCol.get();
    return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
};


// Fetch all courses for a specific coach
export const getCoachCourses = async (coachId: string): Promise<Course[]> => {
    const coursesCol = db.collection('courses');
    const q = coursesCol.where("coachId", "==", coachId);
    const coursesSnapshot = await q.get();
    return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
};

// Create a map of coach IDs to names for quick lookups
export const getCoachMap = async (): Promise<Map<string, string>> => {
    const coaches = await getCoaches();
    const map = new Map<string, string>();
    coaches.forEach(coach => {
        map.set(coach.id, coach.name);
    });
    return map;
};

// Book a new session
export const bookSession = async (sessionData: Omit<Session, 'id'>): Promise<Session> => {
    const newSessionRef = db.collection("sessions").doc();
    const newSession = { ...sessionData, id: newSessionRef.id };
    await newSessionRef.set(newSession);
    return newSession;
};

// Get sessions for a user (either as a student or coach)
export const getUserSessions = async (userId: string): Promise<Session[]> => {
    const sessionsCol = db.collection('sessions');
    const studentQuery = sessionsCol.where("studentId", "==", userId);
    const coachQuery = sessionsCol.where("coachId", "==", userId);
    
    const [studentSnapshot, coachSnapshot] = await Promise.all([
        studentQuery.get(),
        coachQuery.get()
    ]);
    
    const sessions = [
        ...studentSnapshot.docs.map(doc => doc.data() as Session),
        ...coachSnapshot.docs.map(doc => doc.data() as Session)
    ];

    // Remove duplicates if a user is both student and coach in same session (unlikely)
    const uniqueSessions = Array.from(new Set(sessions.map(s => s.id)))
        .map(id => sessions.find(s => s.id === id)!);
        
    // Sort by start time
    return uniqueSessions.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
};