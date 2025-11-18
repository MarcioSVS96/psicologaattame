-- 1. Alterar coluna date_of_birth para texto
alter table public.profiles
alter column date_of_birth type text
using date_of_birth::text;

-- 2. Recriar função handle_new_user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, full_name, role, email, phone, date_of_birth
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'patient'),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'date_of_birth', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- 3. Garantir que o trigger existe
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
