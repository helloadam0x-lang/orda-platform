import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PersonalityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

export function PersonalityCard({ icon: Icon, title, description, selected, onClick, style }: PersonalityCardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`
        w-full p-[20px_24px] rounded-[16px] cursor-pointer flex items-center justify-between
        transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]
        active:scale-[0.98]
        ${selected
          ? 'bg-[rgba(212,168,83,0.06)] border border-[rgba(212,168,83,0.30)]'
          : 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)]'}
      `}
    >
      <div className="flex items-center gap-4">
        <div className="w-[40px] h-[40px] bg-[rgba(212,168,83,0.10)] rounded-[10px] flex items-center justify-center text-[#D4A853]">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-[15px] font-medium text-[#EFEFEF] mb-[2px]">{title}</h4>
          <p className="text-[13px] text-[rgba(239,239,239,0.45)] leading-tight">{description}</p>
        </div>
      </div>
      <div className={`
        w-[20px] h-[20px] rounded-full border-[2px] flex items-center justify-center flex-shrink-0
        transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${selected ? 'border-[#D4A853]' : 'border-[rgba(255,255,255,0.2)]'}
      `}>
        {selected && <div className="w-[10px] h-[10px] bg-[#D4A853] rounded-full" />}
      </div>
    </div>
  );
}
