import Link from "next/link";
import { getMessages } from "@/i18n";

export default function NotFound() {
  const t = getMessages();
  return (
    <main id="main" className="page-shell px-x5 py-x10">
      <h1 className="mb-x4 t6-bold">{t.notFound.title}</h1>
      <Link href="/" className="inline-flex min-h-x11 items-center t3-bold text-fg-brand">
        {t.app.goHome}
      </Link>
    </main>
  );
}
