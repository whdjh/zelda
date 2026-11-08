"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/supabase/config";

export type LoginState = { message: string; sent: boolean };

export async function sendLoginLink(_previous: LoginState, form: FormData): Promise<LoginState> {
  const email = form.get("email");
  if (typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { message: "올바른 이메일 주소를 입력해 주세요.", sent: false };
  }
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return { message: "로그인 연결을 준비하고 있어요. 지금은 이 브라우저에 기록할 수 있어요.", sent: false };
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${getSiteUrl()}/auth/callback` },
    });
    if (error) return { message: "메일을 보내지 못했어요. 주소와 발송 제한을 확인하고 잠시 후 다시 시도해 주세요.", sent: false };
    return { message: "로그인 링크를 요청했어요. 같은 브라우저에서 메일의 링크를 열어 주세요.", sent: true };
  } catch {
    return { message: "로그인 서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.", sent: false };
  }
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) redirect("/login?error=signout");
  }
  redirect("/oot");
}
