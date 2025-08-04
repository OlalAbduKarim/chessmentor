import React, { useState } from 'react';
import { UserRole } from '../types';
import { Button } from './common/Button';
import { ChessBoardIcon, GoogleIcon, LoadingSpinner } from './icons/Icons';
import { auth, db } from '../services/firebase';
import firebase from '../services/firebase';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        if (!name) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        if (user) {
            // Create user profile in Firestore
            const newUserProfile = {
              id: user.uid,
              name,
              email: user.email,
              avatarUrl: `https://i.pravatar.cc/150?u=${user.uid}`,
              role,
              // Add role-specific fields if necessary
              ...(role === UserRole.COACH && {
                bio: 'New coach ready to teach!',
                rating: 1200,
                experience: 1,
                languages: ['English'],
                specialties: ['Beginner Friendly'],
                hourlyRate: 50,
                availability: {},
              }),
            };

            await db.collection("users").doc(user.uid).set(newUserProfile);
        }
      }
      // onAuthStateChanged in App.tsx will handle redirect
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        if (user) {
            // Check if the user already has a profile in Firestore
            const userRef = db.collection("users").doc(user.uid);
            const doc = await userRef.get();

            if (!doc.exists) {
                // If profile doesn't exist, create a new one with default role 'STUDENT'
                await userRef.set({
                    id: user.uid,
                    name: user.displayName,
                    email: user.email,
                    avatarUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
                    role: UserRole.STUDENT, // Default role for new Google sign-ups
                });
            }
            // If the user profile already exists, we do nothing.
            // onAuthStateChanged will handle navigating to the dashboard.
        }

    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
            <ChessBoardIcon className="w-12 h-12 text-brand-primary" />
            <h1 className="text-4xl font-bold ml-3 text-light-text-primary dark:text-dark-text-primary">ChessMentor</h1>
        </div>
        
        <div className="bg-light-surface dark:bg-dark-surface p-8 rounded-xl shadow-md border border-light-border dark:border-dark-border">
          <h2 className="text-2xl font-bold text-center text-light-text-primary dark:text-dark-text-primary mb-2">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>
          <p className="text-center text-light-text-secondary dark:text-dark-text-secondary mb-6">{isLogin ? 'Sign in to continue your journey.' : 'Join the community of learners and mentors.'}</p>
          
          <form onSubmit={handleAuthAction}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Magnus Carlsen"
                  className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary bg-light-bg dark:bg-dark-bg"
                  required={!isLogin}
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary bg-light-bg dark:bg-dark-bg"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary bg-light-bg dark:bg-dark-bg"
                required
              />
            </div>
            
            {!isLogin && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">I want to sign up as a...</label>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setRole(UserRole.STUDENT)} className={`flex-1 p-3 rounded-md border-2 transition-colors ${role === UserRole.STUDENT ? 'border-brand-primary bg-blue-50 dark:bg-blue-900/20' : 'border-light-border dark:border-dark-border hover:border-gray-400'}`}>
                            Student
                        </button>
                        <button type="button" onClick={() => setRole(UserRole.COACH)} className={`flex-1 p-3 rounded-md border-2 transition-colors ${role === UserRole.COACH ? 'border-brand-primary bg-blue-50 dark:bg-blue-900/20' : 'border-light-border dark:border-dark-border hover:border-gray-400'}`}>
                            Coach
                        </button>
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <LoadingSpinner className="w-5 h-5 animate-spin"/> : (isLogin ? 'Sign In' : `Sign Up as ${role === UserRole.STUDENT ? 'Student' : 'Coach'}`)}
            </Button>
            
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-light-border dark:border-dark-border"></div>
              <span className="flex-shrink mx-4 text-light-text-secondary dark:text-dark-text-secondary text-sm">OR</span>
              <div className="flex-grow border-t border-light-border dark:border-dark-border"></div>
            </div>

            <Button type="button" variant="secondary" className="w-full" leftIcon={<GoogleIcon className="w-5 h-5" />} onClick={handleGoogleSignIn} disabled={loading}>
              Continue with Google
            </Button>
          </form>
          
          <p className="text-center text-sm text-light-text-secondary dark:text-dark-text-secondary mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => {setIsLogin(!isLogin); setError(null);}} className="font-medium text-brand-primary hover:underline ml-1">
                {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};