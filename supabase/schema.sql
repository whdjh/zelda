-- 젤다 하이패스: 공유 Supabase 프로젝트용 테이블 (prefix: zhp_)
-- Supabase SQL Editor에서 1회 실행하세요. (기존 테이블 위에 재실행해도 안전합니다.)

-- 1) 유저 모험 진행도
create table if not exists public.zhp_adventures (
  adventure_id text primary key
    check (char_length(adventure_id) between 2 and 24),
  current_card_id text,
  selected_history jsonb not null default '[]'::jsonb,
  completed_cards jsonb not null default '[]'::jsonb,
  revealed_hints jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.zhp_adventures
  add column if not exists completed_cards jsonb not null default '[]'::jsonb;

-- 2) 증강 카드 원본 카탈로그 (조건·보상 플래그 + 우선순위 기반 풀 추천)
create table if not exists public.zhp_cards (
  game_id text not null default 'oot',
  card_id text not null,
  is_initial boolean not null default false,
  category text not null default 'main'
    check (category in ('main', 'safety', 'utility')),
  step_label text not null,
  title text not null,
  icon text not null,
  steps jsonb not null default '[]'::jsonb,
  reference_url text not null,
  hint_question text not null default '',
  requires_flags jsonb not null default '[]'::jsonb,
  grants_flags jsonb not null default '[]'::jsonb,
  priority integer not null default 50,
  boost_when_flags jsonb not null default '[]'::jsonb,
  next_card_ids jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (game_id, card_id)
);

alter table public.zhp_cards
  add column if not exists category text not null default 'main',
  add column if not exists requires_flags jsonb not null default '[]'::jsonb,
  add column if not exists grants_flags jsonb not null default '[]'::jsonb,
  add column if not exists priority integer not null default 50,
  add column if not exists boost_when_flags jsonb not null default '[]'::jsonb;

-- 3) 3단계 퍼즐 힌트 원본 (관찰=1, 단서=2, 해법=3)
create table if not exists public.zhp_hints (
  game_id text not null default 'oot',
  hint_id text not null,
  card_id text not null,
  level smallint not null check (level between 1 and 3),
  text text not null,
  updated_at timestamptz not null default now(),
  primary key (game_id, hint_id),
  unique (game_id, card_id, level),
  foreign key (game_id, card_id)
    references public.zhp_cards (game_id, card_id)
    on delete cascade
);

-- RLS: 진행도는 개인정보 없는 간편 모험 아이디 전용, 카드·힌트는 읽기 전용
alter table public.zhp_adventures enable row level security;
alter table public.zhp_cards enable row level security;
alter table public.zhp_hints enable row level security;

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

drop policy if exists "zhp_allow_read_cards" on public.zhp_cards;
create policy "zhp_allow_read_cards"
  on public.zhp_cards
  for select
  to anon, authenticated
  using (true);

drop policy if exists "zhp_allow_read_hints" on public.zhp_hints;
create policy "zhp_allow_read_hints"
  on public.zhp_hints
  for select
  to anon, authenticated
  using (true);

