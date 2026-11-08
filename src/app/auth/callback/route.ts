import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          const response = NextResponse.redirect(new URL("/oot", request.url));
          response.headers.set("Cache-Control", "private, no-store");
          return response;
        }
      }
    } catch {
      // 만료·네트워크 오류는 같은 안전한 로그인 화면으로 보낸다.
    }
  }
  const response = NextResponse.redirect(new URL("/login?error=callback", request.url));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
