import React from 'react';

interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="flex bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[10px] p-[3px]">
      {options.map((opt) => {
        const isSelected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`
              flex-1 py-[9px] rounded-[8px] text-[13px] font-medium
              transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]
              active:scale-[0.97]
              ${isSelected
                ? 'bg-[rgba(212,168,83,0.12)] border border-[rgba(212,168,83,0.25)] text-[#D4A853]'
                : 'text-[rgba(239,239,239,0.35)] hover:text-[#EFEFEF] border border-transparent'}
            `}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
