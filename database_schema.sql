-- ============================================================
-- HocTiengAnh — Database Schema (Core Tables)
-- Run this in Supabase SQL Editor:
--   Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- 0. Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  avatar_url  text,
  xp          int  not null default 0,
  streak      int  not null default 0,
  current_level text not null default 'A0'
    check (current_level in ('A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'User profiles with gamification data (XP, streak, level)';

-- ============================================================
-- 2. LESSONS
-- ============================================================
create table public.lessons (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  unit_number int  not null default 1,
  is_unlocked boolean not null default false,
  created_at  timestamptz not null default now()
);

comment on table public.lessons is 'Lesson units in the learning path';

-- ============================================================
-- 3. USER_PROGRESS (tracks per-lesson completion per user)
-- ============================================================
create table public.user_progress (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  lesson_id    uuid not null references public.lessons(id)  on delete cascade,
  is_completed boolean not null default false,
  score        int not null default 0 check (score >= 0 and score <= 100),
  completed_at timestamptz,
  created_at   timestamptz not null default now(),

  unique(user_id, lesson_id)
);

comment on table public.user_progress is 'Per-user lesson completion and scores';

-- ============================================================
-- INDEXES (for query performance)
-- ============================================================
create index idx_user_progress_user   on public.user_progress(user_id);
create index idx_user_progress_lesson on public.user_progress(lesson_id);
create index idx_lessons_unit         on public.lessons(unit_number);

-- ============================================================
-- TRIGGER: Auto-create profile when new user signs up
-- ============================================================
-- This function runs automatically after a new row is inserted
-- into auth.users (i.e., after signup via Login/Register page).
-- It creates a matching row in profiles with 0 XP.

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    )
  );
  return new;
end;
$$ language plpgsql security definer;

-- Attach trigger to auth.users table
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles: users can read/update only their own profile
alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can read all profiles for leaderboard"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Lessons: anyone can read (public content)
alter table public.lessons enable row level security;

create policy "Anyone can read lessons"
  on public.lessons for select
  using (true);

create policy "Authenticated users can unlock lessons"
  on public.lessons for update
  using (auth.uid() is not null);

-- User Progress: users can manage only their own progress
alter table public.user_progress enable row level security;

create policy "Users can read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- ============================================================
-- 4. MISTAKES (tracks wrong answers for review/practice)
-- ============================================================
create table public.mistakes (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  question_content text not null,
  options          jsonb not null default '[]',
  correct_answer   text not null,
  user_answer      text,
  lesson_title     text,
  created_at       timestamptz not null default now()
);

comment on table public.mistakes is 'Wrong answers saved for spaced review practice';

create index idx_mistakes_user on public.mistakes(user_id);

alter table public.mistakes enable row level security;

create policy "Users can read own mistakes"
  on public.mistakes for select
  using (auth.uid() = user_id);

create policy "Users can insert own mistakes"
  on public.mistakes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own mistakes"
  on public.mistakes for delete
  using (auth.uid() = user_id);

-- ============================================================
-- SAMPLE DATA (Optional — remove in production)
-- ============================================================
insert into public.lessons (title, unit_number, is_unlocked) values
  ('Chào hỏi cơ bản',        1, true),
  ('Gia đình & Bạn bè',      2, false),
  ('Công việc hàng ngày',     3, false),
  ('Du lịch & Khám phá',     4, false),
  ('Ăn uống & Nhà hàng',     5, false),
  ('Mua sắm & Giá cả',       6, false);

-- ============================================================
-- 5. STORIES (Cloze Test — fill-in-the-blank reading)
-- ============================================================
-- Content format: normal text + {hidden English word/phrase}
-- Example: 'Bố ({Dad}). Đây là ({This is}) một câu chuyện.'

create table public.stories (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text,
  content     text not null,
  difficulty  text not null default 'A1'
    check (difficulty in ('A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  hearts_reward int not null default 1,
  cover_emoji text not null default '📖',
  created_at  timestamptz not null default now()
);

comment on table public.stories is 'Reading stories with cloze-test gaps using {} syntax';

alter table public.stories enable row level security;

create policy "Anyone can read stories"
  on public.stories for select
  using (true);

-- Add hearts column to profiles (for story rewards)
alter table public.profiles add column if not exists hearts int not null default 5;

-- Track completed stories per user
create table public.user_stories (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  story_id   uuid not null references public.stories(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, story_id)
);

alter table public.user_stories enable row level security;

create policy "Users can read own story progress"
  on public.user_stories for select
  using (auth.uid() = user_id);

create policy "Users can insert own story progress"
  on public.user_stories for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- SAMPLE STORIES (3 stories with cloze-test content)
-- ============================================================
insert into public.stories (title, description, content, difficulty, hearts_reward, cover_emoji) values
(
  'Bố - Dad',
  'Câu chuyện cảm động về tình cha con',
  'Bố ({Dad}). Đây không chỉ là ({This is not just}) một từ ngữ ({a word}). Ý nghĩa của từ bố ({The meaning of dad}) là tình yêu vô điều kiện ({unconditional love}).

Mỗi sáng ({Every morning}), bố thức dậy ({dad wakes up}) rất sớm ({very early}). Bố đi làm ({Dad goes to work}) để kiếm tiền ({to earn money}) nuôi gia đình ({for the family}).

Bố luôn nói ({Dad always says}): "Con hãy cố gắng học giỏi ({Study hard}), vì tương lai ({for the future}) của con ({of yours})."

Cảm ơn bố ({Thank you dad}). Con yêu bố ({I love you dad}) rất nhiều ({so much})!',
  'A1', 2, '👨'
),
(
  'Một ngày ở trường - A Day at School',
  'Theo chân Minh trong một ngày đi học',
  'Sáng nay ({This morning}), Minh thức dậy ({Minh woke up}) lúc 6 giờ ({at 6 o''clock}). Minh đánh răng ({Minh brushed his teeth}) và ăn sáng ({and had breakfast}).

Minh đi bộ tới trường ({Minh walked to school}). Bạn thân nhất ({Best friend}) của Minh là Lan. Họ cùng nhau ({They together}) vào lớp ({went to class}).

Thầy giáo nói ({The teacher said}): "Hôm nay chúng ta sẽ học ({Today we will learn}) về khoa học ({about science})."

Sau giờ học ({After class}), Minh chơi bóng đá ({Minh played football}) với bạn bè ({with friends}). Đó là ({It was}) một ngày vui vẻ ({a happy day})!',
  'A1', 1, '🏫'
),
(
  'Chuyến du lịch - The Trip',
  'Gia đình An đi du lịch biển',
  'Mùa hè năm ngoái ({Last summer}), gia đình An ({An''s family}) đi du lịch ({went on a trip}) đến biển ({to the beach}).

Họ lái xe ({They drove}) suốt ba tiếng ({for three hours}). Khi tới nơi ({When they arrived}), An rất vui ({An was very happy}). Biển thật đẹp ({The sea was beautiful})!

An xây lâu đài cát ({An built a sandcastle}) và bơi trong biển ({and swam in the sea}). Mẹ An nói ({An''s mom said}): "Cẩn thận nhé ({Be careful})!"

Buổi tối ({In the evening}), cả gia đình ({the whole family}) ăn hải sản ({ate seafood}) tại nhà hàng ({at a restaurant}). Đó là ({It was}) kỷ niệm đẹp nhất ({the best memory}) của An.',
  'A2', 2, '🏖️'
);
