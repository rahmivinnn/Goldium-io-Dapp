import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // This middleware doesn't do anything special
  // It's just here to ensure we have a middleware file
  // which can help with certain build issues
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
