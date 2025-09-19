import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { format } from "date-fns"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json({ message: "Data é obrigatória" }, { status: 400 })
  }

  try {
    // 1. Busca os horários definidos pelo admin para o dia
    const { data: availabilityData, error: availabilityError } = await supabase
      .from("availabilities")
      .select("slots")
      .eq("date", date)
      .single()

    if (availabilityError && availabilityError.code !== "PGRST116") {
      throw availabilityError
    }

    const definedSlots = availabilityData?.slots || []
    if (definedSlots.length === 0) {
      return NextResponse.json({ slots: [] })
    }

    // 2. Busca as consultas já agendadas para o mesmo dia
    const dayStart = new Date(`${date}T00:00:00.000Z`).toISOString()
    const dayEnd = new Date(`${date}T23:59:59.999Z`).toISOString()

    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select("appointment_date")
      .gte("appointment_date", dayStart)
      .lte("appointment_date", dayEnd)

    if (appointmentsError) {
      throw appointmentsError
    }

    const bookedSlots = appointments.map((apt) => format(new Date(apt.appointment_date), "HH:mm"))

    // 3. Retorna apenas os horários que não foram agendados
    const availableSlots = definedSlots.filter((slot: string) => !bookedSlots.includes(slot))

    return NextResponse.json({ slots: availableSlots })
  } catch (error: any) {
    console.error("Erro ao buscar datas disponíveis:", error)
    return NextResponse.json({ message: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}