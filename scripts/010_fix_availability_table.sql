-- Corrigir tabela availability para usar admin_id
ALTER TABLE availability 
DROP COLUMN IF EXISTS created_by;

ALTER TABLE availability 
ADD COLUMN IF NOT EXISTS admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Atualizar políticas RLS para availability
DROP POLICY IF EXISTS "Users can view availability" ON availability;
DROP POLICY IF EXISTS "Admin can manage availability" ON availability;

CREATE POLICY "Admin can manage their own availability" ON availability
  FOR ALL USING (
    admin_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view availability" ON availability
  FOR SELECT USING (true);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_availability_admin_id ON availability(admin_id);
