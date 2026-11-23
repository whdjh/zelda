"use client";

import Link from "next/link";
import { ActionButton } from "@seed-design/react";
import { getMessages } from "@/i18n";

export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = getMessages();
  return (
    <main id="main" className="page-shell px-x5 py-x10">
      <h1 className="mb-x4 t6-bold">{t.error.title}</h1>
      <div className="flex flex-wrap gap-x3">
        <ActionButton variant="brandSolid" onClick={reset}>{t.error.retry}</ActionButton>
        <ActionButton asChild variant="neutralWeak"><Link href="/">{t.app.goHome}</Link></ActionButton>
      </div>
    </main>
  );
}
