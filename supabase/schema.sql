-- ============================================================
-- HocTiengAnh Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================================

-- 0. Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. USERS (extends Supabase auth.users)
-- ============================================================
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text not null default '',
  avatar_url text,
  age int,
  role text not null default 'student' check (role in ('admin', 'student')),
  learning_goal text,           -- e.g. 'travel', 'work', 'exam', 'fun'
  total_xp int not null default 0,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_active_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create user row when signing up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. LEVELS (CEFR + age-based categories)
-- ============================================================
create table public.levels (
  id uuid primary key default uuid_generate_v4(),
  name text not null,                        -- 'Kids Cơ Bản', 'A1 - Beginner'
  slug text unique not null,                 -- 'kids-basic', 'a1-beginner'
  cefr text check (cefr in ('Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  category text not null default 'adults' check (category in ('kids', 'teens', 'adults')),
  description text,
  icon_url text,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 3. COURSES (belong to a Level)
-- ============================================================
create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  level_id uuid not null references public.levels(id) on delete cascade,
  title text not null,                       -- 'English for Kids - Animals'
  slug text unique not null,
  description text,
  thumbnail_url text,
  "order" int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 4. LESSONS (belong to a Course, categorized by skill)
-- ============================================================
create type public.skill_type as enum (
  'listening', 'speaking', 'reading', 'writing', 'grammar', 'vocabulary'
);

create table public.lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,                       -- 'Greetings & Introductions'
  slug text unique not null,
  skill public.skill_type not null,
  description text,
  xp_reward int not null default 50,
  estimated_minutes int not null default 10,
  "order" int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. EXERCISES (belong to a Lesson)
-- ============================================================
create type public.exercise_type as enum (
  'multiple_choice', 'fill_blank', 'listening', 'speaking',
  'matching', 'translation', 'reorder'
);

create table public.exercises (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  type public.exercise_type not null,
  question text not null,
  options jsonb,                             -- ["option1","option2","option3","option4"]
  correct_answer text not null,
  explanation text,                          -- Vietnamese explanation
  media_url text,                            -- audio/image for listening exercises
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 6. USER_PROGRESS (tracks per-lesson completion)
-- ============================================================
create table public.user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  score int not null default 0,              -- 0-100 percent
  xp_earned int not null default 0,
  completed boolean not null default false,
  attempts int not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(user_id, lesson_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_courses_level on public.courses(level_id);
create index idx_lessons_course on public.lessons(course_id);
create index idx_exercises_lesson on public.exercises(lesson_id);
create index idx_user_progress_user on public.user_progress(user_id);
create index idx_user_progress_lesson on public.user_progress(lesson_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Users: read own, admins read all
alter table public.users enable row level security;
create policy "Users can read own profile"   on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Admins can read all users"    on public.users for select using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- Levels, Courses, Lessons, Exercises: public read, admin write
alter table public.levels enable row level security;
create policy "Anyone can read levels"       on public.levels for select using (true);
create policy "Admins can manage levels"     on public.levels for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

alter table public.courses enable row level security;
create policy "Anyone can read courses"      on public.courses for select using (true);
create policy "Admins can manage courses"    on public.courses for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

alter table public.lessons enable row level security;
create policy "Anyone can read lessons"      on public.lessons for select using (true);
create policy "Admins can manage lessons"    on public.lessons for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

alter table public.exercises enable row level security;
create policy "Anyone can read exercises"    on public.exercises for select using (true);
create policy "Admins can manage exercises"  on public.exercises for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- UserProgress: users manage own progress
alter table public.user_progress enable row level security;
create policy "Users can read own progress"  on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for update using (auth.uid() = user_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_users_updated_at
  before update on public.users
  for each row execute procedure public.update_updated_at();

create trigger set_user_progress_updated_at
  before update on public.user_progress
  for each row execute procedure public.update_updated_at();
