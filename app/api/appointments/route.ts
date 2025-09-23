import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { service_id, appointment_date, notes } = body

    // Validate required fields
    if (!service_id || !appointment_date) {
      return NextResponse.json({ message: "Serviço e data são obrigatórios" }, { status: 400 })
    }

    // Check if the service exists and is active
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("*")
      .eq("id", service_id)
      .eq("is_active", true)
      .single()

    if (serviceError || !service) {
      return NextResponse.json({ message: "Serviço não encontrado ou inativo" }, { status: 400 })
    }

    // Check if the appointment date is in the future
    const appointmentDateTime = new Date(appointment_date)
    const now = new Date()
    if (appointmentDateTime <= now) {
      return NextResponse.json({ message: "A data da consulta deve ser no futuro" }, { status: 400 })
    }

    // Check if there's already an appointment at this time
    const { data: existingAppointment } = await supabase
      .from("appointments")
      .select("id")
      .eq("appointment_date", appointment_date)
      .neq("status", "cancelled")
      .single()

    if (existingAppointment) {
      return NextResponse.json({ message: "Este horário já está ocupado" }, { status: 400 })
    }

    // Create the appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        user_id: user.id,
        service_id,
        appointment_date,
        notes,
        status: "scheduled",
      })
      .select()
      .single()

    if (appointmentError) {
      console.error("Error creating appointment:", appointmentError)
      return NextResponse.json({ message: "Erro ao criar agendamento" }, { status: 500 })
    }

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error) {
    console.error("Error in appointments API:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    // Get user's appointments
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        services (
          title,
          duration_minutes,
          price
        )
      `,
      )
      .eq("user_id", user.id)
      .order("appointment_date", { ascending: true })

    if (error) {
      console.error("Error fetching appointments:", error)
      return NextResponse.json({ message: "Erro ao buscar agendamentos" }, { status: 500 })
    }

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error("Error in appointments API:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
