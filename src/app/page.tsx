import { AdventureLogin } from "@/components/adventure-login";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default function Home() {
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <div className="page-shell px-x5 sm:px-x6">
      <main id="main" tabIndex={-1} className="mx-auto flex min-h-dvh max-w-md flex-col justify-center py-x8">
        <AdventureLogin supabaseConfigured={supabaseConfigured} />
      </main>
    </div>
  );
}
