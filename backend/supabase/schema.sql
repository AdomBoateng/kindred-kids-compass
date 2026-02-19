-- Extensions
create extension if not exists "uuid-ossp";

-- Enums
create type app_role as enum ('admin', 'teacher');
create type notification_category as enum ('birthday', 'attendance', 'performance', 'general');

-- Core tables
create table if not exists churches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  branch_name text not null,
  location text not null,
  region text,
  district text,
  area text,
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  phone text,
  avatar_url text,
  role app_role not null,
  church_id uuid not null references churches(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists classes (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  name text not null,
  description text,
  age_group text not null,
  created_at timestamptz not null default now()
);

create table if not exists class_teachers (
  id uuid primary key default uuid_generate_v4(),
  class_id uuid not null references classes(id) on delete cascade,
  teacher_id uuid not null references users(id) on delete cascade,
  unique(class_id, teacher_id)
);

create table if not exists students (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  class_id uuid not null references classes(id) on delete restrict,
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  guardian_name text not null,
  guardian_contact text not null,
  allergies text,
  notes text,
  gender text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists attendance_sessions (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  class_id uuid not null references classes(id) on delete cascade,
  session_date date not null,
  recorded_by uuid not null references users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique(class_id, session_date)
);

create table if not exists attendance_records (
  id uuid primary key default uuid_generate_v4(),
  attendance_session_id uuid not null references attendance_sessions(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  present boolean not null,
  notes text,
  unique(attendance_session_id, student_id)
);

create table if not exists performance_tests (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  class_id uuid not null references classes(id) on delete cascade,
  title text not null,
  taken_on date not null,
  recorded_by uuid not null references users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists performance_scores (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid not null references performance_tests(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  score numeric(6,2) not null,
  max_score numeric(6,2) not null,
  notes text,
  unique(test_id, student_id)
);

create table if not exists student_notes (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  author_id uuid not null references users(id) on delete restrict,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  church_id uuid not null references churches(id) on delete cascade,
  target_role text not null default 'all',
  category notification_category not null default 'general',
  title text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Useful indexes
create index if not exists idx_users_church_role on users(church_id, role);
create index if not exists idx_students_church_class on students(church_id, class_id);
create index if not exists idx_attendance_sessions_church_date on attendance_sessions(church_id, session_date desc);
create index if not exists idx_performance_tests_church_date on performance_tests(church_id, taken_on desc);
create index if not exists idx_notifications_church_created on notifications(church_id, created_at desc);

-- Analytics and birthdays RPCs
create or replace function get_upcoming_birthdays(p_church_id uuid, p_days integer default 30)
returns table(student_id uuid, full_name text, class_name text, date_of_birth date, days_until_birthday integer)
language sql stable as $$
  with upcoming as (
    select
      s.id as student_id,
      concat(s.first_name, ' ', s.last_name) as full_name,
      c.name as class_name,
      s.date_of_birth,
      make_date(extract(year from current_date)::int, extract(month from s.date_of_birth)::int, extract(day from s.date_of_birth)::int) as next_bday_this_year
    from students s
    join classes c on c.id = s.class_id
    where s.church_id = p_church_id
  )
  select
    student_id,
    full_name,
    class_name,
    date_of_birth,
    case
      when next_bday_this_year >= current_date then (next_bday_this_year - current_date)
      else ((next_bday_this_year + interval '1 year')::date - current_date)
    end::int as days_until_birthday
  from upcoming
  where case
    when next_bday_this_year >= current_date then (next_bday_this_year - current_date)
    else ((next_bday_this_year + interval '1 year')::date - current_date)
  end <= p_days
  order by days_until_birthday asc;
$$;

create or replace function get_attendance_analytics(p_church_id uuid, p_teacher_id uuid default null)
returns table(session_date date, present_count bigint, total_count bigint, attendance_rate numeric)
language sql stable as $$
  select
    s.session_date,
    count(*) filter (where r.present) as present_count,
    count(*) as total_count,
    round((count(*) filter (where r.present)::numeric / nullif(count(*), 0)) * 100, 2) as attendance_rate
  from attendance_sessions s
  join attendance_records r on r.attendance_session_id = s.id
  where s.church_id = p_church_id
    and (p_teacher_id is null or exists (
      select 1 from class_teachers ct
      where ct.class_id = s.class_id and ct.teacher_id = p_teacher_id
    ))
  group by s.session_date
  order by s.session_date desc
  limit 12;
$$;

create or replace function get_performance_analytics(p_church_id uuid, p_teacher_id uuid default null)
returns table(taken_on date, avg_percent numeric)
language sql stable as $$
  select
    t.taken_on,
    round(avg((ps.score / nullif(ps.max_score, 0)) * 100), 2) as avg_percent
  from performance_tests t
  join performance_scores ps on ps.test_id = t.id
  where t.church_id = p_church_id
    and (p_teacher_id is null or exists (
      select 1 from class_teachers ct
      where ct.class_id = t.class_id and ct.teacher_id = p_teacher_id
    ))
  group by t.taken_on
  order by t.taken_on desc
  limit 12;
$$;

-- Birthday notification helper (optional scheduled by pg_cron / edge function)
create or replace function create_daily_birthday_notifications()
returns void
language plpgsql
as $$
begin
  insert into notifications(church_id, target_role, category, title, message)
  select s.church_id,
         'all',
         'birthday',
         'Upcoming birthday',
         concat(s.first_name, ' ', s.last_name, ' has a birthday in ',
                case
                  when make_date(extract(year from current_date)::int, extract(month from s.date_of_birth)::int, extract(day from s.date_of_birth)::int) >= current_date
                    then (make_date(extract(year from current_date)::int, extract(month from s.date_of_birth)::int, extract(day from s.date_of_birth)::int) - current_date)
                  else ((make_date(extract(year from current_date)::int, extract(month from s.date_of_birth)::int, extract(day from s.date_of_birth)::int) + interval '1 year')::date - current_date)
                end,
                ' days.')
  from students s
  where not exists (
    select 1 from notifications n
    where n.category = 'birthday'
      and n.church_id = s.church_id
      and n.created_at::date = current_date
      and n.message like concat('%', s.first_name, ' ', s.last_name, '%')
  );
end;
$$;

-- RLS
alter table users enable row level security;
alter table classes enable row level security;
alter table class_teachers enable row level security;
alter table students enable row level security;
alter table attendance_sessions enable row level security;
alter table attendance_records enable row level security;
alter table performance_tests enable row level security;
alter table performance_scores enable row level security;
alter table student_notes enable row level security;
alter table notifications enable row level security;

create policy "same church users" on users for select using (
  church_id = (select church_id from users where id = auth.uid())
);

create policy "same church classes" on classes for select using (
  church_id = (select church_id from users where id = auth.uid())
);

create policy "same church students" on students for all using (
  church_id = (select church_id from users where id = auth.uid())
) with check (
  church_id = (select church_id from users where id = auth.uid())
);

create policy "same church notifications" on notifications for select using (
  church_id = (select church_id from users where id = auth.uid())
);

-- Storage bucket setup (run once; adjust for existing bucket)
insert into storage.buckets (id, name, public)
values ('student-avatars', 'student-avatars', true)
on conflict (id) do nothing;

create policy "avatars public read"
on storage.objects for select
using (bucket_id = 'student-avatars');

create policy "avatars church write"
on storage.objects for insert
with check (
  bucket_id = 'student-avatars'
  and (storage.foldername(name))[1] = (
    select church_id::text from users where id = auth.uid()
  )
);

-- Schedule birthday notifications daily at 06:00 UTC
create extension if not exists pg_cron;

do $$
declare
  existing_job_id bigint;
begin
  select jobid into existing_job_id from cron.job where jobname = 'daily_birthday_notifications';
  if existing_job_id is not null then
    perform cron.unschedule(existing_job_id);
  end if;
end $$;

select cron.schedule(
  'daily_birthday_notifications',
  '0 6 * * *',
  $$select create_daily_birthday_notifications();$$
);
