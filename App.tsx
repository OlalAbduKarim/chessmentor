import React, { useState, useCallback, useEffect } from 'react';
import { User, UserRole, CourseLevel } from './types';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';
import AuthScreen from './components/AuthScreen';
import LearnerDashboard from './components/LearnerDashboard';
import CourseDiscovery from './components/CourseDiscovery';
import { auth } from './firebase';

enum AppState {
  DASHBOARD,
  COURSE_DISCOVERY,
  // COACH_DASHBOARD would be another state
}

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.DASHBOARD);
  
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    return localStorage.getItem('hasOnboarded') === 'true';
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // In a real app, role and level would be fetched from a database (e.g., Firestore)
        // Using localStorage as a substitute for this project.
        const role = localStorage.getItem(`userRole_${firebaseUser.uid}`) as UserRole || UserRole.LEARNER;
        const level = localStorage.getItem(`userLevel_${firebaseUser.uid}`) as CourseLevel || CourseLevel.BEGINNER;

        const currentUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Chess Player',
          role: role,
          level: role === UserRole.LEARNER ? level : undefined,
        };
        setUser(currentUser);
        setAppState(AppState.DASHBOARD);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
        await auth.signOut();
        // The onAuthStateChanged listener will handle setting the user to null.
    } catch (error) {
        console.error("Error signing out: ", error);
    }
  }, []);

  const handleCompleteOnboarding = useCallback(() => {
    localStorage.setItem('hasOnboarded', 'true');
    setHasOnboarded(true);
  }, []);

  const handleRevisitOnboarding = useCallback(() => {
    localStorage.removeItem('hasOnboarded');
    setHasOnboarded(false);
  }, []);

  const handleBrowseCourses = useCallback(() => {
    setAppState(AppState.COURSE_DISCOVERY);
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setAppState(AppState.DASHBOARD);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (!hasOnboarded) {
    return <Onboarding onComplete={handleCompleteOnboarding} />;
  }

  if (!user) {
    return <AuthScreen onRevisitOnboarding={handleRevisitOnboarding} />;
  }

  // --- Authenticated App ---
  
  const renderContent = () => {
    switch (appState) {
      case AppState.DASHBOARD:
        if (user.role === UserRole.LEARNER) {
          return <LearnerDashboard user={user} onBrowseCourses={handleBrowseCourses} onLogout={handleLogout} />;
        }
        // Add CoachDashboard here when ready
        return <div>Coach Dashboard (Coming Soon)</div>;

      case AppState.COURSE_DISCOVERY:
          return <CourseDiscovery 
            user={user} 
            onBack={handleBackToDashboard}
            onLogoutClick={handleLogout}
          />;
      default:
        // Fallback to dashboard
        return <LearnerDashboard user={user} onBrowseCourses={handleBrowseCourses} onLogout={handleLogout} />;
    }
  };

  return <div className="antialiased">{renderContent()}</div>;
};

export default App;