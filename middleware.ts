import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Debug
  console.log('Current path:', req.nextUrl.pathname)
  console.log('Session exists:', !!session)

  // Protect all routes except login
  if (!session) {
    if (req.nextUrl.pathname !== '/login') {
      const redirectUrl = new URL('/login', req.url)
      console.log('Redirecting to:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect from login to home if already authenticated
  if (session) {
    if (req.nextUrl.pathname === '/login') {
      const redirectUrl = new URL('/', req.url)
      console.log('Redirecting to:', redirectUrl.toString())
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 