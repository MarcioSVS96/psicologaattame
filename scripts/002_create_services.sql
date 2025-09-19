-- Create services table
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  duration_minutes integer not null default 60,
  price decimal(10,2),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.services enable row level security;

-- Drop existing policies
DROP POLICY IF EXISTS "services_select_active" ON public.services;
DROP POLICY IF EXISTS "services_admin_all" ON public.services;

-- Anyone can view active services
create policy "services_select_active"
  on public.services for select
  using (is_active = true);

-- Only admin can manage services
create policy "services_admin_all"
  on public.services for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Insert default services
insert into public.services (title, description, duration_minutes, price) values
('Consulta Individual', 'Sessão de terapia individual personalizada para suas necessidades específicas.', 60, 150.00),
('Terapia de Casal', 'Sessões focadas em melhorar a comunicação e relacionamento do casal.', 90, 200.00),
('Avaliação Psicológica', 'Avaliação completa para diagnóstico e planejamento terapêutico.', 120, 300.00),
('Terapia Familiar', 'Sessões que envolvem toda a família para resolver conflitos e melhorar a dinâmica familiar.', 90, 180.00);
