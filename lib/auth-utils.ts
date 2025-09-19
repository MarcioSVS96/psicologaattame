import { createServerClient } from "@/lib/supabase/server"

export async function isAdmin(): Promise<boolean> {
  const supabase = await createServerClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    // Apenas Beatriz pode ser admin
    return user.email === "beatriz.attame@gmail.com"
  } catch (error) {
    console.error("Erro ao verificar admin:", error)
    return false
  }
}

export async function getUserProfile() {
  const supabase = await createServerClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    return profile
  } catch (error) {
    console.error("Erro ao obter perfil:", error)
    return null
  }
}
