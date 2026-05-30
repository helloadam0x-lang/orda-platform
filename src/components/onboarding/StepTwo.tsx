'use client';

import React, { useState } from 'react';
import { ArrowLeft, Shield, ChevronDown } from 'lucide-react';
import { Field } from '../shared/Field';
import { Button } from '../shared/Button';
import { OnboardingData } from '@/app/onboarding/page';

interface StepTwoProps {
  data: OnboardingData;
  onUpdate: (field: keyof OnboardingData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const COUNTRY_CODES = [
  { code: '+256', flag: '🇺🇬', name: 'Uganda' },
  { code: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+1',   flag: '🇺🇸', name: 'USA' },
  { code: '+44',  flag: '🇬🇧', name: 'UK' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+27',  flag: '🇿🇦', name: 'South Africa' },
];

export function StepTwo({ data, onUpdate, onNext, onBack }: StepTwoProps) {
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleContinue = () => {
    if (data.phone.replace(/\D/g, '').length < 7) {
      setError(true);
      setTimeout(() => setError(false), 400);
      return;
    }
    onNext();
  };

  return (
    <div className={`w-full relative ${error ? 'animate-shake' : ''}`}>
      <button
        onClick={onBack}
        className="absolute -top-[60px] left-0 flex items-center gap-1 text-[13px] text-[rgba(239,239,239,0.35)] hover:text-[#EFEFEF] transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mb-10 text-center">
        <p className="text-[11px] font-medium tracking-[0.10em] uppercase text-[rgba(239,239,239,0.28)] mb-4">Step 2 of 3</p>
        <h1 className="font-playfair font-black text-[clamp(36px,4vw,52px)] leading-tight tracking-[-0.03em] mb-3">Your WhatsApp number.</h1>
        <p className="text-[15px] text-[rgba(239,239,239,0.45)] leading-[1.65]">This is the number your AI agent will answer on.<br/>Use your WhatsApp Business number.</p>
      </div>

      <div className="space-y-6">
        <div
          className={`
            flex items-stretch bg-[rgba(255,255,255,0.025)] border rounded-[10px]
            transition-[border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]
            ${focused ? 'border-[rgba(212,168,83,0.45)] ring-[3px] ring-[rgba(212,168,83,0.07)]' : error ? 'border-red-500/50' : 'border-[rgba(255,255,255,0.07)]'}
          `}
        >
          <div className="relative w-[100px] border-r border-[rgba(255,255,255,0.07)]">
            <select
              value={data.countryCode}
              onChange={(e) => onUpdate('countryCode', e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full h-full appearance-none bg-transparent pl-[15px] pr-[30px] text-[15px] text-[#EFEFEF] outline-none cursor-pointer"
            >
              {COUNTRY_CODES.map(c => (
                <option key={c.code} value={c.code} className="bg-[#050507]">
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-[10px] top-[14px] w-4 h-4 text-[rgba(239,239,239,0.35)] pointer-events-none" />
          </div>
          <input
            autoFocus
            type="tel"
            placeholder="Your WhatsApp number"
            value={data.phone}
            onChange={(e) => onUpdate('phone', e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 bg-transparent px-[15px] py-[12px] text-[#EFEFEF] text-[15px] outline-none placeholder:text-[rgba(239,239,239,0.35)] rounded-r-[10px]"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[14px] text-[#EFEFEF]">Business Email</span>
            <span className="text-[13px] text-[rgba(239,239,239,0.35)]">(optional)</span>
          </div>
          <Field
            type="email"
            placeholder="business@email.com"
            value={data.email}
            onChange={(e) => onUpdate('email', e.target.value)}
          />
        </div>

        <div className="flex items-start gap-[8px] text-[12px] text-[rgba(239,239,239,0.30)]">
          <Shield className="w-[14px] h-[14px] text-[rgba(212,168,83,0.5)] flex-shrink-0 mt-[2px]" />
          <p>Your number is only used to connect your AI agent. We never share it.</p>
        </div>

        <div className="pt-4">
          <Button onClick={handleContinue}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}
