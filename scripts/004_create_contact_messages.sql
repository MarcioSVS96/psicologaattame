-- Create contact messages table
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text default 'unread' check (status in ('unread', 'read', 'replied')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Drop existing policies
DROP POLICY IF EXISTS "contact_messages_insert_public" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_admin_all" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_admin_update" ON public.contact_messages;

-- Anyone can insert contact messages (public contact form)
create policy "contact_messages_insert_public"
  on public.contact_messages for insert
  with check (true);

-- Only admin can view and manage contact messages
create policy "contact_messages_admin_all"
  on public.contact_messages for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "contact_messages_admin_update"
  on public.contact_messages for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
