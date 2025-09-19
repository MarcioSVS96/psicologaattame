import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
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

  // 2. Obter o ID do paciente do corpo da requisição
  const { patientId } = await request.json()
  if (!patientId) {
    return NextResponse.json({ message: "ID do paciente é obrigatório" }, { status: 400 })
  }

  // 3. Criar um cliente de administrador para realizar a exclusão
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // 4. Excluir o usuário do Supabase Auth (o perfil na tabela 'profiles' será excluído via trigger)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(patientId)

  if (error) {
    console.error("Erro ao excluir paciente:", error)
    return NextResponse.json({ message: `Erro ao excluir paciente: ${error.message}` }, { status: 500 })
  }

  // 5. Retornar resposta de sucesso
  return NextResponse.json({ message: "Paciente excluído com sucesso." })
}
