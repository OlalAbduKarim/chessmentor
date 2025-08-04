
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : '';
  
  return (
    <div 
      className={`bg-light-surface dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border overflow-hidden ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
