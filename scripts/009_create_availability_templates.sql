-- Criar tabela availability_templates
CREATE TABLE IF NOT EXISTS availability_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = domingo, 6 = sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE availability_templates ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para availability_templates
CREATE POLICY "Admin can manage their own availability templates" ON availability_templates
  FOR ALL USING (
    admin_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_availability_templates_admin_id ON availability_templates(admin_id);
CREATE INDEX IF NOT EXISTS idx_availability_templates_day_of_week ON availability_templates(day_of_week);
