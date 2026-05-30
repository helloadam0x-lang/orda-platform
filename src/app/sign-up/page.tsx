'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthShell from '@/components/auth/AuthShell';
import Field from '@/components/auth/Field';
import AuthButton from '@/components/auth/AuthButton';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        router.push('/onboarding');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="w-full space-y-8">
        <div className="space-y-2">
          <h1 className="font-['Playfair_Display'] font-black text-[38px] leading-[0.95] tracking-tight text-[#EFEFEF]">
            Start free for 7 days.
          </h1>
          <p className="text-[15px] text-[rgba(239,239,239,0.50)] leading-relaxed">
            Connect your WhatsApp. Let your AI agent start working tonight.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          {error && (
            <div className="bg-[rgba(220,80,80,0.07)] border border-[rgba(220,80,80,0.18)] rounded-[8px] text-[#f08080] text-[13px] px-[14px] py-[11px]">
              {error}
            </div>
          )}

          <Field
            label="Full name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Amara Kamali"
            autoComplete="name"
          />

          <Field
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="amara@boutique.com"
            autoComplete="email"
          />

          <Field
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <div className="pt-2">
            <AuthButton loading={loading}>Start Free Trial</AuthButton>
          </div>
        </form>

        <div className="space-y-6 text-center">
          <p className="text-[14px] text-[rgba(239,239,239,0.5)]">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[#D4A853] font-medium hover:text-[#E0B968] transition-colors duration-150">
              Sign in
            </Link>
          </p>

          <p className="text-[11px] text-[rgba(239,239,239,0.18)] tracking-normal">
            No credit card required · Cancel anytime
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
