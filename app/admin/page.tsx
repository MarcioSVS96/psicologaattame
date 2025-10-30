import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/auth-utils"
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

  const userIsAdmin = await isAdmin()
  if (!userIsAdmin) {
    redirect("/dashboard")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Se o perfil não for encontrado, é um estado inesperado. Redirecionar para o login.
  if (!profile) {
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
      .select("id, title, author_name, created_at, status, summary, content, image_url, image_alt")
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
