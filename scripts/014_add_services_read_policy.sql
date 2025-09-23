-- Permite que qualquer usuário autenticado (pacientes) possa ler a lista de serviços.
-- Isso é necessário para que o painel do paciente e a página de agendamento
-- possam exibir os detalhes dos serviços (título, preço, etc.).

CREATE POLICY "Authenticated users can view services"
ON public.services
FOR SELECT TO authenticated USING (true);