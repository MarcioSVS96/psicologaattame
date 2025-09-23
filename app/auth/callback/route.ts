import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && session) {
      // Após a sessão ser criada, busca o perfil para verificar a role
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

      if (profile) {
        // Redireciona para o painel correto com base na role
        if (profile.role === "admin") {
          return NextResponse.redirect(`${origin}/admin`)
        }
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  // Em caso de erro, redireciona para uma página de erro genérica
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
