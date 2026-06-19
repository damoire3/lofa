import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export default auth((req : NextRequest & { auth: unknown }) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isOnDashboard = pathname.startsWith('/dashboard')
  const isOnAuth = pathname.startsWith('/login') ||
                   pathname.startsWith('/register')

  if (isLoggedIn && isOnAuth) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!isLoggedIn && isOnDashboard) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
}