-- 초기 시드 데이터: 시간의 오카리나 (Switch 2 리메이크 · 안 A · 풀 추천 모델)
insert into public.zhp_cards (
  game_id,
  card_id,
  is_initial,
  category,
  step_label,
  title,
  icon,
  steps,
  reference_url,
  hint_question,
  requires_flags,
  grants_flags,
  priority,
  boost_when_flags,
  sort_order
) values
  (
    'oot',
    'kokiri-gear',
    true,
    'main',
    '1단계',
    '출발 장비 확보',
    '/assets/zelda/sword-shield.png',
    '["코키리 숲에서 검과 방패를 구해 장착합니다.","장비를 갖춘 뒤 마을 동쪽 길목의 미도에게 말을 겁니다."]'::jsonb,
    'https://gamewith.jp/zelda-tokino-ocarina/563396',
    '검과 방패를 어디서 얻는지 모르겠어요.',
    '[]'::jsonb,
    '["kokiri-gear-done"]'::jsonb,
    100,
    '[]'::jsonb,
    10
  ),
  (
    'oot',
    'deku-tree',
    false,
    'main',
    '2단계',
    '데크나무님 속',
    '/assets/zelda/adventure-emblem.png',
    '["동쪽 길목을 지나 데크나무 안으로 들어가 요정의 새총을 확보합니다.","거미줄을 뚫고 지하로 내려가 보스를 쓰러뜨린 뒤 코키리의 에메랄드를 얻습니다."]'::jsonb,
    'https://gamewith.jp/zelda-tokino-ocarina/563395',
    '1층 중앙 거미줄을 못 뚫고 막혔어요.',
    '["kokiri-gear-done"]'::jsonb,
    '["deku-tree-done","fairy-ocarina"]'::jsonb,
    95,
    '[]'::jsonb,
    20
  ),
  (
    'oot',
    'hyrule-castle',
    false,
    'main',
    '3단계',
    '하이랄 성 잠입',
    '/assets/zelda/adventure-emblem.png',
    '["숲 출구 다리에서 요정의 오카리나를 받고 하이랄 평원 북쪽 성하마을로 갑니다.","성 앞 말론에게 신기한 알을 받아 성문을 넘고, 자고 있는 타론을 깨워 안뜰로 들어갑니다.","경비병을 피해 젤다 공주에게 편지를, 임파에게 젤다의 자장가를 배웁니다."]'::jsonb,
    'https://gamewith.jp/zelda-tokino-ocarina/563310',
    '성문이 닫혀 있어서 안으로 못 들어가요.',
    '["deku-tree-done"]'::jsonb,
    '["zelda-letter","zelda-lullaby","talon-awake"]'::jsonb,
    90,
    '[]'::jsonb,
    30
  ),
  (
    'oot',
    'goron-main',
    false,
    'main',
    '메인 직행',
    '데스마운틴 & 고론 시티',
    '/assets/zelda/sword-shield.png',
    '["카카리코 마을 북쪽 관문에서 젤다의 편지를 보여주고 등산로로 오릅니다.","고론 시티 최하층 문 앞에서 젤다의 자장가를 연주해 족장 다루니아를 만납니다.","이후 도돈고의 동굴 진입 준비로 이어집니다."]'::jsonb,
    'https://gamewith.jp/zelda-tokino-ocarina/563393',
    '',
    '["zelda-letter","zelda-lullaby"]'::jsonb,
    '["goron-city-visited"]'::jsonb,
    85,
    '[]'::jsonb,
    40
  ),
  (
    'oot',
    'kakariko-prep',
    false,
    'safety',
    '안전 준비',
    '카카리코 생존 · 태양의 노래',
    '/assets/zelda/fairy-bottle.png',
    '["카카리코 마을에서 흩어진 닭 7마리를 울타리에 모아 첫 빈 병을 챙깁니다.","밤에 마을 뒤 묘지에서 꽃이 놓인 비석을 당겨 하일리아 방패를 무료로 얻습니다.","묘지 안쪽 왕가의 무덤 앞에서 젤다의 자장가를 연주해 태양의 노래를 배웁니다."]'::jsonb,
    'https://gamewith.jp/zelda-tokino-ocarina/563393',
    '묘지 비석이 안 움직이거나 왕가의 무덤이 안 열려요.',
    '["zelda-lullaby"]'::jsonb,
    '["bottle-kakariko","hylian-shield","suns-song"]'::jsonb,
    80,
    '[]'::jsonb,
    41
  ),
  (
    'oot',
    'songs-route',
    false,
    'utility',
    '노래 선행',
    '론론 목장 · 미혹의 숲',
    '/assets/zelda/ocarina.png',
    '["낮에 하이랄 평원 중앙 론론 목장에서 말론에게 오카리나를 꺼내 에포나의 노래를 배웁니다.","목장 건물 안 타론의 슈퍼 닭 찾기 미니게임으로 빈 병을 하나 더 챙길 수 있습니다.","코키리 숲의 미혹의 숲에서 음악 소리와 음표를 따라 숲의 성역으로 가면 사리아의 노래를 미리 배웁니다."]'::jsonb,
    'https://gamewith.jp/zelda-tokino-ocarina/563310',
    '미혹의 숲에서 자꾸 입구로 돌아와요.',
    '["zelda-letter","talon-awake"]'::jsonb,
    '["eponas-song","sarias-song","bottle-ranch"]'::jsonb,
    75,
    '["goron-city-visited"]'::jsonb,
    42
  )
