import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(request: Request) {
  const supabase = await createClient()

  // 1. Obter o usuário logado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ message: "Acesso não autorizado" }, { status: 401 })
  }

  // 2. Obter os dados do corpo da requisição
  const { full_name, phone } = await request.json()

  // 3. Atualizar o perfil do usuário na tabela 'profiles'
  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update({
      full_name,
      phone,
    })
    .eq("id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar perfil:", error)
    return NextResponse.json({ message: `Erro ao atualizar perfil: ${error.message}` }, { status: 500 })
  }

  // 4. Revalidar o caminho do dashboard para refletir as alterações imediatamente
  //   revalidatePath("/dashboard")

  // 5. Retornar o perfil atualizado
  return NextResponse.json({ profile: updatedProfile })
}

