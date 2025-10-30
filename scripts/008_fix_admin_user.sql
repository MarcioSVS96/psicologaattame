-- Corrigir a criação do usuário admin para Beatriz
-- scripts/008_fix_admin_user.sql
-- Este script substitui o anterior com a implementação correta
-- Ele DEVE ser executado APÓS os scripts de criação de tabelas (001 a 006).

-- 1. Garante que a coluna 'email' exista na tabela 'profiles' para futuras referências.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- 2. Cria a função central para verificar se um usuário é o administrador.
-- A verificação é feita pelo email, que é a fonte de verdade.
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id 
    AND email = '{{ .Env.ADMIN_EMAIL }}'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Atualiza a função de criação de perfil para definir a role 'admin' no momento do registro.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insere o novo usuário na tabela de perfis, definindo a role correta.
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    CASE 
      WHEN new.email = '{{ .Env.ADMIN_EMAIL }}' THEN 'admin'
      ELSE 'patient'
    END
  )
  -- Evita erro caso o perfil já exista (importante para re-execuções)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Limpa TODAS as políticas de administrador antigas que usavam o método 'role'.
-- Isso evita conflitos e garante que a nova função 'is_admin_user' seja a única regra.
DROP POLICY IF EXISTS "appointments_admin_all" ON public.appointments;
DROP POLICY IF EXISTS "profiles_admin_select_all" ON public.profiles;
DROP POLICY IF EXISTS "services_admin_all" ON public.services;
DROP POLICY IF EXISTS "contact_messages_admin_all" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_admin_update" ON public.contact_messages;
DROP POLICY IF EXISTS "admin_settings_admin_all" ON public.admin_settings;
 
 
-- 5. Recria as políticas de administrador para as tabelas principais, usando a função is_admin_user.
-- Nota: A política de 'services' será refinada no script 013 para permitir INSERT.
CREATE POLICY "Admin has full access to profiles" ON public.profiles
FOR ALL USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admin has full access to appointments" ON public.appointments
FOR ALL USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admin has full access to contact_messages" ON public.contact_messages
FOR ALL USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admin has full access to admin_settings" ON public.admin_settings
FOR ALL USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

-- A política para 'services' é criada aqui e corrigida no script 013.
-- A política de 'services' para usuários normais é criada no script 013.
CREATE POLICY "Admin has full access to services" ON public.services
FOR ALL USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));