on conflict (game_id, card_id) do update set
  is_initial = excluded.is_initial,
  category = excluded.category,
  step_label = excluded.step_label,
  title = excluded.title,
  icon = excluded.icon,
  steps = excluded.steps,
  reference_url = excluded.reference_url,
  hint_question = excluded.hint_question,
  requires_flags = excluded.requires_flags,
  grants_flags = excluded.grants_flags,
  priority = excluded.priority,
  boost_when_flags = excluded.boost_when_flags,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.zhp_hints (game_id, hint_id, card_id, level, text) values
  ('oot', 'kokiri-gear-1', 'kokiri-gear', 1, '마을 남서쪽 훈련장과 상점을 살펴보세요.'),
  ('oot', 'kokiri-gear-2', 'kokiri-gear', 2, '훈련장 낮은 통로 너머에 바위가 굴러다니고, 방패는 40루피가 필요해요.'),
  ('oot', 'kokiri-gear-3', 'kokiri-gear', 3, '훈련장 낮은 통로에서 바위를 피해 상자의 검을 얻고, 상점에서 40루피로 방패를 산 뒤 둘 다 장착하세요.'),
  ('oot', 'deku-tree-1', 'deku-tree', 1, '중앙 1층 바닥 거미줄을 더 높은 층에서 내려다보세요.'),
  ('oot', 'deku-tree-2', 'deku-tree', 2, '2층에서 뛰어내리면 튕겨 올라와요. 더 높은 3층 난간까지 올라가야 합니다.'),
  ('oot', 'deku-tree-3', 'deku-tree', 3, '3층 난간에서 1층 거미줄 정중앙을 향해 뛰어내리면 거미줄을 뚫고 지하로 내려갑니다.'),
  ('oot', 'hyrule-castle-1', 'hyrule-castle', 1, '닫힌 성문 앞에서 말론이 서 있는 쪽 벽면을 살펴보세요.'),
  ('oot', 'hyrule-castle-2', 'hyrule-castle', 2, '담쟁이덩굴을 타고 성문 위로 올라가면 반대편 사다리로 내려갈 수 있어요.'),
  ('oot', 'hyrule-castle-3', 'hyrule-castle', 3, '말론 옆 담쟁이덩굴로 성문을 넘은 뒤, 부화한 꼬꼬로 해자 옆 타론을 깨우고 상자를 밀어 배수구로 들어가세요.'),
  ('oot', 'kakariko-prep-1', 'kakariko-prep', 1, '묘지에서는 낮과 밤에 할 수 있는 행동이 달라요. 민가 침대로도 밤을 만들 수 있습니다.'),
  ('oot', 'kakariko-prep-2', 'kakariko-prep', 2, '방패가 숨겨진 비석은 밤에만 당길 수 있고, 왕가의 무덤 앞 바닥에는 트라이포스 문양이 있어요.'),
  ('oot', 'kakariko-prep-3', 'kakariko-prep', 3, '밤에 꽃이 놓인 비석 뒤에서 당겨 방패를 챙기고, 가장 안쪽 왕가의 무덤 문양 위에서 젤다의 자장가를 연주하세요.'),
  ('oot', 'songs-route-1', 'songs-route', 1, '갈림길 통로 입구에 가까이 서서 배경 음악 소리와 음표 표시를 살펴보세요.'),
  ('oot', 'songs-route-2', 'songs-route', 2, '음악 소리가 또렷하게 커지고 음표가 보이는 통로가 다음 정답 방향이에요.'),
  ('oot', 'songs-route-3', 'songs-route', 3, '미혹의 숲 입구에서 오른쪽 → 왼쪽 → 오른쪽 → 왼쪽 → 직진 → 왼쪽 → 오른쪽 순서로 가면 숲의 성역에 도착합니다.')
on conflict (game_id, hint_id) do update set
  card_id = excluded.card_id,
  level = excluded.level,
  text = excluded.text,
  updated_at = now();
