import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent(errorDescription || error)}`
    )
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=no_code`)
  }

  const supabase = createClient()
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError || !data.session) {
    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent(exchangeError?.message || 'auth_failed')}`
    )
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', data.user.id)
    .single()

  await supabase.from('legal_agreements').upsert({
    user_id: data.user.id,
    agreed_to_terms: true,
    agreed_to_privacy: true,
    agreed_at: new Date().toISOString(),
  }, { onConflict: 'user_id' }).then(() => {}, () => {})

  const redirectTo = business ? next : '/onboarding'
  return NextResponse.redirect(`${origin}${redirectTo}`)
}
