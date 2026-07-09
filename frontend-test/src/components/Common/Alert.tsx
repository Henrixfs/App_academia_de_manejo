import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  children: React.ReactNode;
}

export default function Alert({ type, onClose, children }: AlertProps) {
  const bgColor = {
    success: 'bg-green-500/20 border-l-4 border-green-500',
    error: 'bg-red-500/20 border-l-4 border-red-500',
    warning: 'bg-yellow-500/20 border-l-4 border-yellow-500',
    info: 'bg-blue-500/20 border-l-4 border-blue-500'
  }[type];

  const textColor = {
    success: 'text-green-400',
    error: 'text-red-500',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }[type];

  return (
    <div className={`alert flex items-start p-4 mb-4 rounded-lg ${bgColor}`}>
      <div className="flex-shrink-0">
        {/* Icon based on type */}
        {type === 'success' && (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {type === 'error' && (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {type === 'warning' && (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {type === 'info' && (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      <div className="ml-3">
        <div className={textColor}>{children}</div>
        <button
          onClick={onClose}
          className="ml-2 text-xs underline hover:no-underline"
        >
          ×
        </button>
      </div>
    </div>
  );
}