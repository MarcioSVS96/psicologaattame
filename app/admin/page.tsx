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

  // Get dashboard data
  const [appointmentsResult, patientsResult, messagesResult, servicesResult] = await Promise.all([
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
  ])

  return (
    <AdminDashboard
      appointments={appointmentsResult.data || []}
      patients={patientsResult.data || []}
      messages={messagesResult.data || []}
      services={servicesResult.data || []}
      user={user}
      profile={profile}
    />
  )
}
