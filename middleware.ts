import { NextRequest, NextResponse } from "next/server";
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";

interface NextRequestWithCookie extends NextRequest {
  cookies: LoginCookie;
}

interface LoginCookie extends RequestCookies {
  login: "true";
}

export function middleware(request: NextRequestWithCookie) {
  const user = request.cookies.get("login");
  if (user?.value == "true") {
    return NextResponse.next();
  } else {
    return NextResponse.rewrite(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/mypage", "/review"],
};
