-- 젤다 하이패스: 공유 Supabase 프로젝트용 테이블 (prefix: zhp_)
-- Supabase SQL Editor에서 1회 실행하세요.

create table if not exists public.zhp_adventures (
  adventure_id text primary key
    check (char_length(adventure_id) between 2 and 24),
  current_card_id text,
  selected_history jsonb not null default '[]'::jsonb,
  revealed_hints jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- 비밀번호·JWT 없는 공개 간편 모험 아이디 정책
-- 개인정보(이메일·실명·전화번호)를 저장하지 않는 게임 진행 기록 전용입니다.
alter table public.zhp_adventures enable row level security;

drop policy if exists "zhp_allow_read_adventures" on public.zhp_adventures;
create policy "zhp_allow_read_adventures"
  on public.zhp_adventures
  for select
  to anon, authenticated
  using (true);

drop policy if exists "zhp_allow_insert_adventures" on public.zhp_adventures;
create policy "zhp_allow_insert_adventures"
  on public.zhp_adventures
  for insert
  to anon, authenticated
  with check (char_length(adventure_id) between 2 and 24);

drop policy if exists "zhp_allow_update_adventures" on public.zhp_adventures;
create policy "zhp_allow_update_adventures"
  on public.zhp_adventures
  for update
  to anon, authenticated
  using (true)
  with check (char_length(adventure_id) between 2 and 24);
