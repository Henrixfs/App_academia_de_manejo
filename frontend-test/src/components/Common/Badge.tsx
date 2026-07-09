import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

export default function Badge({
  children,
  variant = 'primary'
}: BadgeProps) {
  const bgColor = {
    primary: 'bg-primary/20 text-primary',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    danger: 'bg-danger/20 text-danger'
  }[variant];

  return (
    <span className={`badge inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {children}
    </span>
  );
}