import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth-utils"

export async function GET() {
  const supabase = await createClient()
  // Esta rota pode ser acessada por qualquer pessoa para buscar as configurações de horário
  const { data, error } = await supabase.from("admin_settings").select("value").eq("key", "business_hours").single()

  if (error) {
    console.error("Erro ao buscar horários de funcionamento:", error)
    // Retorna um objeto vazio se não encontrar, para não quebrar o front-end
    return NextResponse.json({ settings: {} })
  }

  // O valor é armazenado como texto JSON, então precisamos fazer o parse
  const settings = JSON.parse(data.value || "{}")

  return NextResponse.json({ settings })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const userIsAdmin = await isAdmin()

  if (!userIsAdmin) {
    return NextResponse.json({ message: "Acesso negado." }, { status: 403 })
  }

  const settings = await request.json()

  if (!settings) {
    return NextResponse.json({ message: "Configurações são obrigatórias." }, { status: 400 })
  }

  // Usamos upsert para criar a configuração se não existir, ou atualizar se já existir.
  const { data, error } = await supabase
    .from("admin_settings")
    .upsert({ key: "business_hours", value: JSON.stringify(settings) }, { onConflict: "key" })
    .select()
    .single()

  if (error) {
    console.error("Erro ao salvar configurações:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }

  return NextResponse.json({ settings: data })
}