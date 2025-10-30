import { createServerClient } from "@/lib/supabase/server"

export async function isAdmin(): Promise<boolean> {
  const supabase = await createServerClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    // A verificação de admin deve ser baseada no perfil do usuário no banco de dados.
    // Esta é a fonte de verdade única e mais segura.
    const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profileError || !profile) return false

    return profile.role === "admin"
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
