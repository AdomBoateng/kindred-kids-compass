# Kindred Kids Compass Backend (FastAPI + Supabase)

This backend supports all admin + teacher pages in the React app:
- Authenticated profile/session loading
- Admin management (teachers, classes, students, assignments)
- Teacher workflows (attendance, performance, notes)
- Birthday notifications
- Dashboard analytics (attendance/performance)
- Student avatar uploads to Supabase Storage

## 1) Supabase setup

### A. Create project + auth
1. Create a Supabase project.
2. In **Authentication > Providers**, enable Email provider.
3. Copy:
   - `Project URL`
   - `anon` key
   - `service_role` key

### B. Create schema
Run the SQL in `backend/supabase/schema.sql` in the Supabase SQL editor.

This creates:
- Core tables: `churches`, `profiles`, `classes`, `class_teachers`, `students`
- Activity tables: `attendance_sessions`, `attendance_records`, `performance_tests`, `performance_scores`, `student_notes`
- Notifications table + analytics functions + birthday helper function
- Row-level security policies
- Storage bucket + policies for student images

### C. Seed minimum bootstrap data
1. Insert one row in `churches`.
2. Create your first admin user in Supabase Auth.
3. Insert corresponding admin `profiles` row using that auth user's UUID.

Example:
```sql
insert into churches(name, branch_name, location)
values ('Kindred Kids', 'Central', 'Accra')
returning id;

insert into profiles(id, full_name, email, role, church_id)
values ('<auth_user_uuid>', 'Main Admin', 'admin@example.com', 'admin', '<church_uuid>');
```

### D. Buckets and images
`schema.sql` creates a public bucket named `student-avatars` and write policies that restrict upload folder root to `<church_id>/...`.

Image path convention used by API:
`{church_id}/{student_id}/{uuid}.{ext}`

## 2) Backend run

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# fill values
uvicorn app.main:app --reload --port 8000
```

## 3) API surface mapped to frontend modules

Base prefix: `/api/v1`

### Common
- `GET /common/me` -> current user for `AuthContext`
- `GET /common/notifications` -> teacher/admin notifications cards and alerts
- `GET /common/birthdays?days=30` -> birthday widgets/lists
- `GET /common/analytics/attendance` -> attendance charts
- `GET /common/analytics/performance` -> performance charts

### Admin pages
- `GET /admin/dashboard`
- `GET /admin/teachers`
- `POST /admin/teachers`
- `GET /admin/classes`
- `POST /admin/classes`
- `POST /admin/classes/assign-teacher`
- `GET /admin/students`
- `POST /admin/students`

### Teacher pages
- `GET /teacher/dashboard`
- `GET /teacher/classes`
- `GET /teacher/students`
- `POST /teacher/attendance`
- `POST /teacher/performance`
- `POST /teacher/student-notes`

### Storage
- `POST /storage/students/{student_id}/avatar`

## 4) JWT auth + authorization model

- Client logs in via Supabase Auth and passes `Authorization: Bearer <access_token>`.
- API validates token against Supabase JWKS.
- API loads profile from `profiles` table.
- Role guard:
  - `admin` routes for admin users only.
  - `teacher` routes for teacher users only.
  - shared routes available to both.

## 5) Recommended production hardening

- Put API behind HTTPS reverse proxy.
- Rotate service role keys and keep backend-only.
- Add rate-limits and structured logging.
- Move birthday notification generation to scheduled job:
  - Supabase Edge Function or `pg_cron` calling `create_daily_birthday_notifications()` daily.
