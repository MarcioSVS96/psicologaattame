-- Create admin settings table
create table if not exists public.admin_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text not null,
  description text,
  updated_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.admin_settings enable row level security;

-- Drop existing policies
DROP POLICY IF EXISTS "admin_settings_admin_all" ON public.admin_settings;

-- Only admin can manage settings
create policy "admin_settings_admin_all"
  on public.admin_settings for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Insert default settings
insert into public.admin_settings (key, value, description) values
('business_hours', '{"monday": "09:00-18:00", "tuesday": "09:00-18:00", "wednesday": "09:00-18:00", "thursday": "09:00-18:00", "friday": "09:00-18:00", "saturday": "09:00-13:00", "sunday": "closed"}', 'Horários de funcionamento'),
('appointment_duration', '60', 'Duração padrão das consultas em minutos'),
('max_advance_booking_days', '30', 'Máximo de dias para agendamento antecipado'),
('contact_email', 'psicologaattame@gmail.com', 'Email de contato principal'),
('contact_phone', '(81) 98571-2073', 'Telefone de contato principal'),
('address', 'Recife, PE', 'Endereço do consultório');
