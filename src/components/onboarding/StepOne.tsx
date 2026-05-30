'use client';

import React, { useState } from 'react';
import { ShoppingBag, UtensilsCrossed, Smartphone, Scissors, Pill, Package, Truck, LayoutGrid, ChevronDown } from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import { SegmentedControl } from './SegmentedControl';
import { Field } from '../shared/Field';
import { Button } from '../shared/Button';
import { OnboardingData } from '@/app/onboarding/page';

interface StepOneProps {
  data: OnboardingData;
  onUpdate: (field: keyof OnboardingData, value: string) => void;
  onNext: () => void;
}

const CATEGORIES = [
  { icon: ShoppingBag, label: 'Boutique' },
  { icon: UtensilsCrossed, label: 'Restaurant' },
  { icon: Smartphone, label: 'Phone Shop' },
  { icon: Scissors, label: 'Salon' },
  { icon: Pill, label: 'Pharmacy' },
  { icon: Package, label: 'Wholesale' },
  { icon: Truck, label: 'Delivery' },
  { icon: LayoutGrid, label: 'Other' },
];

const COUNTRIES = [
  'Uganda', 'Kenya', 'Nigeria', 'Ghana', 'Tanzania', 'Rwanda', 'South Africa',
  'Ethiopia', 'USA', 'UK', 'UAE', 'India', 'Indonesia', 'Brazil', 'Philippines'
].sort((a, b) => {
  const priorities = ['Uganda', 'Kenya', 'Nigeria'];
  const aIdx = priorities.indexOf(a);
  const bIdx = priorities.indexOf(b);
  if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
  if (aIdx !== -1) return -1;
  if (bIdx !== -1) return 1;
  return a.localeCompare(b);
});

export function StepOne({ data, onUpdate, onNext }: StepOneProps) {
  const [error, setError] = useState(false);

  const handleContinue = () => {
    if (!data.name.trim() || !data.category || !data.country) {
      setError(true);
      setTimeout(() => setError(false), 400);
      return;
    }
    onNext();
  };

  return (
    <div className={`w-full ${error ? 'animate-shake' : ''}`}>
      <div className="mb-10 text-center">
        <p className="text-[11px] font-medium tracking-[0.10em] uppercase text-[rgba(239,239,239,0.28)] mb-4">Step 1 of 3</p>
        <h1 className="font-playfair font-black text-[clamp(36px,4vw,52px)] leading-tight tracking-[-0.03em] mb-3">What's your business called?</h1>
        <p className="text-[15px] text-[rgba(239,239,239,0.45)] leading-[1.65]">Tell us the basics. You can change everything later.</p>
      </div>

      <div className="space-y-6">
        <Field
          autoFocus
          placeholder="e.g. Amara's Boutique"
          value={data.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          error={error && !data.name.trim()}
        />

        <div>
          <div className="grid grid-cols-4 gap-3">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat.label}
                icon={cat.icon}
                label={cat.label}
                selected={data.category === cat.label}
                onClick={() => onUpdate('category', cat.label)}
                style={{ transitionDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
          {error && !data.category && <p className="text-red-400 text-xs mt-2">Category is required</p>}
        </div>

        <div className="relative">
          <select
            value={data.country}
            onChange={(e) => onUpdate('country', e.target.value)}
            className={`
              w-full appearance-none bg-[rgba(255,255,255,0.025)] border rounded-[10px] px-[15px] py-[12px]
              text-[15px] outline-none transition-[border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]
              focus:border-[rgba(212,168,83,0.45)]
              ${data.country ? 'text-[#EFEFEF]' : 'text-[rgba(239,239,239,0.35)]'}
              ${error && !data.country ? 'border-red-500/50' : 'border-[rgba(255,255,255,0.07)]'}
            `}
          >
            <option value="" disabled>Select your country</option>
            {COUNTRIES.map(c => <option key={c} value={c} className="bg-[#050507] text-[#EFEFEF]">{c}</option>)}
          </select>
          <ChevronDown className="absolute right-[15px] top-[14px] w-5 h-5 text-[rgba(239,239,239,0.35)] pointer-events-none" />
        </div>

        <Field
          placeholder="Your city"
          value={data.city}
          onChange={(e) => onUpdate('city', e.target.value)}
        />

        <SegmentedControl
          options={['USD $', 'UGX USh', 'KES KSh']}
          value={data.currency === 'USD' ? 'USD $' : data.currency === 'UGX' ? 'UGX USh' : 'KES KSh'}
          onChange={(val) => onUpdate('currency', val.split(' ')[0])}
        />

        <div className="pt-4">
          <Button onClick={handleContinue}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}
