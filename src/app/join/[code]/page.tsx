import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function JoinPage({ params }: { params: { code: string } }) {
  const supabase = createClient()
  const { data: biz } = await supabase
    .rpc('get_business_by_referral_code', { p_code: params.code })
    .single()

  // Store code in cookie, redirect to sign-up
  const cookieStore = cookies()
  cookieStore.set('orda_ref', params.code, { maxAge: 86400 * 30, path: '/' })

  redirect(`/sign-up?ref=${params.code}${biz ? `&referrer=${encodeURIComponent((biz as any).name ?? '')}` : ''}`)
}
