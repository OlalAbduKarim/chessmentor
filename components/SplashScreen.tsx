
import React from 'react';

interface SplashScreenProps {
  // No longer needs onComplete, as it's shown based on loading state
}

const ChessPieceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C10.8954 2 10 2.89543 10 4V6H14V4C14 2.89543 13.1046 2 12 2Z" />
        <path d="M9 7V9H15V7H9Z" />
        <path d="M8 10H16L17 14H7L8 10Z" />
        <path d="M6 15H18V17H6V15Z" />
        <path d="M5 18H19V20H5V18Z" />
        <path d="M4 21H20V22H4V21Z" />
    </svg>
);

const SplashScreen: React.FC<SplashScreenProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark text-brand-light">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <ChessPieceIcon className="w-24 h-24 text-brand-light" />
        <h1 className="text-5xl font-bold font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>ChessMentor</h1>
        <p className="text-lg text-gray-300">Your Personal AI Chess Coach</p>
      </div>
    </div>
  );
};

export default SplashScreen;