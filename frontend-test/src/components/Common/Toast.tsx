import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type = 'info', onClose }: ToastProps) {
  const bgColor = {
    success: 'bg-green-500/20 text-green-400',
    error: 'bg-red-500/20 text-red-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/20 text-blue-400'
  }[type];

  return (
    <div className={`toast flex items-center p-4 mb-4 rounded-lg border-l-4 ${bgColor}`}>
      <div className="flex-1">{message}</div>
      <button onClick={onClose} className="text-white/50 hover:text-white ml-4">
        &times;
      </button>
    </div>
  );
}