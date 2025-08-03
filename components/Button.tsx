
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold py-2 px-4 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark';
  
  const variantStyles = {
    primary: 'bg-brand-accent text-white hover:bg-opacity-90 focus:ring-brand-accent',
    secondary: 'bg-brand-secondary text-brand-light hover:bg-opacity-90 focus:ring-brand-secondary',
    outline: 'bg-transparent border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white focus:ring-brand-accent',
  };

  const widthStyle = fullWidth ? 'w-full' : 'w-auto';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
