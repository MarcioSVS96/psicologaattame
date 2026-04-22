import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowLeft, History } from "lucide-react"
import Link from "next/link"
import { format, isAfter, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

type AppointmentRow = {
  id: string
  appointment_date: string
  status: string | null
  services:
    | {
        title: string
        duration_minutes: number
      }
    | {
        title: string
        duration_minutes: number
      }[]
    | null
}

type NormalizedAppointment = {
  id: string
  appointment_date: string
  status: string | null
  service: {
    title: string
    duration_minutes: number
  } | null
}

export default async function MyAppointmentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("id, appointment_date, status, services(title, duration_minutes)")
    .eq("user_id", user.id)
    .order("appointment_date", { ascending: false })

  if (error) {
    console.error("Erro ao buscar agendamentos:", error)
    redirect("/dashboard")
  }

  const allAppointments: NormalizedAppointment[] = ((data || []) as AppointmentRow[]).map((apt) => ({
    id: apt.id,
    appointment_date: apt.appointment_date,
    status: apt.status,
    service: Array.isArray(apt.services) ? apt.services[0] ?? null : apt.services,
  }))

  const upcomingAppointments = allAppointments.filter((apt) =>
    isAfter(parseISO(apt.appointment_date), new Date())
  )
  const pastAppointments = allAppointments.filter((apt) =>
    !isAfter(parseISO(apt.appointment_date), new Date())
  )

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="secondary">Indefinido</Badge>

    const statusConfig = {
      scheduled: { label: "Agendada", variant: "secondary" as const },
      confirmed: { label: "Confirmada", variant: "default" as const },
      completed: { label: "Concluída", variant: "outline" as const },
      cancelled: { label: "Cancelada", variant: "destructive" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const AppointmentCard = ({ appointment }: { appointment: NormalizedAppointment }) => (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="space-y-1">
          <p className="font-semibold text-navy">
            {appointment.service?.title || "Consulta agendada"}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {format(parseISO(appointment.appointment_date), "dd 'de' MMMM, yyyy 'às' HH:mm", {
              locale: ptBR,
            })}
          </p>
        </div>
        {getStatusBadge(appointment.status)}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-warm-gray p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-4 text-navy hover:bg-navy/10">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o Painel
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-navy">Minhas Consultas</h1>
          <p className="text-gray-600 mt-1">Veja aqui o histórico e os próximos agendamentos.</p>
        </div>

        {allAppointments.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle className="text-navy">Nenhuma consulta encontrada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Você ainda não agendou sua primeira consulta.</p>
              <Button asChild className="bg-turquoise hover:bg-turquoise/90 text-white">
                <Link href="/book-appointment">Agendar Agora</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4 flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-turquoise" />
                Próximas Consultas
              </h2>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((apt) => <AppointmentCard key={apt.id} appointment={apt} />)
                ) : (
                  <p className="text-gray-500 pl-2">Você não possui nenhuma consulta futura.</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4 flex items-center">
                <History className="h-6 w-6 mr-3 text-turquoise" />
                Histórico de Consultas
              </h2>
              <div className="space-y-4">
                {pastAppointments.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}