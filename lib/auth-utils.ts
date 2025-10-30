import { createServerClient } from "@/lib/supabase/server"

export async function isAdmin(): Promise<boolean> {
  const supabase = await createServerClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    // A verificação do admin é feita com base na variável de ambiente.
    // Isso evita expor o e-mail no código e facilita a manutenção.
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) return false // Garante que a variável está configurada
    return user.email === adminEmail
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
