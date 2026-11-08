import "server-only";

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key?.trim() || !URL.canParse(url)) return null;
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname))) return null;
  return { url, key };
}

export function getSiteUrl(): string {
  const value = process.env.SITE_URL ?? "http://localhost:3000";
  const url = new URL(value);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) {
    throw new Error("SITE_URL은 HTTPS 주소 또는 로컬 개발 주소여야 합니다.");
  }
  return url.origin;
}
