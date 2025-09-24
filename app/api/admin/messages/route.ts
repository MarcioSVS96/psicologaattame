import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

async function isAdmin(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  return profile?.role === "admin"
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 })
  }

  try {
    const { ids, status } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0 || !status) {
      return NextResponse.json({ message: "Dados inválidos." }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("contact_messages")
      .update({ status })
      .in("id", ids)
      .select()

    if (error) throw error

    return NextResponse.json({ messages: data })
  } catch (error: any) {
    console.error("Erro ao atualizar mensagens:", error)
    return NextResponse.json({ message: error.message || "Erro no servidor." }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 })
  }

  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ message: "ID da mensagem é obrigatório." }, { status: 400 })
    }

    const { error } = await supabase.from("contact_messages").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ message: "Mensagem excluída com sucesso." }, { status: 200 })
  } catch (error: any) {
    console.error("Erro ao excluir mensagem:", error)
    return NextResponse.json({ message: error.message || "Erro no servidor." }, { status: 500 })
  }
}