"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Clock, DollarSign, CheckCircle, AlertCircle } from "lucide-react"
import { format, addDays, isSameDay, isAfter, isBefore, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Service {
  is_social_price: boolean
  id: string
  title: string
  description: string
  duration_minutes: number
  price: number
}

interface AppointmentBookingFormProps {
  services: Service[]
  userId: string
}

export function AppointmentBookingForm({ services, userId }: AppointmentBookingFormProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingTimes, setIsLoadingTimes] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [availableDates, setAvailableDates] = useState<string[]>([])

  // Fetch all dates that have at least one available slot
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const response = await fetch(`/api/availability/dates`)
        if (response.ok) {
          const { dates } = await response.json()
          setAvailableDates(dates)
        }
      } catch (error) {
        console.error("Failed to fetch available dates:", error)
      }
    }
    fetchAvailableDates()
  }, [])

  // Fetch available time slots when a date is selected
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([])
      return
    }

    const fetchAvailableTimes = async () => {
      setIsLoadingTimes(true)
      setSelectedTime("") // Reset selected time
      try {
        const dateString = format(selectedDate, "yyyy-MM-dd")
        const response = await fetch(`/api/availability?date=${dateString}`)
        if (!response.ok) throw new Error("Não foi possível buscar os horários.")

        const data = await response.json()
        setTimeSlots(data.slots || [])
      } catch (error) {
        console.error(error)
        setTimeSlots([])
      } finally {
        setIsLoadingTimes(false)
      }
    }

    fetchAvailableTimes()
  }, [selectedDate])

  // Check if date is available (not weekends, not past dates)
  const isDateAvailable = (date: Date) => {
    // A data está disponível se estiver na lista de datas com horários.
    const dateString = format(date, "yyyy-MM-dd")
    return availableDates.includes(dateString)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService || !selectedDate || !selectedTime) return

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const appointmentDateTime = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(":").map(Number)
      appointmentDateTime.setHours(hours, minutes, 0, 0)

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: selectedService.id,
          appointment_date: appointmentDateTime.toISOString(),
          notes: notes.trim() || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Erro ao agendar consulta")
      }

      setSubmitStatus("success")
      // Reset form
      setSelectedService(null)
      setSelectedDate(undefined)
      setSelectedTime("")
      setNotes("")
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Erro ao agendar consulta")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === "success") {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-navy">Consulta Agendada com Sucesso!</h3>
            <p className="text-gray-600">
              Sua consulta foi agendada para{" "}
              <strong>
                {selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} às {selectedTime}
              </strong>
            </p>
            <p className="text-sm text-gray-500">
              Você receberá um email de confirmação em breve. Caso precise cancelar ou reagendar, entre em contato
              conosco.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setSubmitStatus("idle")} className="bg-turquoise hover:bg-turquoise/90 text-white">
              Agendar Outra Consulta
            </Button>
            <Button asChild variant="outline">
              <a href="/dashboard">Voltar</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Service Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-navy">1. Escolha o Serviço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedService?.id === service.id
                    ? "border-turquoise bg-turquoise/5"
                    : "border-gray-200 hover:border-turquoise/50"
                }`}
                onClick={() => setSelectedService(service)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-navy">{service.title}</h3>
                    <p className="text-sm text-gray-600 text-pretty">{service.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{service.duration_minutes} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {service.is_social_price || service.price === null || typeof service.price === "undefined"
                            ? "Valor social"
                            : `R$ ${Number(service.price).toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedService?.id === service.id ? "border-turquoise bg-turquoise" : "border-gray-300"
                    }`}
                  >
                    {selectedService?.id === service.id && (
                      <div className="w-full h-full rounded-full bg-white m-0.5" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Date Selection */}
      {selectedService && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-navy">2. Escolha a Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => !isDateAvailable(date)}
                className="rounded-md border"
                locale={ptBR}
              />
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">
              Atendimento de segunda à sexta-feira. Agendamento com até 30 dias de antecedência.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Time Selection */}
      {selectedService && selectedDate && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-navy">3. Escolha o Horário</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTimes && <p className="text-center">Buscando horários...</p>}
            {!isLoadingTimes && timeSlots.length === 0 && (
              <p className="text-center text-gray-500">Nenhum horário disponível para esta data. Por favor, selecione outro dia.</p>
            )}
            {timeSlots.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {timeSlots.map((time) => {
                  const now = new Date()
                  const isTodaySelected = selectedDate ? isSameDay(selectedDate, now) : false
                  let isSlotInThePast = false

                  if (isTodaySelected && selectedDate) {
                    const [hour, minute] = time.split(":").map(Number)
                    const slotDateTime = new Date(selectedDate)
                    slotDateTime.setHours(hour, minute, 0, 0)
                    isSlotInThePast = isAfter(now, slotDateTime)
                  }

                  return (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      className={`h-12 ${
                        selectedTime === time
                          ? "bg-turquoise hover:bg-turquoise/90 text-white"
                          : isSlotInThePast
                          ? "text-red-500 border-red-200 bg-red-50/50 cursor-not-allowed"
                          : "bg-transparent hover:bg-turquoise/10"
                      }`}
                      onClick={() => setSelectedTime(time)}
                      disabled={isSlotInThePast}
                    >
                      {time}
                    </Button>
                  )
                })}
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">
              Horário de funcionamento: 9h às 18h (pausa para almoço: 12h às 13h)
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {selectedService && selectedDate && selectedTime && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-navy">4. Observações (Opcional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Conte-me um pouco sobre o que você gostaria de trabalhar na consulta</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Descreva brevemente seus objetivos para a consulta ou qualquer informação relevante..."
                rows={4}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary and Submit */}
      {selectedService && selectedDate && selectedTime && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-navy">5. Confirmar Agendamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-navy">Resumo da Consulta:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Serviço:</span>
                  <span className="font-medium">{selectedService.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">
                    {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horário:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-medium">{selectedService.duration_minutes} minutos</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-bold text-navy">R$ {selectedService.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {submitStatus === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm text-red-600 font-medium">Erro ao agendar consulta</p>
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-turquoise hover:bg-turquoise/90 text-white font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Ao confirmar o agendamento, você concorda com nossos termos de serviço. O pagamento será realizado no dia
              da consulta.
            </p>
          </CardContent>
        </Card>
      )}
    </form>
  )
}
