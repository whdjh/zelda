-- 격리된 개발/테스트 DB의 SQL Editor에서 실행한다. 모든 변경은 ROLLBACK한다.
begin;
insert into auth.users (id) values
  ('00000000-0000-4000-8000-0000000000a1'),
  ('00000000-0000-4000-8000-0000000000b2');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a1', true);

do $$
declare
  payload jsonb := '{"schemaVersion":1,"contentVersion":"oot-draft-1","completedStopIds":[],"confirmedItemIds":[],"revealedHintIds":[],"spoilerLevel":"default","updatedAt":"2026-11-08T00:00:00.000Z"}';
  changed integer;
begin
  insert into public.user_progress (user_id, game_id, game_version, data)
  values ('00000000-0000-4000-8000-0000000000a1', 'test', 'test', payload);
  if (select count(*) from public.user_progress) <> 1 then raise exception 'Own select failed'; end if;

  begin
    insert into public.user_progress (user_id, game_id, game_version, data)
    values ('00000000-0000-4000-8000-0000000000b2', 'test', 'test', payload);
    raise exception 'Cross-user insert was allowed';
  exception when insufficient_privilege then null;
  end;

  update public.user_progress set data = payload where revision = 1;
  if (select revision from public.user_progress) <> 2 then raise exception 'Revision did not increase'; end if;
  update public.user_progress set data = payload where revision = 1;
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Stale update was allowed'; end if;

  begin
    update public.user_progress set user_id = '00000000-0000-4000-8000-0000000000b2';
    raise exception 'Ownership change was allowed';
  exception when insufficient_privilege then null;
  end;

  begin
    update public.user_progress set data = jsonb_set(payload, '{schemaVersion}', 'null');
    raise exception 'Invalid schema was allowed';
  exception when check_violation then null;
  end;
end;
$$;

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000b2', true);
do $$
declare changed integer;
begin
  if (select count(*) from public.user_progress) <> 0 then raise exception 'Cross-user select was allowed'; end if;
  update public.user_progress set data = '{}'::jsonb;
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Cross-user update was allowed'; end if;
  delete from public.user_progress;
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Cross-user delete was allowed'; end if;
end;
$$;

set local role anon;
do $$
begin
  begin
    perform * from public.user_progress;
    raise exception 'Anonymous select was allowed';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;
rollback;
