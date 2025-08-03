
import React from 'react';
import { User } from '../types';
import Button from './Button';

interface HeaderProps {
  user: User | null;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onDashboardClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogoutClick, onDashboardClick }) => {
  return (
    <header className="bg-brand-primary p-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
          ChessMentor
        </h1>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="text-right">
                <p className="text-sm text-brand-light">Welcome, {user.name}</p>
                {user.role === 'LEARNER' && user.level && (
                  <p className="text-xs text-brand-accent font-semibold">{user.level} Player</p>
                )}
                {user.role === 'COACH' && (
                    <p className="text-xs text-brand-accent font-semibold">Coach</p>
                )}
              </div>
              <div className="relative group">
                <img
                    src={`https://i.pravatar.cc/150?u=${user.email}`}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border-2 border-brand-accent cursor-pointer"
                />
                <div className="absolute right-0 mt-2 w-48 bg-brand-secondary rounded-md shadow-lg py-1 z-20 hidden group-hover:block transition-opacity duration-300">
                  {onDashboardClick && (
                    <button onClick={onDashboardClick} className="block w-full text-left px-4 py-2 text-sm text-brand-light hover:bg-brand-primary">Dashboard</button>
                  )}
                  <button onClick={onLogoutClick} className="block w-full text-left px-4 py-2 text-sm text-brand-light hover:bg-brand-primary">Logout</button>
                </div>
              </div>
            </>
          ) : (
            <Button onClick={onLoginClick} variant="primary">
              Log In / Sign Up
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;