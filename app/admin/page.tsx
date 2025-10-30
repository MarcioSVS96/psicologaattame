import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
// A função `isAdmin` agora é a única fonte de verdade para verificar o acesso de administrador.
import { isAdmin, getUserProfile } from "@/lib/auth-utils"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login?redirect=/admin")
  }

  // Esta função agora verifica o 'role' do perfil internamente.
  const userIsAdmin = await isAdmin()
  if (!userIsAdmin) {
    redirect("/dashboard")
  }

  // O perfil completo é necessário para o dashboard, então o buscamos aqui.
  const profile = await getUserProfile()

  if (!profile) {
    // Se o usuário é admin mas não tem perfil, é um estado inconsistente.
    redirect("/auth/login?redirect=/admin")
  }

  // Get dashboard data
  const [appointmentsResult, patientsResult, messagesResult, servicesResult, postsResult] = await Promise.all([
    supabase
      .from("appointments")
      .select(
        `
        *,
        services (title, duration_minutes, price),
        profiles!appointments_patient_id_fkey (full_name, phone)
      `,
      )
      .order("appointment_date", { ascending: true }),
    supabase.from("profiles").select("*").eq("role", "patient").order("created_at", { ascending: false }),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    supabase.from("services").select("*").order("title"),
    supabase
      .from("posts")
      .select("id, title, author_name, created_at, status, summary, content, image_url, image_alt, view_count")
      .order("created_at", { ascending: false }),
  ])

  return (
    <AdminDashboard
      appointments={appointmentsResult.data || []}
      patients={patientsResult.data || []}
      messages={messagesResult.data || []}
      services={servicesResult.data || []}
      posts={postsResult.data || []}
      user={user}
      profile={profile}
    />
  )
}
