-- scripts/013_fix_admin_service_policy.sql
-- Este script corrige as políticas de segurança da tabela 'services' para garantir
-- que todos os usuários (autenticados ou não) possam ver os serviços ativos.

-- 1. Habilita o RLS na tabela, caso ainda não esteja.
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 2. Remove políticas antigas para evitar conflitos.
-- A política "services_select_active" pode ter sido criada de forma incorreta anteriormente.
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
DROP POLICY IF EXISTS "services_select_active" ON public.services;

-- 3. Cria a política correta para leitura pública de serviços ativos.
-- Esta política permite que QUALQUER um (role 'public') leia os serviços que estão com 'is_active = true'.
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT
  TO public
  USING (is_active = true);

-- A política de administrador para gerenciar todos os serviços (criada no script 008)
-- continua válida e não precisa ser alterada.