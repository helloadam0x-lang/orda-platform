import React from 'react';
import { OrdaLogo } from '../shared/OrdaLogo';
import Link from 'next/link';

interface ShellProps {
  children: React.ReactNode;
  step: number;
}

export function OnboardingShell({ children, step }: ShellProps) {
  const progressWidth = `${(step / 3) * 100}%`;

  return (
    <div className="min-h-screen bg-[#050507] flex flex-col relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[rgba(255,255,255,0.06)] z-50">
        <div
          className="h-full bg-[#D4A853] transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ width: progressWidth }}
        />
      </div>

      {/* Header */}
      <header className="w-full flex items-center justify-between p-6 md:p-8 absolute top-0 z-40">
        <OrdaLogo />
        <Link
          href="/dashboard"
          className="text-[14px] text-[rgba(239,239,239,0.50)] hover:text-[#EFEFEF] transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
        >
          Exit setup
        </Link>
      </header>

      {/* Content — pt-24 clears the absolute header */}
      <main className="flex-1 flex items-center justify-center p-6 pt-24 w-full max-w-[520px] mx-auto z-10">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
