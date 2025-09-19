import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Função auxiliar para validar se o usuário é administrador
async function isAdmin(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  return profile?.role === "admin"
}

// GET: Busca os horários de uma data específica
export async function GET(request: Request) {
  const supabase = await createClient()
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json({ message: "Data é obrigatória" }, { status: 400 })
  }

  const { data, error } = await supabase.from("availabilities").select("slots").eq("date", date).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 é o código para "nenhuma linha encontrada", o que é normal
    console.error("Erro ao buscar disponibilidade:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  return NextResponse.json({ slots: data?.slots || [] })
}

// POST: Cria ou atualiza os horários de uma data
export async function POST(request: Request) {
  const supabase = await createClient()
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 })
  }

  const { date, slots } = await request.json()

  if (!date || !slots) {
    return NextResponse.json({ message: "Data e horários são obrigatórios" }, { status: 400 })
  }

  // `upsert` cria uma nova linha se a data não existir, ou atualiza se já existir.
  const { data, error } = await supabase
    .from("availabilities")
    .upsert({ date, slots }, { onConflict: "date" })
    .select()
    .single()

  if (error) {
    console.error("Erro ao salvar disponibilidade:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  return NextResponse.json({ availability: data })
}
