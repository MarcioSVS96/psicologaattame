import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(request: Request) {
  const supabase = await createClient()

  // 1. Verificar se o usuário logado é um administrador
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ message: "Acesso não autorizado" }, { status: 401 })
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ message: "Acesso negado. Somente administradores." }, { status: 403 })
  }

  // 2. Obter os dados do paciente do corpo da requisição
  const { id, full_name, phone } = await request.json()
  if (!id) {
    return NextResponse.json({ message: "ID do paciente é obrigatório" }, { status: 400 })
  }

  // 3. Atualizar o perfil do paciente na tabela 'profiles'
  const { data: updatedPatient, error } = await supabase
    .from("profiles")
    .update({
      full_name,
      phone,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar paciente:", error)
    return NextResponse.json({ message: `Erro ao atualizar paciente: ${error.message}` }, { status: 500 })
  }

  // 4. Retornar o paciente atualizado
  return NextResponse.json({ patient: updatedPatient })
}
