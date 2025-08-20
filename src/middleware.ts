
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROD_BASE_DOMAIN = process.env.NEXT_PUBLIC_PROD_BASE_DOMAIN || "landed.pe";
const DEV_HOST = process.env.NEXT_PUBLIC_DEV_HOST || "localhost:3000";
const APP_HOSTNAME = `app.${PROD_BASE_DOMAIN}`;

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Prevent rewriting for API routes, Next.js assets, etc.
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/') || url.pathname.includes('.')) {
    return NextResponse.next();
  }
  
  // Allow requests to the main app (e.g., app.landed.pe/dashboard) to pass through
  if (hostname === APP_HOSTNAME || hostname === `app.${DEV_HOST}`) {
      url.pathname = `/app${url.pathname}`;
      return NextResponse.rewrite(url);
  }

  // Handle development host routing
  if (hostname === DEV_HOST) {
    const pathSegments = url.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const userSubdomain = pathSegments[0];
      const pageSlug = pathSegments.slice(1).join('/');
      url.pathname = `/_public/${userSubdomain}/${pageSlug || ''}`;
      return NextResponse.rewrite(url);
    }
  }
  
  // Handle production subdomain routing
  const subdomainMatch = hostname.match(`^(.*)\\.${PROD_BASE_DOMAIN}$`);
  if (subdomainMatch) {
    const userSubdomain = subdomainMatch[1];
    const pageSlug = url.pathname.slice(1); // remove leading '/'
    
    url.pathname = `/_public/${userSubdomain}/${pageSlug || ''}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
