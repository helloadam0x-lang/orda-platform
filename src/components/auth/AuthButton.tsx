'use client';

import React from 'react';

interface AuthButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function AuthButton({
  children,
  onClick,
  loading = false,
  disabled = false,
}: AuthButtonProps) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-3.5 bg-[#D4A853] hover:bg-[#E0B968] disabled:opacity-60 disabled:cursor-not-allowed rounded-[10px] text-[#050507] text-[15px] font-semibold flex items-center justify-center gap-2 border-none outline-none select-none"
      style={{
        transition: 'transform 150ms cubic-bezier(0.23,1,0.32,1), opacity 150ms cubic-bezier(0.23,1,0.32,1), background-color 150ms cubic-bezier(0.23,1,0.32,1)'
      }}
      onMouseDown={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'scale(0.97)';
        }
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'none';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
      }}
    >
      {loading ? (
        <div className="w-5 h-5 rounded-full border-[2px] border-transparent border-t-[#050507] animate-spin-slow" />
      ) : (
        children
      )}
    </button>
  );
}
