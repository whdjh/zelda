import Link from "next/link";

export default function NotFound() {
  return <main id="main" className="page-shell px-x5 py-x10">
    <h1 className="screen-title mb-x4">아직 없는 모험 안내예요</h1>
    <p className="mb-x5 t4-regular text-fg-neutral-muted">주소를 확인하거나 모험 홈으로 돌아가 주세요.</p>
    <Link href="/" className="inline-flex min-h-x11 items-center t3-bold text-fg-informative-contrast">모험 홈으로</Link>
  </main>;
}
