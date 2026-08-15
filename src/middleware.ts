import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = process.env.JWT_SECRET || "default_secret";
const secretKey = new TextEncoder().encode(secret);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("auth_token")?.value;

  let user: { id: string; role: string; email: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secretKey);
      user = payload as unknown as { id: string; role: string; email: string };
    } catch {
      user = null;
    }
  }

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/donor") ||
    pathname.startsWith("/volunteer") ||
    pathname.startsWith("/ngo") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/notifications");

  if (isAuthRoute && user) {
    const redirectUrl = getRoleDashboard(user.role);
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isProtected) {
    if (pathname.startsWith("/donor") && user.role !== "DONOR") {
      return NextResponse.redirect(new URL(getRoleDashboard(user.role), request.url));
    }
    if (pathname.startsWith("/volunteer") && user.role !== "VOLUNTEER") {
      return NextResponse.redirect(new URL(getRoleDashboard(user.role), request.url));
    }
    if (pathname.startsWith("/ngo") && user.role !== "NGO") {
      return NextResponse.redirect(new URL(getRoleDashboard(user.role), request.url));
    }
    if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL(getRoleDashboard(user.role), request.url));
    }
  }

  return NextResponse.next();
}

function getRoleDashboard(role: string): string {
  switch (role) {
    case "DONOR":
      return "/donor/dashboard";
    case "NGO":
      return "/ngo/dashboard";
    case "VOLUNTEER":
      return "/volunteer/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/dashboard";
  }
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/donor/:path*",
    "/volunteer/:path*",
    "/ngo/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/notifications/:path*",
  ],
};
