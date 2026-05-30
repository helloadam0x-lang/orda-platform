'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { StepOne } from '@/components/onboarding/StepOne';
import { StepTwo } from '@/components/onboarding/StepTwo';
import { StepThree } from '@/components/onboarding/StepThree';

export type OnboardingData = {
  name: string;
  category: string;
  country: string;
  city: string;
  currency: 'USD' | 'UGX' | 'KES';
  countryCode: string;
  phone: string;
  email: string;
  personality: 'professional' | 'friendly' | 'luxury';
  autoReply: boolean;
  openTime: string;
  closeTime: string;
};

const defaultData: OnboardingData = {
  name: '', category: '', country: '', city: '', currency: 'USD',
  countryCode: '+256', phone: '', email: '',
  personality: 'friendly', autoReply: true,
  openTime: '08:00', closeTime: '18:00',
};

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [formData, setFormData] = useState<OnboardingData>(defaultData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }
      const { data } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (data) {
        router.push('/dashboard');
      } else {
        setCheckingAuth(false);
      }
    };
    checkStatus();
  }, []);

  const handleUpdate = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setDirection('forward');
    setCurrentStep(prev => Math.min(prev + 1, 3) as 1 | 2 | 3);
  };

  const prevStep = () => {
    setDirection('backward');
    setCurrentStep(prev => Math.max(prev - 1, 1) as 1 | 2 | 3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const fullPhone = `${formData.countryCode}${formData.phone.replace(/^0+/, '')}`;

      const { error } = await supabase
        .from('businesses')
        .insert({
          user_id: user.id,
          name: formData.name,
          country: formData.country,
          city: formData.city,
          currency: formData.currency,
          language: 'en',
          phone: fullPhone,
          email: formData.email || null,
          ai_personality: formData.personality,
          auto_reply: formData.autoReply,
          business_hours: { open: formData.openTime, close: formData.closeTime },
          plan: 'trial',
          plan_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          whatsapp_connected: false,
          is_active: true,
          total_messages_sent: 0,
          total_orders: 0,
          total_revenue: 0,
        });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 600);
    } catch (err) {
      console.error('Onboarding error:', err);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return <div className="min-h-screen bg-[#050507]" />;
  }

  const animationClass = direction === 'forward' ? 'animate-step-enter-right' : 'animate-step-enter-left';

  return (
    <OnboardingShell step={currentStep}>
      <div key={currentStep} className={animationClass}>
        {currentStep === 1 && (
          <StepOne data={formData} onUpdate={handleUpdate} onNext={nextStep} />
        )}
        {currentStep === 2 && (
          <StepTwo data={formData} onUpdate={handleUpdate} onNext={nextStep} onBack={prevStep} />
        )}
        {currentStep === 3 && (
          <StepThree
            data={formData}
            onUpdate={handleUpdate}
            onSubmit={handleSubmit}
            onBack={prevStep}
            loading={loading}
            success={success}
          />
        )}
      </div>
    </OnboardingShell>
  );
}
