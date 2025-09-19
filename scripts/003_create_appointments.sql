-- Create appointments table
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade,
  service_id uuid references public.services(id) on delete restrict,
  appointment_date timestamp with time zone not null,
  status text default 'scheduled' check (status in ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.appointments enable row level security;

-- Drop existing policies
DROP POLICY IF EXISTS "appointments_patient_select_own" ON public.appointments;
DROP POLICY IF EXISTS "appointments_patient_insert_own" ON public.appointments;
DROP POLICY IF EXISTS "appointments_patient_update_own" ON public.appointments;
DROP POLICY IF EXISTS "appointments_admin_all" ON public.appointments;

-- Patients can only see their own appointments
create policy "appointments_patient_select_own"
  on public.appointments for select
  using (patient_id = auth.uid());

create policy "appointments_patient_insert_own"
  on public.appointments for insert
  with check (patient_id = auth.uid());

create policy "appointments_patient_update_own"
  on public.appointments for update
  using (patient_id = auth.uid());

-- Admin can see and manage all appointments
create policy "appointments_admin_all"
  on public.appointments for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Create index for better performance
create index if not exists appointments_patient_id_idx on public.appointments(patient_id);
create index if not exists appointments_date_idx on public.appointments(appointment_date);
