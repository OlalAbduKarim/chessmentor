import React, { useState } from 'react';
import { UserRole, CourseLevel } from '../types';
import Button from './Button';
import { auth } from '../firebase';

interface AuthScreenProps {
  onRevisitOnboarding: () => void;
}

type AuthMode = 'login' | 'signup';

const AuthScreen: React.FC<AuthScreenProps> = ({ onRevisitOnboarding }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [role, setRole] = useState<UserRole>(UserRole.LEARNER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (authMode === 'signup') {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        if (userCredential.user) {
            await userCredential.user.updateProfile({ displayName: name });
            // Persist role choice. In a real app, this would be in a database like Firestore.
            localStorage.setItem(`userRole_${userCredential.user.uid}`, role);
            if(role === UserRole.LEARNER) {
                localStorage.setItem(`userLevel_${userCredential.user.uid}`, CourseLevel.BEGINNER);
            }
        }
      } else {
        await auth.signInWithEmailAndPassword(email, password);
      }
      // onAuthStateChanged in App.tsx will handle the rest.
    } catch (err: any) {
      const errorCode = err.code;
      const errorMessage = err.message.replace('Firebase: ', '').replace(`(${errorCode}).`, '');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputStyles = "w-full px-4 py-3 bg-brand-secondary border border-gray-600 rounded-md text-brand-light focus:outline-none focus:ring-2 focus:ring-brand-accent disabled:opacity-50";
  const labelStyles = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-brand-primary p-8 rounded-lg shadow-2xl relative">
        <button 
          onClick={onRevisitOnboarding} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <h2 className="text-3xl font-bold text-center text-brand-light mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <p className="text-center text-gray-400 mb-8">Let's start the journey on ChessMentor.</p>
        
        <div className="flex bg-brand-secondary rounded-md p-1 mb-6">
          <button
            onClick={() => setRole(UserRole.LEARNER)}
            className={`w-1/2 py-2 rounded ${role === UserRole.LEARNER ? 'bg-brand-accent text-white' : 'text-gray-300'} transition-colors duration-300`}
          >
            I'm a Learner
          </button>
          <button
            onClick={() => setRole(UserRole.COACH)}
            className={`w-1/2 py-2 rounded ${role === UserRole.COACH ? 'bg-brand-accent text-white' : 'text-gray-300'} transition-colors duration-300`}
          >
            I'm a Coach
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {authMode === 'signup' && (
             <div>
                <label htmlFor="name" className={labelStyles}>Full Name</label>
                <input type="text" id="name" required className={inputStyles} placeholder="Alex Doe" value={name} onChange={e => setName(e.target.value)} disabled={isLoading} />
            </div>
          )}
          <div>
            <label htmlFor="email" className={labelStyles}>Email Address</label>
            <input type="email" id="email" required className={inputStyles} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
          </div>
          <div>
            <label htmlFor="password" className={labelStyles}>Password</label>
            <input type="password" id="password" required className={inputStyles} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading}/>
          </div>
          
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Processing...' : (authMode === 'signup' ? 'Sign Up' : 'Log In')}
          </Button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(null); }}
            className="text-sm text-brand-accent hover:underline"
            disabled={isLoading}
          >
            {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;