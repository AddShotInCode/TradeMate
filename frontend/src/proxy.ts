import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/simulation", "/account", "/propensity"];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const publicRoutes = ["/login", "/register", "/"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Get the refresh token from cookies
  // Note: We check for 'refreshToken' as that's the key used in authService for the cookie
  const refreshToken = request.cookies.get("refreshToken");

  if (isProtectedRoute && !refreshToken) {
    // Redirect to login if accessing a protected route without a refresh token
    const loginUrl = new URL("/login", request.url);
    // Optionally add a redirect param logic here if needed
    return NextResponse.redirect(loginUrl);
  }

  // If the user is logged in (has refresh token) and tries to access login/register
  if ((pathname === "/login" || pathname === "/register") && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
     * - images (public images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
