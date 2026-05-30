'use client';

import React from 'react';
import { ArrowLeft, Briefcase, Smile, Crown, CheckCircle } from 'lucide-react';
import { PersonalityCard } from './PersonalityCard';
import { Toggle } from './Toggle';
import { Button } from '../shared/Button';
import { OnboardingData } from '@/app/onboarding/page';

interface StepThreeProps {
  data: OnboardingData;
  onUpdate: (field: keyof OnboardingData, value: any) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  success: boolean;
}

export function StepThree({ data, onUpdate, onSubmit, onBack, loading, success }: StepThreeProps) {
  return (
    <div className="w-full relative">
      <button
        onClick={onBack}
        className="absolute -top-[60px] left-0 flex items-center gap-1 text-[13px] text-[rgba(239,239,239,0.35)] hover:text-[#EFEFEF] transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mb-10 text-center">
        <p className="text-[11px] font-medium tracking-[0.10em] uppercase text-[rgba(239,239,239,0.28)] mb-4">Step 3 of 3</p>
        <h1 className="font-playfair font-black text-[clamp(36px,4vw,52px)] leading-tight tracking-[-0.03em] mb-3">How should your AI speak?</h1>
        <p className="text-[15px] text-[rgba(239,239,239,0.45)] leading-[1.65]">Choose the tone your AI uses with every customer.</p>
      </div>

      <div className="space-y-4 mb-8">
        <PersonalityCard
          icon={Briefcase}
          title="Professional"
          description="Clear, efficient, and business-like. Best for retail and services."
          selected={data.personality === 'professional'}
          onClick={() => onUpdate('personality', 'professional')}
          style={{ transitionDelay: '0ms' }}
        />
        <PersonalityCard
          icon={Smile}
          title="Friendly"
          description="Warm, conversational, and approachable. Best for boutiques and food."
          selected={data.personality === 'friendly'}
          onClick={() => onUpdate('personality', 'friendly')}
          style={{ transitionDelay: '50ms' }}
        />
        <PersonalityCard
          icon={Crown}
          title="Luxury"
          description="Refined, attentive, and elevated. Best for premium brands."
          selected={data.personality === 'luxury'}
          onClick={() => onUpdate('personality', 'luxury')}
          style={{ transitionDelay: '100ms' }}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between py-2 border-t border-[rgba(255,255,255,0.07)]">
          <div>
            <div className="text-[15px] font-medium text-[#EFEFEF]">AI replies automatically</div>
            <div className="text-[13px] text-[rgba(239,239,239,0.35)] mt-1">Turn off to review messages before sending</div>
          </div>
          <Toggle checked={data.autoReply} onChange={(val) => onUpdate('autoReply', val)} />
        </div>

        <div className="py-2 border-t border-[rgba(255,255,255,0.07)]">
          <div className="text-[15px] font-medium text-[#EFEFEF]">When is your business open?</div>
          <div className="text-[13px] text-[rgba(239,239,239,0.35)] mt-1 mb-4">Outside these hours, AI adds a note about response times.</div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[11px] uppercase tracking-wider text-[rgba(239,239,239,0.35)] mb-2">Opens</label>
              <input
                type="time"
                value={data.openTime}
                onChange={(e) => onUpdate('openTime', e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)] rounded-[10px] px-[15px] py-[12px] text-[#EFEFEF] text-[15px] outline-none transition-[border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus:border-[rgba(212,168,83,0.45)] focus:ring-[3px] focus:ring-[rgba(212,168,83,0.07)]"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] uppercase tracking-wider text-[rgba(239,239,239,0.35)] mb-2">Closes</label>
              <input
                type="time"
                value={data.closeTime}
                onChange={(e) => onUpdate('closeTime', e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.07)] rounded-[10px] px-[15px] py-[12px] text-[#EFEFEF] text-[15px] outline-none transition-[border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus:border-[rgba(212,168,83,0.45)] focus:ring-[3px] focus:ring-[rgba(212,168,83,0.07)]"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 relative">
          {success && (
            <div className="absolute inset-0 pointer-events-none flex justify-center items-center z-50">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-[#D4A853] rounded-full"
                  style={{
                    animation: 'particleBurst 600ms cubic-bezier(0.23,1,0.32,1) forwards',
                    '--tx': `${(Math.random() - 0.5) * 100}px`,
                    '--ty': `${(Math.random() - 0.5) * 100}px`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}

          <Button onClick={onSubmit} loading={loading} success={success}>
            {success ? (
              <><CheckCircle className="w-5 h-5" /> You're live.</>
            ) : (
              'Launch My AI Agent →'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
