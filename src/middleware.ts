import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/dashboard', '/onboarding']
const AUTH_PATHS = ['/sign-in', '/sign-up', '/reset-password']
const ATTACK_PATHS = ['/wp-admin', '/wp-login', '/.env', '/.git', '/phpinfo', '/admin.php']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Block known attack paths immediately
  if (ATTACK_PATHS.some(p => pathname.startsWith(p))) {
    return new NextResponse('Not found', { status: 404 })
  }

  let response = NextResponse.next({ request })

  // Security headers on all responses
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // No-cache on authenticated routes and API
  if (PROTECTED.some(p => pathname.startsWith(p)) || pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    response.headers.set('Pragma', 'no-cache')
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected route — not logged in → redirect to sign-in with ?next
  if (PROTECTED.some(p => pathname.startsWith(p)) && !user) {
    const url = new URL('/sign-in', request.url)
    url.searchParams.set('next', pathname)
    const r = NextResponse.redirect(url)
    r.headers.set('Cache-Control', 'no-store')
    return r
  }

  // Already logged in → skip auth pages
  if (AUTH_PATHS.some(p => pathname === p) && user) {
    const next = request.nextUrl.searchParams.get('next') || '/dashboard'
    return NextResponse.redirect(new URL(next, request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons/|manifest.json|sw.js).*)'],
}
