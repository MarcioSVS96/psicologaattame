"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface BookAppointmentArgs {
  serviceId: string
  appointmentDate: string
}

export async function bookAppointment(args: BookAppointmentArgs) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Usuário não autenticado." }
  }

  const { serviceId, appointmentDate } = args

  const { error } = await supabase.from("appointments").insert({
    user_id: user.id,
    service_id: serviceId,
    appointment_date: appointmentDate,
    status: "scheduled",
  })

  if (error) {
    console.error("Erro ao agendar consulta:", error)
    return { error: "Não foi possível realizar o agendamento. Por favor, tente novamente." }
  }

  revalidatePath("/dashboard")
  revalidatePath("/my-appointments")
  return { error: null }
}