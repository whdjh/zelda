begin;

create table public.user_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text not null check (length(game_id) between 1 and 80),
  game_version text not null check (length(game_version) between 1 and 80),
  data jsonb not null,
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, game_id, game_version),
  constraint valid_progress check ((
    jsonb_typeof(data) = 'object'
    and octet_length(data::text) <= 1048576
    and data ?& array['schemaVersion', 'contentVersion', 'completedStopIds', 'confirmedItemIds', 'revealedHintIds', 'spoilerLevel', 'updatedAt']
    and data->>'schemaVersion' = '1'
    and jsonb_typeof(data->'contentVersion') = 'string'
    and jsonb_typeof(data->'completedStopIds') = 'array'
    and jsonb_typeof(data->'confirmedItemIds') = 'array'
    and jsonb_typeof(data->'revealedHintIds') = 'array'
    and data->>'spoilerLevel' in ('strict', 'default', 'full')
    and jsonb_typeof(data->'updatedAt') = 'string'
  ) is true)
);

alter table public.user_progress enable row level security;
revoke all on public.user_progress from anon;
grant select, insert, update, delete on public.user_progress to authenticated;

create policy "Read own progress" on public.user_progress for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Insert own progress" on public.user_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Update own progress" on public.user_progress for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own progress" on public.user_progress for delete to authenticated
  using ((select auth.uid()) = user_id);

create function public.update_progress_revision()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.revision := old.revision + 1;
  new.updated_at := now();
  return new;
end;
$$;

create trigger user_progress_revision before update on public.user_progress
for each row execute function public.update_progress_revision();

commit;
