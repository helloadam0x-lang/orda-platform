'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import Field from '@/components/auth/Field';
import AuthButton from '@/components/auth/AuthButton';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
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
            Reset your password.
          </h1>
          <p className="text-[15px] text-[rgba(239,239,239,0.50)] leading-relaxed">
            Enter your email and we will send you a secure reset link.
          </p>
        </div>

        {success ? (
          <div className="bg-[rgba(212,168,83,0.06)] border border-[rgba(212,168,83,0.2)] rounded-[10px] text-[#EFEFEF] p-4 text-[14px] leading-relaxed">
            Check your inbox. We sent a reset link to <span className="text-[#D4A853] font-medium">{email}</span>.
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
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

            <div className="pt-2">
              <AuthButton loading={loading}>Send Reset Link</AuthButton>
            </div>
          </form>
        )}

        <div className="text-center">
          <Link href="/sign-in" className="text-[#D4A853] text-[14px] font-medium hover:text-[#E0B968] transition-colors duration-150">
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
