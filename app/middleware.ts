// // middleware.ts
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// export async function middleware(req: NextRequest) {
//   // Create a Next.js response object we can mutate (cookies, redirects)
//   const res = NextResponse.next()

//   // Bind a Supabase client to the request/response so it can read/write auth cookies
//   const supabase = createMiddlewareClient({ req, res })

//   // Convenience: current pathname (e.g. "/admin/dashboard")
//   const path = req.nextUrl.pathname

//   // Public paths you can visit without a session
//   const PUBLIC_PATHS = new Set(['/login', '/signup', '/forgot-password', '/reset-password'])
//   const isPublic = [...PUBLIC_PATHS].some(p => path === p)

//   // 1) Get the current session (are they logged in?)
//   const { data: { session } } = await supabase.auth.getSession()

//   // If no session and not on a public page → go to /login
//   if (!session && !isPublic) {
//     return NextResponse.redirect(new URL('/login', req.url))
//   }

//   // If still public (no session and on /login or /signup), just continue
//   if (!session && isPublic) {
//     return res
//   }

//   // 2) We have a session → get the authenticated user
//   const { data: { user } } = await supabase.auth.getUser()
//   // user.user_metadata is a free-form object we can set from the client (no DB change needed)
//   const onboarded = Boolean(user?.user_metadata?.onboarded)

//   // 3) Also read role from the DB profile for role-based routing
//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('role')
//     .eq('id', user!.id)
//     .single()

//   const role = profile?.role ?? null

//   // 4) Force onboarding: if not onboarded, everything (except /select-role) goes to /select-role
//   if (!onboarded && path !== '/select-role') {
//     return NextResponse.redirect(new URL('/select-role', req.url))
//   }

//   // 5) If already onboarded and they hit /select-role manually → send them to their dashboard
//   if (onboarded && path === '/select-role') {
//     const dest = role ? `/${role}/dashboard` : '/'
//     return NextResponse.redirect(new URL(dest, req.url))
//   }

//   // 6) Role-based protection for role areas
//   const roleAreas = ['admin', 'tutor', 'guardian', 'student'] as const
//   for (const area of roleAreas) {
//     if (path.startsWith(`/${area}`) && role !== area) {
//       // They tried to open a different role’s area → bounce them to their own dashboard
//       const dest = role ? `/${role}/dashboard` : '/'
//       return NextResponse.redirect(new URL(dest, req.url))
//     }
//   }

//   // 7) If we didn’t redirect, let the request continue
//   return res
// }

// // 8) Tell Next.js which paths the middleware should run on
// export const config = {
//   matcher: [
//     // Run for everything except Next.js internals and static files
//     '/((?!_next|favicon.ico|images|public).*)',
//   ],
// }
// middleware.ts
// middleware.ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // allow public routes + _next assets
  const publicRoutes = ['/', '/login', '/signup', '/select-role', '/favicon.ico']
  if (publicRoutes.includes(pathname) || pathname.startsWith('/_next')) return res

  // IMPORTANT: do NOT handle /profiles/* in middleware — let the server component handle owner/admin checks
  if (pathname.startsWith('/profiles')) return res

  // For other guarded sections, check session & role
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  const role = profile?.role

  // admin bypass
  if (role === 'admin') return res

  // role checks
  if (pathname.startsWith('/student') && role !== 'student') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }
  if (pathname.startsWith('/tutor') && role !== 'tutor') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }
  if (pathname.startsWith('/guardian') && role !== 'guardian') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/student/:path*',
    '/tutor/:path*',
    '/guardian/:path*'
  ]
}
