import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function EnvironmentSetup() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuração do Ambiente</h1>
        <p className="text-gray-600">Instruções para configurar corretamente o sistema</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Correção da Variável NEXT_PUBLIC_SITE_URL</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p>
            <strong>Problema:</strong> A variável NEXT_PUBLIC_SITE_URL está configurada com uma URL local.
          </p>
          <p>
            <strong>Solução:</strong> Vá em <strong>Project Settings → Environment Variables</strong> e atualize:
          </p>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mt-2">
            <p>
              <strong>Para desenvolvimento:</strong>
            </p>
            <p>NEXT_PUBLIC_SITE_URL = http://localhost:3000</p>
            <br />
            <p>
              <strong>Para produção:</strong>
            </p>
            <p>NEXT_PUBLIC_SITE_URL = https://seu-dominio.vercel.app</p>
          </div>
        </AlertDescription>
      </Alert>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Scripts do Banco de Dados</AlertTitle>
        <AlertDescription className="mt-2">
          <p>Execute os scripts na seguinte ordem para criar todas as tabelas:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>001_create_profiles.sql - Tabela de perfis</li>
            <li>002_create_services.sql - Tabela de serviços</li>
            <li>003_create_appointments.sql - Tabela de agendamentos</li>
            <li>004_create_contact_messages.sql - Tabela de mensagens</li>
            <li>005_create_admin_settings.sql - Configurações admin</li>
            <li>006_create_profile_trigger.sql - Trigger de perfis</li>
            <li>008_fix_admin_user.sql - Correção do sistema admin</li>
            <li>013_fix_admin_service_policy.sql - Correção das permissões de serviços</li>
          </ol>
        </AlertDescription>
      </Alert>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Acesso Administrativo</AlertTitle>
        <AlertDescription className="mt-2">
          <p>
            O e-mail do administrador é definido pela variável de ambiente `ADMIN_EMAIL`.
          </p>
          <p>
            Apenas este email terá acesso ao painel administrativo. Outros usuários serão automaticamente cadastrados
            como pacientes.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
