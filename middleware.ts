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
  matcher: ["/mypage"],
};

// 쿠키유효가 1일이니 실제 로그인 상태도 조정필요 (현재는 로그아웃안하면 계속 유지)
// 마이메뉴에서 로그인 상태 확인하는 훅이 넘 느리게 반응.. 서버에서 처리하도록 해봐야하나
