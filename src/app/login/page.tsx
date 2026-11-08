import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const enabled = Boolean(getSupabaseConfig());
  const { error } = await searchParams;
  return (
    <main id="main" className="page-shell px-x5 py-x10">
      <Link href="/oot" className="mb-x8 inline-flex min-h-x11 items-center text-fg-informative-contrast t3-bold">← 모험으로 돌아가기</Link>
      <h1 className="screen-title mb-x4">다음 기기에서도 이어서</h1>
      <p className="mb-x6 t4-regular text-fg-neutral-muted">이메일의 링크로 로그인해요. 처음 이용하면 계정이 만들어져요.</p>
      {!enabled && <p className="mb-x5 rounded-r3 bg-bg-informative-weak p-x4 t3-regular">로그인 연결을 준비하고 있어요. 로그인 없이도 브라우저 설정과 백업을 사용할 수 있어요.</p>}
      {error && <p role="alert" className="mb-x5 t3-regular">{error === "signout" ? "로그아웃하지 못했어요. 잠시 후 다시 시도해 주세요." : "로그인 링크가 만료되었거나 사용할 수 없어요. 같은 브라우저에서 새 링크를 요청해 주세요."}</p>}
      <LoginForm enabled={enabled} />
      <p className="mt-x5 t2-regular text-fg-neutral-muted">로그인에는 이메일과 인증 쿠키를 사용해요. 서버에 진행도를 저장하는 것은 로그인 후 직접 선택할 수 있어요.</p>
    </main>
  );
}
