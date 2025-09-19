-- scripts/014_create_availabilities_table.sql

-- 1. Cria a tabela para armazenar a disponibilidade diária
CREATE TABLE public.availabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  slots jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 2. Adiciona comentários para clareza
COMMENT ON TABLE public.availabilities IS 'Armazena os horários disponíveis para cada dia, gerenciados pelo administrador.';
COMMENT ON COLUMN public.availabilities.date IS 'A data específica para a qual a disponibilidade é definida.';
COMMENT ON COLUMN public.availabilities.slots IS 'Um array JSON de horários disponíveis no formato "HH:mm", ex: ["09:00", "10:00"].';

-- 3. Habilita a Segurança em Nível de Linha (RLS)
ALTER TABLE public.availabilities ENABLE ROW LEVEL SECURITY;

-- 4. Cria as políticas de acesso
-- Administradores têm acesso total
CREATE POLICY "Admins have full access to availabilities"
ON public.availabilities
FOR ALL
TO authenticated
USING (is_admin_user(auth.uid()))
WITH CHECK (is_admin_user(auth.uid()));

-- Usuários autenticados (pacientes) podem ler a disponibilidade
CREATE POLICY "Authenticated users can read availabilities"
ON public.availabilities
FOR SELECT
TO authenticated
USING (true);

-- 5. Cria um gatilho para atualizar automaticamente a coluna 'updated_at'
CREATE OR REPLACE FUNCTION public.handle_availabilities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_availabilities_updated
BEFORE UPDATE ON public.availabilities
FOR EACH ROW
EXECUTE FUNCTION public.handle_availabilities_updated_at();
