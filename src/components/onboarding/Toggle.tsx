import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        w-[44px] h-[24px] rounded-[12px] p-[2px] flex items-center
        transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${checked ? 'bg-[#D4A853]' : 'bg-[rgba(255,255,255,0.10)]'}
      `}
    >
      <div
        className={`
          w-[20px] h-[20px] bg-white rounded-full shadow-sm
          transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${checked ? 'translate-x-[20px]' : 'translate-x-0'}
        `}
      />
    </button>
  );
}
