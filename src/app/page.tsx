import { AdventureShell } from "@/components/adventure-shell";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="page-shell px-x5 sm:px-x6">
      <main id="main" tabIndex={-1} className="mx-auto flex min-h-dvh max-w-md flex-col justify-center py-x8">
        <AdventureShell />
      </main>
    </div>
  );
}
