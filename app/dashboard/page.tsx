import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, LogOut } from "lucide-react"
import Link from "next/link"
import { format, isAfter } from "date-fns"
import { ptBR } from "date-fns/locale"
import { isAdmin } from "@/lib/auth-utils"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const userIsAdmin = await isAdmin()
  if (userIsAdmin) {
    redirect("/admin")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, services(title)")
    .eq("patient_id", user.id)
    .in("status", ["scheduled", "confirmed"])
    .order("appointment_date", { ascending: true })

  const upcomingAppointments =
    appointments?.filter((apt) => isAfter(new Date(apt.appointment_date), new Date())) || []

  const nextAppointment = upcomingAppointments[0]
  const upcomingAppointmentsCount = upcomingAppointments.length

  return (
    <div className="min-h-screen bg-warm-gray">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-serif font-bold text-navy">
                Beatriz Attame
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {profile?.full_name || user.email}</span>
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-navy">Dashboard do Paciente</h1>
            <p className="text-gray-600 mt-2">Gerencie suas consultas e informações pessoais</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingAppointmentsCount > 0 ? (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Próximas Consultas</CardTitle>
                    <Calendar className="h-4 w-4 text-turquoise" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-navy">{upcomingAppointmentsCount}</div>
                    <p className="text-xs text-gray-600">
                      {upcomingAppointmentsCount === 1 ? "Consulta agendada" : "Consultas agendadas"}
                    </p>
                  </CardContent>
                </Card>

                {nextAppointment && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
                      <Calendar className="h-4 w-4 text-turquoise" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-bold text-navy">
                        {format(new Date(nextAppointment.appointment_date), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                      <p className="text-xs text-gray-600">
                        {format(new Date(nextAppointment.appointment_date), "HH:mm")} - {nextAppointment.services?.title}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <p className="md:col-span-2 lg:col-span-3 text-gray-600">Você ainda não possui consultas agendadas.</p>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/my-appointments">Ver Minhas Consultas</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Atualizar Perfil
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-navy">Informações da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Nome:</p>
                  <p className="font-medium">{profile?.full_name || "Não informado"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Email:</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Tipo de conta:</p>
                  <p className="font-medium capitalize">Paciente</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Telefone:</p>
                  <p className="font-medium">{profile?.phone || "Não informado"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
