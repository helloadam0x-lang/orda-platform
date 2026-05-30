'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
}

export default function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: FieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full space-y-2">
      <label className="block text-[12px] font-medium tracking-[0.04em] uppercase text-[rgba(239,239,239,0.5)]">
        {label}
      </label>
      <div className="relative w-full">
        <input
          type={computedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)] rounded-[10px] px-4 py-[13px] text-[#EFEFEF] text-[15px] leading-normal font-normal placeholder-[rgba(239,239,239,0.22)] outline-none transition-all duration-[150ms] focus:border-[rgba(212,168,83,0.45)]"
          style={{ boxShadow: 'none' }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 text-[rgba(239,239,239,0.3)] hover:text-[#EFEFEF] transition-colors duration-150 outline-none"
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={1.5} />
            ) : (
              <Eye size={18} strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
