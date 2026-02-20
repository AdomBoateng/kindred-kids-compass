# Kindred Kids Compass Backend (FastAPI + Supabase)

## What is included
- FastAPI backend for **admin + teacher** pages
- Supabase JWT authentication and role authorization
- Supabase Postgres schema + RLS + analytics RPCs
- Supabase Storage bucket support for student avatars
- Structured JSON request logging with request IDs
- Scheduled birthday notifications using `pg_cron`

## 1) Supabase setup

1. Create a Supabase project and enable Email auth provider.
2. Run SQL in `backend/supabase/schema.sql`.
3. Insert one church, then create an admin in Auth and `users`.
4. Confirm bucket `student-avatars` exists (schema SQL creates it).
5. Confirm `pg_cron` scheduled job exists for daily birthday notifications.

### Bootstrap SQL
```sql
insert into churches(name, branch_name, location)
values ('Kindred Kids', 'Central', 'Accra')
returning id;

insert into users(id, full_name, email, role, church_id)
values ('<auth_user_uuid>', 'Main Admin', 'admin@example.com', 'admin', '<church_uuid>');
```

## 2) Run locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

## 3) Authentication endpoints
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/signup`

### Signup behavior
- `role=admin`: creates a new church branch + admin user record.
- `role=teacher`: creates teacher user record for an existing `church_id`.

## 4) Endpoints mapped to frontend pages/modules

### Shared/common
- `GET /common/me`
- `GET /common/church`
- `GET /common/notifications`
- `POST /common/notifications`
- `GET /common/birthdays`
- `GET /common/analytics/attendance`
- `GET /common/analytics/performance`

### Admin pages
- `GET /admin/dashboard`
- `GET/PATCH /admin/church`
- `GET/POST /admin/teachers`
- `DELETE /admin/teachers/{teacher_id}`
- `GET/POST /admin/classes`
- `PATCH/DELETE /admin/classes/{class_id}`
- `POST /admin/classes/assign-teacher`
- `GET/POST /admin/students`
- `GET/PATCH/DELETE /admin/students/{student_id}`
- `GET /admin/attendance-reports`
- `GET /admin/performance-reports`

### Teacher pages
- `GET /teacher/dashboard`
- `GET /teacher/classes`
- `GET /teacher/students`
- `GET /teacher/students/{student_id}`
- `POST/GET /teacher/attendance`
- `POST/GET /teacher/performance`
- `POST /teacher/student-notes`

### Storage
- `POST /storage/students/{student_id}/avatar`

## 5) Birthday notifications schedule
`schema.sql` installs `pg_cron` and schedules:
- Job: `daily_birthday_notifications`
- Cron: `0 6 * * *`
- SQL: `select create_daily_birthday_notifications();`

## 6) Structured logging
Every request is logged as JSON with:
- timestamp, level, logger, message
- request_id, method, path, status_code, duration_ms


## 7) Frontend field-to-table alignment
- Login page: `email`, `password` -> Supabase Auth sign-in (`/auth/login`).
- Signup page: `full_name`, `email`, `password`, `branch_name`, `location`, `region`, `district`, `area` -> `users` + `churches` (`/auth/signup`).
- New Teacher page: `name/full_name`, `email`, `phone`, `password`, `bio`, `avatar` -> `users` + Auth user (`/admin/teachers`).
- New Student / Student form: `first_name`, `last_name`, `date_of_birth`, `gender`, `guardian_name`, `guardian_contact`, `allergies`, `notes`, `avatar`, `join_date`, `class_id` -> `students` (`/admin/students`, `/storage/students/{id}/avatar`).
- Create Class page: `name`, `age_group`, `description` -> `classes` (`/admin/classes`).
