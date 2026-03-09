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
-- SAMPLE DATA (Optional — remove in production)
-- ============================================================
insert into public.lessons (title, unit_number, is_unlocked) values
  ('Chào hỏi cơ bản',        1, true),
  ('Gia đình & Bạn bè',      2, false),
  ('Công việc hàng ngày',     3, false),
  ('Du lịch & Khám phá',     4, false),
  ('Ăn uống & Nhà hàng',     5, false),
  ('Mua sắm & Giá cả',       6, false);
