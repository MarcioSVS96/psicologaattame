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

  // 2. Obter os dados da mensagem do corpo da requisição
  const { id, status, admin_notes } = await request.json()
  if (!id) {
    return NextResponse.json({ message: "ID da mensagem é obrigatório" }, { status: 400 })
  }

  // 3. Atualizar a mensagem na tabela 'contact_messages'
  const { data: updatedMessage, error } = await supabase
    .from("contact_messages")
    .update({
      status,
      admin_notes,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar mensagem:", error)
    return NextResponse.json({ message: `Erro ao atualizar mensagem: ${error.message}` }, { status: 500 })
  }

  return NextResponse.json(updatedMessage)
}

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

  // 2. Obter o ID da mensagem dos parâmetros da URL
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ message: "ID da mensagem é obrigatório" }, { status: 400 })
  }

  // 3. Excluir a mensagem da tabela 'contact_messages'
  const { error } = await supabase.from("contact_messages").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir mensagem:", error)
    return NextResponse.json({ message: `Erro ao excluir mensagem: ${error.message}` }, { status: 500 })
  }

  return NextResponse.json({ message: "Mensagem excluída com sucesso." })
}