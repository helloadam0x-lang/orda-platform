import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

export function CategoryCard({ icon: Icon, label, selected, onClick, style }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={style}
      className={`
        flex flex-col items-center justify-center w-[80px] h-[80px] rounded-xl border
        transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]
        hover:scale-[1.03] active:scale-[0.97]
        ${selected
          ? 'bg-[rgba(212,168,83,0.10)] border-[rgba(212,168,83,0.35)] text-[#D4A853] shadow-[0_0_20px_rgba(212,168,83,0.08)]'
          : 'bg-[rgba(255,255,255,0.025)] border-[rgba(255,255,255,0.07)] text-[rgba(239,239,239,0.40)] hover:border-[rgba(255,255,255,0.14)]'}
      `}
    >
      <Icon className="w-6 h-6 mb-2" strokeWidth={selected ? 2.5 : 1.5} />
      <span className="text-[11px] font-medium leading-none">{label}</span>
    </button>
  );
}
