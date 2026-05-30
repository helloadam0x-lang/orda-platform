'use client';

import React from 'react';
import Link from 'next/link';

interface AuthShellProps {
  children: React.ReactNode;
}

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="w-full min-h-screen bg-[#050507] flex font-['DM_Sans'] select-none">
      {/* Left Form Panel */}
      <div className="w-full lg:w-[55%] xl:w-[50%] bg-[#050507] flex flex-col justify-between p-8 md:p-12 lg:p-16 relative z-10">
        <header className="w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 group"
            style={{ transition: 'transform 150ms cubic-bezier(0.23,1,0.32,1)' }}
          >
            <span className="font-['Playfair_Display'] font-black text-2xl tracking-tight text-[#EFEFEF]">
              ORDA<span className="text-[#D4A853]">.</span>
            </span>
          </Link>
        </header>

        <main className="w-full max-w-[400px] mx-auto my-auto py-12">
          {children}
        </main>

        <footer className="w-full text-left">
          <p className="text-[11px] font-medium tracking-[0.10em] uppercase text-[rgba(239,239,239,0.22)]">
            © 2026 ORDA Labs Inc. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Right Cinematic Panel */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-[50%] bg-[#050507] relative flex-col justify-between p-16 overflow-hidden"
        style={{
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          background: 'radial-gradient(ellipse at 65% 25%, rgba(212,168,83,0.07) 0%, transparent 55%), #050507'
        }}
      >
        <div className="w-full" />

        <div className="w-full max-w-[540px] space-y-8 animate-auth-float">
          <blockquote className="font-['Playfair_Display'] font-black text-[clamp(32px,3.5vw,48px)] tracking-tight text-[#EFEFEF] leading-[1.05]">
            "Orda replied to 47 customers and took 12 orders while I was asleep."
          </blockquote>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#D4A853] flex items-center justify-center font-bold text-[#050507] text-sm shadow-[0_4px_20px_rgba(212,168,83,0.15)]">
              A
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#EFEFEF] leading-none mb-1">Amara K.</p>
              <p className="text-[13px] text-[rgba(239,239,239,0.50)] leading-none">Boutique owner · Kampala</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1.5 rounded-full text-[11px] font-medium tracking-[0.04em] text-[#EFEFEF] bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)] backdrop-blur-md">
            2M+ messages
          </span>
          <span className="px-3 py-1.5 rounded-full text-[11px] font-medium tracking-[0.04em] text-[#EFEFEF] bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)] backdrop-blur-md">
            54 countries
          </span>
          <span className="px-3 py-1.5 rounded-full text-[11px] font-medium tracking-[0.04em] text-[#EFEFEF] bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)] backdrop-blur-md">
            500+ businesses
          </span>
        </div>

        <div
          className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
      </div>
    </div>
  );
}
