import React, { forwardRef } from 'react';

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full bg-[rgba(255,255,255,0.025)] border rounded-[10px] px-[15px] py-[12px]
          text-[#EFEFEF] text-[15px] outline-none
          transition-[border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]
          focus:border-[rgba(212,168,83,0.45)] focus:ring-[3px] focus:ring-[rgba(212,168,83,0.07)]
          placeholder:text-[rgba(239,239,239,0.35)]
          ${error ? 'border-red-500/50' : 'border-[rgba(255,255,255,0.07)]'}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Field.displayName = 'Field';
