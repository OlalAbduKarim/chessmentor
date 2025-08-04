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
import { auth } from './services/firebase';
import { getUserProfile } from './services/firestoreService';
import { LoadingSpinner } from './components/icons/Icons';

export const AppContext = React.createContext<AppContextType | null>(null);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>(Page.AUTH);
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (userProfile) {
            setUser(userProfile);
            setPage(userProfile.role === UserRole.STUDENT ? Page.STUDENT_DASHBOARD : Page.COACH_DASHBOARD);
          } else {
            // New user signed up, profile might not be created yet.
            // Auth component handles profile creation.
            // Or this is a state where logout should happen if profile is missing.
            setUser(null);
            setPage(Page.AUTH);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
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

  // Login is handled by onAuthStateChanged, so the login function in context can be a no-op or removed
  // if all login logic is within the Auth component. For now, we'll leave it as part of the context signature.
  const appContextValue: AppContextType = useMemo(() => ({
    user,
    role: user?.role || null,
    login: () => {}, // Firebase handles this
    logout,
    page,
    pageData,
    setPage: handleSetPage,
  }), [user, logout, page, pageData, handleSetPage]);

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
                    onBack={() => handleSetPage(Page.COACH_PROFILE, { coachId: pageData.course.coachId })}
                />;
      case Page.SCHEDULE:
        return <SchedulePage user={user} setPage={handleSetPage} />;
      case Page.SESSION_VIEW:
        return <SessionView session={pageData.session} onBack={() => handleSetPage(Page.SCHEDULE)} />;
      case Page.AUTH:
      default:
        return <Auth />;
    }
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <div className="min-h-screen font-sans text-light-text-primary dark:text-dark-text-primary">
        {user && (
            <Header user={user} logout={logout} setPage={handleSetPage} currentRole={user.role} />
        )}
        <main>
          {renderContent()}
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;