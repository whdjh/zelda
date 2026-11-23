import { AdventureShell } from "@/components/adventure-shell";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-x4 pt-x4 pb-[max(env(safe-area-inset-bottom),1rem)]"
    >
      <AdventureShell />
    </main>
  );
}
