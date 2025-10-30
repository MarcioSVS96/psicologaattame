import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, LogOut, History } from "lucide-react"
import Link from "next/link"
import { format, isAfter } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    // Isso pode acontecer se o gatilho de criação de perfil falhar ou atrasar.
    // Redirecionar para o login é uma alternativa segura.
    redirect("/auth/login")
  }

  // Se o usuário for um admin, redireciona para o painel de admin
  if (profile.role === "admin") {
    redirect("/admin")
  }

  // CRUCIAL: Verifica se o perfil está completo. Se não, redireciona para a página de completar o cadastro.
  // Usamos a data de nascimento como um indicador de que o formulário detalhado foi preenchido.
  const isProfileComplete = !!profile.date_of_birth
  if (!isProfileComplete) {
    redirect("/dashboard/complete-profile")
  }

  // Busca os agendamentos para o dashboard
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*, services(*)")
    .eq("user_id", user.id)
    .order("appointment_date", { ascending: true })

  const allAppointments = appointments || []
  const upcomingAppointments = allAppointments.filter(apt => isAfter(new Date(apt.appointment_date), new Date()))
  const pastAppointments = allAppointments.filter(apt => !isAfter(new Date(apt.appointment_date), new Date()))
  const nextAppointment = upcomingAppointments[0]
  const upcomingAppointmentsCount = upcomingAppointments.length
  const pastAppointmentsCount = pastAppointments.length

  const getStatusCardClass = (status: string | undefined) => {
    if (!status) return ""
    const statusConfig = {
      scheduled: "bg-blue-50 border-blue-200",
      confirmed: "bg-green-50 border-green-200",
    }
    const key = status as keyof typeof statusConfig
    return statusConfig[key] || ""
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-serif font-bold text-navy">
                Beatriz Attame
              </Link>
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
            <h1 className="text-3xl font-bold text-navy">Meu Painel</h1>
            <p className="text-gray-600 mt-2">Gerencie suas consultas e informações pessoais</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAppointments.length > 0 ? (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Próximas Consultas</CardTitle>
                    <Calendar className="h-4 w-4 text-turquoise" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-navy">{upcomingAppointmentsCount}</div>
                    <p className="text-xs text-gray-600">Consultas agendadas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Histórico de Consultas</CardTitle>
                    <History className="h-4 w-4 text-turquoise" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-navy">{pastAppointmentsCount}</div>
                    <p className="text-xs text-gray-600">Consultas realizadas</p>
                  </CardContent>
                </Card>

                {nextAppointment && (
                  <Card className={getStatusCardClass(nextAppointment.status)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
                      <Calendar className="h-4 w-4 text-turquoise" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg font-bold text-navy">
                        {format(new Date(nextAppointment.appointment_date), "dd 'de' MMMM", { locale: ptBR })}
                      </div>
                      <p className="text-xs text-gray-600">
                        {format(new Date(nextAppointment.appointment_date), "HH:mm'h'")} - {nextAppointment.services.title}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-navy">Nenhuma consulta agendada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Você ainda não tem nenhuma consulta marcada.</p>
                  <Button asChild className="bg-turquoise hover:bg-turquoise/90 text-white">
                    <Link href="/appointment-booking">Agendar uma consulta</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-navy">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1 bg-turquoise hover:bg-turquoise/90 text-white font-bold">
                <Link href="/appointment-booking">Agendar Nova Consulta</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/my-appointments">Ver Minhas Consultas</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/dashboard/profile">Atualizar Perfil</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}