import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect /admin routes (but not the login page/API itself)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Always allow the login page and login API through
    if (pathname === '/admin/login' || pathname === '/api/admin/login') {
      return NextResponse.next()
    }

    const auth = req.cookies.get('admin_auth')?.value
    if (auth !== process.env.ADMIN_PASSWORD) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
