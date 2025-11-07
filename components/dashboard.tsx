import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, Settings } from "lucide-react"
import Link from "next/link"
import { LogoutButton } from "./logout-button"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

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
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-navy">Dashboard</h1>
            <p className="text-gray-600 mt-2">Bem-vindo ao seu painel de controle</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile?.role === "patient" && (
              <>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Minhas Consultas</CardTitle>
                    <Calendar className="h-4 w-4 text-turquoise" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-navy">3</div>
                    <p className="text-xs text-gray-600">Consultas agendadas</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
                    <Calendar className="h-4 w-4 text-turquoise" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-navy">15/12/2024</div>
                    <p className="text-xs text-gray-600">14:00 - Consulta Individual</p>
                  </CardContent>
                </Card>
              </>
            )}

            {profile?.role === "admin" && (
              <>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
                    <User className="h-4 w-4 text-turquoise" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-navy">24</div>
                    <p className="text-xs text-gray-600">Pacientes ativos</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
                    <Calendar className="h-4 w-4 text-turquoise" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-navy">5</div>
                    <p className="text-xs text-gray-600">Agendadas para hoje</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
                    <Settings className="h-4 w-4 text-turquoise" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-navy">8</div>
                    <p className="text-xs text-gray-600">Não lidas</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-navy">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.role === "patient" ? (
                  <>
                    <Button asChild variant="outline" className="w-full bg-transparent">
                      <Link href="/my-appointments">Ver Minhas Consultas</Link>
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      Atualizar Perfil
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full bg-turquoise hover:bg-turquoise/90 text-white">Gerenciar Agenda</Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      Ver Pacientes
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      Configurações
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
