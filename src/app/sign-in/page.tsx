'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthShell from '@/components/auth/AuthShell';
import Field from '@/components/auth/Field';
import AuthButton from '@/components/auth/AuthButton';
import { createClient } from '@/lib/supabase/client';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push('/dashboard');
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
            Welcome back.
          </h1>
          <p className="text-[15px] text-[rgba(239,239,239,0.50)] leading-relaxed">
            Your customers never stopped messaging. Let's get you back in.
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
          {error && (
            <div className="bg-[rgba(220,80,80,0.07)] border border-[rgba(220,80,80,0.18)] text-[#f08080] text-[13px] px-[14px] py-[11px] rounded-[8px]">
              {error}
            </div>
          )}

          <Field
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="amara@boutique.com"
            autoComplete="email"
          />

          <div className="space-y-1.5 relative">
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <div className="flex justify-end">
              <Link
                href="/reset-password"
                className="text-[12px] text-[rgba(212,168,83,0.6)] hover:text-[#D4A853] transition-colors duration-150 font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <AuthButton loading={loading}>Sign In</AuthButton>
          </div>
        </form>

        <div className="text-center">
          <p className="text-[14px] text-[rgba(239,239,239,0.5)]">
            New to Orda?{' '}
            <Link href="/sign-up" className="text-[#D4A853] font-medium hover:text-[#E0B968] transition-colors duration-150">
              Start free
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
