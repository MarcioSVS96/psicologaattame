-- Permite que pacientes (usuários autenticados) possam ler
-- 1. Renomeia a coluna 'patient_id' para 'user_id' para padronizar com o resto da aplicação.
-- Usamos um bloco DO para evitar erro se a coluna já foi renomeada.
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='appointments' AND column_name='patient_id') THEN
    ALTER TABLE public.appointments RENAME COLUMN patient_id TO user_id;
  END IF;
END $$;

-- 2. Remove as políticas antigas que usavam 'patient_id'.
DROP POLICY IF EXISTS "appointments_patient_select_own" ON public.appointments;
DROP POLICY IF EXISTS "appointments_patient_insert_own" ON public.appointments;
DROP POLICY IF EXISTS "appointments_patient_update_own" ON public.appointments;

-- 3. Cria uma política unificada que permite aos pacientes gerenciar seus próprios agendamentos.
CREATE POLICY "Patients can manage their own appointments"
ON public.appointments
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
