import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  success?: boolean;
}

export function Button({ loading, success, children, className = '', ...props }: ButtonProps) {
  if (success) {
    return (
      <button
        disabled
        className={`w-full py-[14px] rounded-[10px] text-[15px] font-semibold font-dm-sans flex items-center justify-center gap-2 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] bg-[rgba(37,211,102,0.15)] border border-[rgba(37,211,102,0.3)] text-[#25D366] ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        w-full py-[14px] bg-[#D4A853] text-[#050507] rounded-[10px] text-[15px] font-semibold font-dm-sans flex items-center justify-center gap-2
        transition-[transform,background,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]
        hover:bg-[#E0B968] active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin-slow opacity-60" /> : children}
    </button>
  );
}
