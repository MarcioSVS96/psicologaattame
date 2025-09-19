-- Corrigir função generate_availability_from_templates
CREATE OR REPLACE FUNCTION generate_availability_from_templates(
  p_admin_id UUID,
  p_start_date DATE,
  p_end_date DATE
) RETURNS VOID AS $$
DECLARE
  template_record RECORD;
  curr_date DATE; -- Renomeado de current_date para evitar conflito
BEGIN
  -- Loop através de cada data no intervalo
  curr_date := p_start_date;
  WHILE curr_date <= p_end_date LOOP
    -- Para cada template que corresponde ao dia da semana
    FOR template_record IN 
      SELECT * FROM availability_templates 
      WHERE admin_id = p_admin_id 
      AND day_of_week = EXTRACT(DOW FROM curr_date)
      AND is_available = true
    LOOP
      -- Inserir disponibilidade se não existir
      INSERT INTO availability (
        admin_id,
        date,
        start_time,
        end_time,
        is_available
      )
      SELECT 
        p_admin_id,
        curr_date,
        template_record.start_time,
        template_record.end_time,
        true
      WHERE NOT EXISTS (
        SELECT 1 FROM availability 
        WHERE admin_id = p_admin_id 
        AND date = curr_date 
        AND start_time = template_record.start_time
      );
    END LOOP;
    
    curr_date := curr_date + INTERVAL '1 day';
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
