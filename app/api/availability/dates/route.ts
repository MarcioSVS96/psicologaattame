import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD

  try {
    // Busca datas futuras com slots
    const { data, error } = await supabase
      .from("availabilities")
      .select("date, slots")
      .gte("date", today)

    if (error) {
      throw error
    }

    // Filtra manualmente apenas datas que realmente têm horários
    const dates = (data || [])
      .filter(
        (row) => Array.isArray(row.slots) && row.slots.length > 0
      )
      .map((row) => row.date)

    return NextResponse.json({ dates })
  } catch (error: any) {
    console.error("Erro ao buscar datas disponíveis:", error)
    return NextResponse.json(
      { message: error.message || "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
