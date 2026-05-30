import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!business) redirect('/onboarding');

  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Business Owner';

  return (
    <div className="w-full min-h-screen bg-[#050507] flex flex-col items-center justify-center p-6 text-center select-none font-['DM_Sans']">
      <DashboardShell businessId={business.id}>
        <div className="space-y-6 max-w-md animate-[fadeUp_300ms_cubic-bezier(0.23,1,0.32,1)_forwards]">
          <div className="font-['Playfair_Display'] font-black text-2xl tracking-tight text-[#EFEFEF]">
            ORDA<span className="text-[#D4A853]">.</span>
          </div>

          <div className="space-y-2">
            <h1 className="font-['Playfair_Display'] font-black text-[clamp(38px,5vw,56px)] leading-tight text-[#EFEFEF] tracking-tight">
              You're in.
            </h1>
            <p className="text-[17px] text-[rgba(239,239,239,0.50)] leading-relaxed">
              Welcome, <span className="text-[#D4A853] font-semibold">{name}</span>. Dashboard is the next build.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4 items-center">
            <a
              href="/dashboard/connect"
              className="px-6 py-2.5 bg-[#D4A853] hover:bg-[#E0B968] text-[#050507] rounded-[8px] text-[13px] font-semibold transition-colors duration-150"
            >
              Connect WhatsApp →
            </a>
            <a
              href="/dashboard/settings/notifications"
              className="px-6 py-2.5 bg-transparent border border-[rgba(255,255,255,0.1)] hover:border-[rgba(212,168,83,0.3)] hover:text-[#D4A853] rounded-[8px] text-[13px] text-[rgba(239,239,239,0.5)] font-medium transition-all duration-150"
            >
              Notification Settings
            </a>
            <form action="/auth/sign-out" method="POST">
              <button
                type="submit"
                className="px-6 py-2.5 bg-transparent text-[rgba(239,239,239,0.28)] hover:text-[rgba(239,239,239,0.5)] text-[13px] font-medium transition-colors duration-150"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}
