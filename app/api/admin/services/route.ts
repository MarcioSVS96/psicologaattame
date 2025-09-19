import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { isAdmin as checkIsAdmin } from "@/lib/auth-utils"

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !(await checkIsAdmin())) {
    return NextResponse.json({ message: "Acesso não autorizado" }, { status: 401 })
  }

  const { title, description, price, duration_minutes, is_active } = await request.json()

  if (!title || !price || !duration_minutes) {
    return NextResponse.json({ message: "Campos obrigatórios faltando" }, { status: 400 })
  }

  const { data: service, error } = await supabase
    .from("services")
    .insert({ title, description, price, duration_minutes, is_active })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  return NextResponse.json({ service })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !(await checkIsAdmin())) {
    return NextResponse.json({ message: "Acesso não autorizado" }, { status: 401 })
  }

  const { id, ...updates } = await request.json()

  if (!id) {
    return NextResponse.json({ message: "ID do serviço é obrigatório" }, { status: 400 })
  }

  const { data: service, error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  return NextResponse.json({ service })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !(await checkIsAdmin())) {
    return NextResponse.json({ message: "Acesso não autorizado" }, { status: 401 })
  }

  const { id } = await request.json()

  if (!id) {
    return NextResponse.json({ message: "ID do serviço é obrigatório" }, { status: 400 })
  }

  const { error } = await supabase.from("services").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Serviço excluído com sucesso" })
}
