import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppointmentBookingForm } from "@/components/appointment-booking-form"

export default async function BookAppointmentPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login?redirect=/book-appointment")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get available services
  const { data: services } = await supabase.from("services").select("*").eq("is_active", true).order("title")

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
              <span className="text-gray-600">Agendar Consulta</span>
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
          <div className="text-center">
            <h1 className="text-3xl font-bold text-navy">Agendar Nova Consulta</h1>
            <p className="text-gray-600 mt-2">Escolha o serviço, data e horário que melhor se adequam à sua agenda</p>
          </div>

          <AppointmentBookingForm services={services || []} userId={user.id} />
        </div>
      </main>
    </div>
  )
}
