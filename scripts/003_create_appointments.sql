-- Create appointments table
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  service_id uuid references public.services(id) on delete restrict,
  appointment_date timestamp with time zone not null,
  status text default 'scheduled' check (status in ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.appointments enable row level security;

-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "appointments_patient_select_own" ON public.appointments;
DROP POLICY IF EXISTS "appointments_patient_insert_own" ON public.appointments;
DROP POLICY IF EXISTS "appointments_patient_update_own" ON public.appointments;
DROP POLICY IF EXISTS "Patients can manage their own appointments" ON public.appointments;

-- Patients can manage (select, insert, update, delete) their own appointments.
create policy "Patients can manage their own appointments"
  on public.appointments for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create index for better performance
create index if not exists appointments_user_id_idx on public.appointments(user_id);
create index if not exists appointments_date_idx on public.appointments(appointment_date);
