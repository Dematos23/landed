
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const HOSTNAME = process.env.NEXT_PUBLIC_APP_URL || "landed.pe";
const APP_HOSTNAME = `app.${HOSTNAME}`;

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Prevent rewriting for API routes, Next.js assets, etc.
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/') || url.pathname.includes('.')) {
    return NextResponse.next();
  }

  // Allow requests to the main app (e.g., app.landed.pe/dashboard) to pass through
  if (hostname === APP_HOSTNAME) {
      return NextResponse.next();
  }
  
  // Check if it's a custom subdomain
  const subdomainMatch = hostname.match(`^(.*)\\.${HOSTNAME}$`);
  
  if (subdomainMatch) {
    const userSubdomain = subdomainMatch[1];
    const pageSlug = url.pathname.slice(1); // remove leading '/'
    
    // Rewrite to the internal public rendering route
    // e.g., my-site.landed.pe/about-us -> /_public/my-site/about-us
    url.pathname = `/_public/${userSubdomain}/${pageSlug || ''}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
