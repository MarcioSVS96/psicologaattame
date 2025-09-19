-- scripts/013_fix_admin_service_policy.sql

-- 1. Remover todas as políticas conflitantes ou incorretas na tabela 'services'.
-- Isso garante uma base limpa para as novas regras.
DROP POLICY IF EXISTS "Admins have full access to services" ON public.services;
DROP POLICY IF EXISTS "Admins can read all services" ON public.services;
DROP POLICY IF EXISTS "Admins can write to services" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated users to read services" ON public.services;
DROP POLICY IF EXISTS "services_select_active" ON public.services;
DROP POLICY IF EXISTS "services_admin_all" ON public.services;

-- 2. Habilita RLS na tabela 'services' (caso não esteja).
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 3. Cria a política correta para que usuários autenticados (pacientes) possam ver os serviços ativos.
CREATE POLICY "Allow authenticated users to read active services"
ON public.services
FOR SELECT
TO authenticated
USING (is_active = true);

-- 4. Cria a política correta para que administradores tenham acesso total.
-- A função is_admin_user precisa do ID do usuário, que é obtido com auth.uid().
CREATE POLICY "Admins have full access to all services"
ON public.services
FOR ALL
TO authenticated
USING (is_admin_user(auth.uid()))
WITH CHECK (is_admin_user(auth.uid()));
