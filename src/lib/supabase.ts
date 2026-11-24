import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_TABLE_PREFIX = "zhp_";
export const ADVENTURES_TABLE = `${SUPABASE_TABLE_PREFIX}adventures`;
export const CARDS_TABLE = `${SUPABASE_TABLE_PREFIX}cards`;
export const HINTS_TABLE = `${SUPABASE_TABLE_PREFIX}hints`;

export interface AdventureRow {
  adventure_id: string;
  current_card_id: string | null;
  selected_history: string[];
  revealed_hints: string[];
  updated_at: string;
}

export interface CardRow {
  game_id: string;
  card_id: string;
  is_initial: boolean;
  step_label: string;
  title: string;
  icon: string;
  steps: string[];
  reference_url: string;
  hint_question: string;
  next_card_ids: string[];
  sort_order: number;
}

export interface HintRow {
  game_id: string;
  hint_id: string;
  card_id: string;
  level: 1 | 2 | 3;
  text: string;
}

export function getSupabaseConfig(): { url: string; key: string } | null {
  const url = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const key = (
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  ).trim();

  if (!url || !key || !URL.canParse(url)) return null;
  const parsed = new URL(url);
  const isLocalHttp = parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname);
  if (parsed.protocol !== "https:" && !isLocalHttp) return null;
  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

export function createSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) return null;
  return createClient(config.url, config.key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
