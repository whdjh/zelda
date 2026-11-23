import { AdventureLogin } from "@/components/adventure-login";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function Home() {
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <div className="page-shell px-x5 sm:px-x6">
      <main id="main" tabIndex={-1} className="mx-auto flex min-h-dvh max-w-md flex-col justify-center py-x8">
        <AdventureLogin supabaseConfigured={supabaseConfigured} />

        <footer className="mt-x6 text-center t2-regular text-fg-neutral-subtle">
          <p>시간의 오카리나 증강 카드 내비 · 비공식 팬 프로젝트</p>
          <p className="mt-x1">
            <a className="underline" href="/licenses/seed-design-NOTICE.txt">SEED Design 고지</a>
            {" · "}
            <a className="underline" href="/licenses/seed-design-LICENSE.txt">라이선스</a>
          </p>
        </footer>
      </main>
    </div>
  );
}
