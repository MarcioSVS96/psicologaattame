import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, User, HeartPulse, Phone, Mail, Calendar, ShieldAlert, FileText } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { isAdmin } from "@/lib/auth-utils"

export default async function PatientDetailsPage({ params }: { params: { patientId: string } }) {
  const userIsAdmin = await isAdmin()
  if (!userIsAdmin) {
    redirect("/dashboard")
  }

  const supabase = await createClient()
  const { patientId } = params

  const { data: patient, error } = await supabase.from("profiles").select("*").eq("id", patientId).single()

  if (error || !patient) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Paciente não encontrado.</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/admin">Voltar para o painel</Link>
        </Button>
      </div>
    )
  }

  const InfoField = ({ label, value, icon }: { label: string; value: string | null | undefined; icon?: React.ReactNode }) => (
    <div className="flex items-start space-x-3">
      {icon && <div className="mt-1 text-turquoise">{icon}</div>}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-navy text-pretty">{value || <span className="italic text-gray-400">Não informado</span>}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-warm-gray p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-4 text-navy hover:bg-navy/10">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Pacientes
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-navy">Detalhes do Paciente</h1>
          <p className="text-gray-600 mt-1">Informações completas de {patient.full_name}.</p>
        </div>

        <div className="space-y-8">
          {/* Dados Pessoais e Contato */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-navy">
                <User className="mr-3 text-turquoise" /> Dados Pessoais e Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField label="Nome Completo" value={patient.full_name} icon={<User className="h-4 w-4" />} />
              <InfoField
                label="Data de Nascimento"
                value={patient.date_of_birth ? format(new Date(patient.date_of_birth), "dd/MM/yyyy", { locale: ptBR }) : null}
                icon={<Calendar className="h-4 w-4" />}
              />
              <InfoField label="E-mail" value={patient.email} icon={<Mail className="h-4 w-4" />} />
              <InfoField label="Telefone" value={patient.phone} icon={<Phone className="h-4 w-4" />} />
            </CardContent>
          </Card>

          {/* Contato de Emergência */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-navy">
                <ShieldAlert className="mr-3 text-turquoise" /> Contato de Emergência
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField label="Nome" value={patient.emergency_contact_name} icon={<User className="h-4 w-4" />} />
              <InfoField label="Telefone" value={patient.emergency_contact_phone} icon={<Phone className="h-4 w-4" />} />
            </CardContent>
          </Card>

          {/* Histórico Médico e Psicológico */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-navy">
                <HeartPulse className="mr-3 text-turquoise" /> Histórico Médico e Psicológico
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <InfoField label="Queixa Principal" value={patient.main_complaint} />
              <InfoField label="Histórico de Tratamentos Anteriores" value={patient.previous_treatments} />
              <InfoField label="Condições Médicas Relevantes" value={patient.medical_conditions} />
              <InfoField label="Diagnóstico Anterior" value={patient.previous_diagnosis} />
              <InfoField label="Referências Médicas" value={patient.medical_referrals} />
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-navy">
                <FileText className="mr-3 text-turquoise" /> Informações Adicionais
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField label="Estado Civil" value={patient.marital_status} />
              <InfoField label="Endereço" value={patient.address} />
              <InfoField label="Orientação Sexual" value={patient.sexual_orientation} />
              <InfoField label="Filhos" value={patient.has_children ? `Sim, ${patient.children_count}` : "Não"} />
              <InfoField label="Trabalha" value={patient.is_employed ? `Sim, ${patient.profession}` : "Não"} />
              <InfoField
                label="Religião"
                value={patient.has_religion ? `Sim, ${patient.religion_name} (${patient.is_practicing_religion ? "praticante" : "não praticante"})` : "Não"}
              />
              <InfoField className="md:col-span-2" label="Uso de Drogas/Medicação" value={patient.uses_medication ? `Sim: ${patient.medication_details}` : "Não"} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
