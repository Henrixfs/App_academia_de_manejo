import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClickBackdrop}>
        <div className="relative w-full max-w-md mx-4 p-5 bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-white">{/* Title will be passed in children */}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              &times;
            </button>
          </div>
          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </>
  );

  function onClickBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
}