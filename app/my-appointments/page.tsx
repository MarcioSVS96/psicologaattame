import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MyAppointmentsList } from "@/components/my-appointments-list"

export default async function MyAppointmentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login?redirect=/my-appointments")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user's appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      `
      *,
      services (
        title,
        duration_minutes,
        price
      )
    `,
    )
    .eq("patient_id", user.id)
    .order("appointment_date", { ascending: true })

  return (
    <div className="min-h-screen bg-warm-gray">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-2xl font-serif font-bold text-navy">
                Beatriz Attame
              </a>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Minhas Consultas</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {profile?.full_name || user.email}</span>
              <a
                href="/dashboard"
                className="text-sm text-turquoise hover:text-turquoise/80 transition-colors font-medium"
              >
                Voltar
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-navy">Minhas Consultas</h1>
              <p className="text-gray-600 mt-2">Gerencie seus agendamentos e histórico de consultas</p>
            </div>
            <a
              href="/book-appointment"
              className="bg-turquoise hover:bg-turquoise/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Nova Consulta
            </a>
          </div>

          <MyAppointmentsList appointments={appointments || []} />
        </div>
      </main>
    </div>
  )
}
