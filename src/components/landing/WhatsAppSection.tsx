'use client';

import React from 'react';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';
import NightGlobe from './NightGlobe';

export default function WhatsAppSection() {
  return (
    <section className="py-[140px] bg-[#050505] overflow-hidden relative font-['DM_Sans']">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Informational Content */}
        <div className="space-y-10 z-10">
          <div className="space-y-4">
            <span className="text-[11px] font-medium tracking-[0.10em] uppercase text-[#F59E0B] bg-[rgba(212,168,83,0.08)] px-3 py-1.5 rounded-full border border-[rgba(212,168,83,0.15)]">
              Global Infrastructure
            </span>
            <h2 className="font-['Playfair_Display'] font-black text-[clamp(38px,5vw,72px)] tracking-tight text-[#EFEFEF] leading-[0.90]">
              Your AI starts earning immediately.
            </h2>
            <p className="text-[17px] text-[rgba(239,239,239,0.50)] font-normal leading-[1.70] max-w-xl">
              Every message answered. Every order captured. Every payment collected — the moment you connect.
            </p>
          </div>

          {/* Live Activity Card */}
          <div className="p-6 rounded-[16px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.025)] backdrop-blur-[60px] saturate-[200%] space-y-6 max-w-xl">
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#25D366] shadow-[0_0_6px_#25D366]" />
                <span className="text-[13px] font-medium text-[#EFEFEF]">Connected ✓</span>
              </div>
              <span className="text-[11px] font-medium tracking-[0.04em] uppercase text-[rgba(239,239,239,0.3)]">
                Live Stream
              </span>
            </div>

            <div className="space-y-4">
              {/* Order Notification Row */}
              <div className="flex items-start gap-4 bg-[rgba(212,168,83,0.04)] border border-[rgba(212,168,83,0.1)] rounded-[12px] p-4">
                <div className="w-10 h-10 rounded-[10px] bg-[rgba(212,168,83,0.08)] border border-[rgba(212,168,83,0.15)] flex items-center justify-center shrink-0">
                  <CreditCard size={18} color="#F59E0B" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[15px] font-semibold text-[#EFEFEF]">New Order</p>
                    <span className="text-[12px] font-semibold text-[#25D366]">Paid ✓</span>
                  </div>
                  <p className="text-[13px] text-[rgba(239,239,239,0.5)]">
                    $89.00 · Black Bomber Jacket · Size M
                  </p>
                </div>
              </div>

              {/* Chat Simulation Row */}
              <div className="bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.04)] rounded-[12px] p-4 space-y-3">
                <div className="text-left">
                  <span className="inline-block bg-[rgba(255,255,255,0.05)] rounded-[14px] rounded-tl-none px-3 py-2 text-[13px] text-[#EFEFEF] max-w-[85%]">
                    Is the Black Bomber Jacket in Size M still available?
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-[rgba(212,168,83,0.1)] text-[#F5D78E] rounded-[14px] rounded-tr-none px-3 py-2 text-[13px] max-w-[85%] text-left">
                    Yes, we have 3 items left in stock. I have reserved one for you and sent your secure payment link above!
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <Link
              href="/sign-up"
              className="px-6 py-3.5 bg-[#F59E0B] hover:bg-[#E0B968] rounded-[10px] text-[#050505] text-[15px] font-semibold transition-all duration-150 outline-none"
            >
              Start Free Trial
            </Link>
          </div>
        </div>

        {/* Right 3D Globe */}
        <div className="relative w-full flex items-center justify-center">
          <NightGlobe />
        </div>

      </div>
    </section>
  );
}
