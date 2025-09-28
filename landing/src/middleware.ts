import { type NextRequest, NextResponse } from "next/server";
import { ROOT_DOMAIN } from "./lib/constants";

const extractSubdomain = (request: NextRequest): string | null => {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = ROOT_DOMAIN.split(':')[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  if (subdomain) {
    // Rewrite any path on a subdomain to the corresponding /s/[subdomain] route, preserving the rest of the path
    // Examples:
    //  - sub.example.com/ -> /s/example
    //  - sub.example.com/how-it-works -> /s/example/how-it-works
    const rewrittenPath = pathname === '/'
      ? `/s/${subdomain}`
      : `/s/${subdomain}${pathname}`;
    return NextResponse.rewrite(new URL(rewrittenPath, request.url));
  }

  // On the root domain, rewrite to /s/harvard
  const rewrittenPath = pathname === '/' ? '/s/harvard' : `/s/harvard${pathname}`;
  return NextResponse.rewrite(new URL(rewrittenPath, request.url));
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     * 4. /.well-known (for microsoft identity association)
     */
    "/((?!api|_next|[\\w-]+\\.\\w+|\\.well-known).*)",
  ],
};
