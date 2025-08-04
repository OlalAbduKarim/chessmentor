import React from 'react';
import { LoadingSpinner } from '../icons/Icons';

interface LoadingProps {
    message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <LoadingSpinner className="w-10 h-10 animate-spin text-brand-primary mb-4" />
      <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">{message}</p>
    </div>
  );
};
