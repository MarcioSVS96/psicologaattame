"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarIcon, Clock, Loader2, ArrowLeft } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { bookAppointment } from "./actions"

interface Service {
  id: string
  title: string
  description: string
  price: number
  duration_minutes: number
}

type Profile = {
  full_name: string
  email: string
}

export default function AppointmentBookingPage() {
  const supabase = createClient()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: servicesData } = await supabase.from("services").select("*").eq("is_active", true)
      const { data: profileData } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

      setServices(servicesData || [])
      setProfile({
        full_name: profileData?.full_name || "",
        email: user.email || "",
      })
      setIsLoading(false)
    }
    fetchData()
  }, [supabase, router])

  useEffect(() => {
    if (selectedDate) {
      const fetchSlots = async () => {
        setIsLoading(true)
        const dateString = format(selectedDate, "yyyy-MM-dd")
        try {
          const response = await fetch(`/api/availability?date=${dateString}`)
          if (!response.ok) {
            throw new Error("Falha ao buscar horários")
          }
          const data = await response.json()
          setAvailableSlots(data.slots || [])
        } catch (error) {
          console.error("Erro ao buscar horários:", error)
          setAvailableSlots([])
        }
        setIsLoading(false)
      }
      fetchSlots()
    }
  }, [selectedDate, supabase])

  const handleSelectService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      setSelectedService(service)
    }
  }

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setSelectedSlot(null)
    }
  }

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot)
  }

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) {
      setError("Informações incompletas para o agendamento.")
      return
    }

    const [hour, minute] = selectedSlot.split(":").map(Number)
    const appointmentDate = new Date(selectedDate)
    appointmentDate.setHours(hour, minute)

    startTransition(async () => {
      const result = await bookAppointment({
        serviceId: selectedService.id,
        appointmentDate: appointmentDate.toISOString(),
      })

      if (result.error) {
        setError(result.error)
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    })
  }

  if (isLoading && services.length === 0) {
    return (
      <div className="min-h-screen bg-warm-gray flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-turquoise" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-gray flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-navy">Agende sua Consulta</CardTitle>
          <CardDescription>Siga os passos abaixo para marcar seu horário.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* 1. Service Selection */}
          <section>
            <h3 className="text-lg font-semibold text-navy border-b pb-2">1. Escolha o Serviço</h3>
            <div className="pt-4">
              <Select onValueChange={handleSelectService}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um serviço..." />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title} - R$ {service.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* 2. Date and Time */}
          {selectedService && (
            <section>
              <h3 className="text-lg font-semibold text-navy border-b pb-2">2. Escolha a Data e Horário</h3>
              <div className="grid md:grid-cols-2 gap-8 pt-4">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelectDate}
                    disabled={date => date < startOfDay(new Date())}
                    className="rounded-md border"
                    locale={ptBR}
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-navy">
                    {selectedDate ? `Horários para ${format(selectedDate, "dd/MM")}` : "Selecione uma data"}
                  </h4>
                  {isLoading && selectedDate ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-turquoise" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.length > 0 && selectedDate ? (
                        availableSlots.map(slot => (
                          <Button
                            key={slot}
                            variant={selectedSlot === slot ? "default" : "outline"}
                            onClick={() => handleSelectSlot(slot)}
                            className={selectedSlot === slot ? "bg-turquoise hover:bg-turquoise/90" : ""}
                          >
                            {slot}
                          </Button>
                        ))
                      ) : (
                        <p className="col-span-3 text-sm text-gray-500">
                          {selectedDate
                            ? "Nenhum horário disponível para esta data."
                            : "Selecione uma data para ver os horários."}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* 3. Confirmation */}
          {selectedService && selectedDate && selectedSlot && (
            <section>
              <h3 className="text-lg font-semibold text-navy border-b pb-2">3. Confirme seu Agendamento</h3>
              <div className="space-y-6 text-gray-700 pt-4">
                <div className="p-4 bg-stone-100 rounded-lg">
                  <h4 className="font-semibold text-navy">Detalhes da Consulta</h4>
                  <p>
                    <strong>Serviço:</strong> {selectedService.title}
                  </p>
                  <p>
                    <strong>Data:</strong> {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <p>
                    <strong>Horário:</strong> {selectedSlot}
                  </p>
                  <p>
                    <strong>Duração:</strong> {selectedService.duration_minutes} minutos
                  </p>
                  <p className="font-bold mt-2">
                    <strong>Valor:</strong> R$ {selectedService.price.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-stone-100 rounded-lg">
                  <h4 className="font-semibold text-navy">Seus Dados</h4>
                  <p>
                    <strong>Nome:</strong> {profile?.full_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {profile?.email}
                  </p>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            </section>
          )}
        </CardContent>
        {selectedService && selectedDate && selectedSlot && (
          <CardFooter>
            <Button onClick={handleConfirmBooking} className="w-full bg-turquoise hover:bg-turquoise/90" disabled={isPending}>
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirmando...</> : "Confirmar Agendamento"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
