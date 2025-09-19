"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, FileText, AlertCircle } from "lucide-react"
import { format, isAfter, isBefore, addHours } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Appointment {
  id: string
  appointment_date: string
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
  notes: string | null
  services: {
    title: string
    duration_minutes: number
    price: number
  }
}

interface MyAppointmentsListProps {
  appointments: Appointment[]
}

export function MyAppointmentsList({ appointments }: MyAppointmentsListProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: "Agendada", variant: "secondary" as const },
      confirmed: { label: "Confirmada", variant: "default" as const },
      completed: { label: "Concluída", variant: "outline" as const },
      cancelled: { label: "Cancelada", variant: "destructive" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const canCancelAppointment = (appointmentDate: string) => {
    const appointment = new Date(appointmentDate)
    const now = new Date()
    const twentyFourHoursBefore = addHours(appointment, -24)

    return isAfter(appointment, now) && isBefore(now, twentyFourHoursBefore)
  }

  const upcomingAppointments = appointments.filter((apt) => {
    const appointmentDate = new Date(apt.appointment_date)
    const now = new Date()
    return isAfter(appointmentDate, now) && apt.status !== "cancelled"
  })

  const pastAppointments = appointments.filter((apt) => {
    const appointmentDate = new Date(apt.appointment_date)
    const now = new Date()
    return isBefore(appointmentDate, now) || apt.status === "cancelled"
  })

  if (appointments.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center space-y-4">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-navy">Nenhuma consulta agendada</h3>
            <p className="text-gray-600">Você ainda não possui consultas agendadas.</p>
          </div>
          <Button asChild className="bg-turquoise hover:bg-turquoise/90 text-white">
            <a href="/book-appointment">Agendar Primeira Consulta</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-navy">Próximas Consultas</h2>
          <div className="grid gap-4">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-navy">{appointment.services.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(appointment.appointment_date), "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(appointment.appointment_date), "HH:mm")}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-turquoise" />
                      <span>Duração: {appointment.services.duration_minutes} minutos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-turquoise" />
                      <span>Valor: R$ {appointment.services.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Observações:</p>
                          <p className="text-sm text-gray-600">{appointment.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {canCancelAppointment(appointment.appointment_date) && (
                    <div className="flex items-start space-x-2 bg-yellow-50 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-yellow-800">
                          Você pode cancelar esta consulta até 24 horas antes do horário agendado.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2 text-red-600 border-red-200 bg-transparent">
                          Cancelar Consulta
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-navy">Histórico de Consultas</h2>
          <div className="grid gap-4">
            {pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-0 shadow-md opacity-75">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-navy">{appointment.services.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(appointment.appointment_date), "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(appointment.appointment_date), "HH:mm")}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Duração: {appointment.services.duration_minutes} minutos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Valor: R$ {appointment.services.price.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
