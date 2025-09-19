import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0] // Formato YYYY-MM-DD

  try {
    // Busca todas as datas futuras que têm horários definidos
    const { data, error } = await supabase
      .from("availabilities")
      .select("date")
      .gte("date", today) // Apenas datas futuras
      .not("slots", "eq", "[]") // Apenas datas que não estão vazias

    if (error) {
      throw error
    }

    const dates = data.map((item) => item.date)
    return NextResponse.json({ dates })
  } catch (error: any) {
    console.error("Erro ao buscar datas disponíveis:", error)
    return NextResponse.json({ message: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

