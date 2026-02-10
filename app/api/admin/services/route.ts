import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth-utils"

export async function POST(request: Request) {
  const userIsAdmin = await isAdmin()
  if (!userIsAdmin) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 })
  }

  const { title, description, price, duration_minutes, is_active } = await request.json()

  if (!title  || !duration_minutes) {
    return NextResponse.json({ message: "Campos obrigatórios faltando" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: service, error } = await supabase
    .from("services")
    .insert({ title, description, price, duration_minutes, is_active })
    .select()
    .single()

  if (error) {
    console.error("Erro ao criar serviço:", error)
    return NextResponse.json({ message: "Falha ao criar o serviço.", error: error.message }, { status: 500 })
  }

  return NextResponse.json({ service })
}

export async function PATCH(request: Request) {
  const userIsAdmin = await isAdmin()
  if (!userIsAdmin) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 })
  }

  const { id, ...updates } = await request.json()

  if (!id) {
    return NextResponse.json({ message: "ID do serviço é obrigatório." }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: service, error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar serviço:", error)
    return NextResponse.json({ message: "Falha ao atualizar o serviço.", error: error.message }, { status: 500 })
  }

  return NextResponse.json({ service })
}

export async function DELETE(request: Request) {
  const userIsAdmin = await isAdmin()
  if (!userIsAdmin) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ message: "ID do serviço é obrigatório." }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from("services").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir serviço:", error)
    if (error.code === "23503") {
      return NextResponse.json({ message: "Não é possível excluir. Este serviço está associado a agendamentos existentes." }, { status: 409 })
    }
    return NextResponse.json({ message: "Falha ao excluir o serviço.", error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Serviço excluído com sucesso." }, { status: 200 })
}
