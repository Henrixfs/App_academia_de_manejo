import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        button button-${variant} button-${size}
        ${fullWidth ? 'w-full' : ''}
        ${isLoading || disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? '⏳ Cargando...' : children}
    </button>
  );
}