import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { User, UserRole, Page, AppContextType, Coach, Course } from './types';
import { Auth } from './components/Auth';
import { StudentDashboard } from './components/StudentDashboard';
import { Header } from './components/Header';
import { ExplorePage } from './components/ExplorePage';
import { CoachProfile } from './components/CoachProfile';
import { CourseView } from './components/CourseView';
import { CoachDashboard } from './components/CoachDashboard';
import { SchedulePage } from './components/SchedulePage';
import { SessionView } from './components/SessionView';
import { auth, db } from './services/firebase';
import { getUserProfile, seedDatabase } from './services/firestoreService';
import { LoadingSpinner } from './components/icons/Icons';

export const AppContext = React.createContext<AppContextType | null>(null);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>(Page.AUTH);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedPrefs = window.localStorage.getItem('theme');
      if (storedPrefs === 'light' || storedPrefs === 'dark') {
        return storedPrefs;
      }
      const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (userMedia.matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Effect to apply the theme class to the root element and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // On initial app load, check if the database needs to be seeded with mock data.
    seedDatabase();

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let userProfile = await getUserProfile(firebaseUser.uid);
          
          if (!userProfile) {
            // If user exists in Firebase Auth but not in our Firestore db,
            // create a default student profile for them. This makes the app resilient
            // and fixes the race condition on new sign-ups.
            console.warn(`User ${firebaseUser.uid} found in Auth but not in Firestore. Creating default profile.`);
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'New User',
              email: firebaseUser.email!,
              avatarUrl: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
              role: UserRole.STUDENT,
            };
            await db.collection('users').doc(firebaseUser.uid).set(newUser);
            userProfile = newUser;
          }
    
          setUser(userProfile);
          setPage(userProfile.role === UserRole.STUDENT ? Page.STUDENT_DASHBOARD : Page.COACH_DASHBOARD);
          
        } catch (error) {
          console.error("Error during auth state change:", error);
          await auth.signOut();
          setUser(null);
          setPage(Page.AUTH);
        }
      } else {
        setUser(null);
        setPage(Page.AUTH);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  const logout = useCallback(async () => {
    await auth.signOut();
    setUser(null);
    setPage(Page.AUTH);
    setPageData(null);
  }, []);

  const handleSetPage = useCallback(<T,>(newPage: Page, data?: T) => {
    setPage(newPage);
    setPageData(data || null);
    window.scrollTo(0, 0);
  }, []);

  const appContextValue: AppContextType = useMemo(() => ({
    user,
    role: user?.role || null,
    login: () => {}, // Firebase handles this
    logout,
    page,
    pageData,
    setPage: handleSetPage,
    theme,
    toggleTheme,
  }), [user, logout, page, pageData, handleSetPage, theme, toggleTheme]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner className="w-12 h-12 animate-spin text-brand-primary" />
        </div>
      );
    }

    if (!user) {
      return <Auth />;
    }

    switch (page) {
      case Page.STUDENT_DASHBOARD:
        return <StudentDashboard user={user} setPage={handleSetPage} />;
      case Page.COACH_DASHBOARD:
        return <CoachDashboard user={user as Coach} setPage={handleSetPage} />;
      case Page.EXPLORE:
        return <ExplorePage onSelectCoach={(coach: Coach) => handleSetPage(Page.COACH_PROFILE, { coach })} />;
      case Page.COACH_PROFILE:
        return <CoachProfile 
                    coach={pageData?.coach} 
                    coachId={pageData?.coachId}
                    onBack={() => handleSetPage(Page.EXPLORE)}
                    onViewCourse={(course: Course) => handleSetPage(Page.COURSE_VIEW, { course })}
                    setPage={handleSetPage}
                />;
      case Page.COURSE_VIEW:
        return <CourseView 
                    course={pageData.course}
                    onBack={() => handleSetPage(Page.COACH_PROFILE, { coachId: pageData.course.courseId })}
                />;
      case Page.SCHEDULE:
        return <SchedulePage user={user} setPage={handleSetPage} />;
      case Page.SESSION_VIEW:
        return <SessionView session={pageData.session} onBack={() => handleSetPage(Page.SCHEDULE)} />;
      case Page.AUTH:
      default:
        // Failsafe: If a user is logged in, always show a dashboard, never the Auth page.
        return user.role === UserRole.STUDENT 
            ? <StudentDashboard user={user} setPage={handleSetPage} /> 
            : <CoachDashboard user={user as Coach} setPage={handleSetPage} />;
    }
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <div className="min-h-screen font-sans text-light-text-primary dark:text-dark-text-primary">
        {user && (
            <Header 
                user={user} 
                logout={logout} 
                setPage={handleSetPage} 
                currentRole={user.role} 
                currentPage={page} 
            />
        )}
        <main>
          {renderContent()}
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;