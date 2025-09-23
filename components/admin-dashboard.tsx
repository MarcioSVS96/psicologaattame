"use client"

import { useState, useEffect, useMemo } from "react"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Users, MessageSquare, LogOut, Clock, Phone, Mail, Eye, Edit, Plus, Loader2, Search } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import Link from "next/link" 
import { format, isToday, isAfter, parseISO, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { User } from "@supabase/supabase-js"

interface AdminDashboardProps {
  appointments: any[]
  patients: any[]
  messages: any[]
  services: any[]
  user: User
  profile: any
}

export function AdminDashboard({
  appointments: initialAppointments,
  patients: initialPatients,
  messages: initialMessages,
  services: initialServices,
  user,
  profile,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [appointments, setAppointments] = useState(initialAppointments)
  const [patients, setPatients] = useState(initialPatients)
  const [messages, setMessages] = useState(initialMessages)
  const [services, setServices] = useState(initialServices)
  const [loading, setLoading] = useState(false)

  // State for forms
  const [editingAppointment, setEditingAppointment] = useState<any>(null)
  const [editingService, setEditingService] = useState<any>(null)
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false)
  const [editingMessage, setEditingMessage] = useState<any>(null)
  const [editingPatient, setEditingPatient] = useState<any>(null)
  const [isEditPatientDialogOpen, setIsEditPatientDialogOpen] = useState(false)
  const [viewingPatientHistory, setViewingPatientHistory] = useState<any>(null)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState<any>(null)
  const [isDeletePatientDialogOpen, setIsDeletePatientDialogOpen] = useState(false)
  const [patientSearchQuery, setPatientSearchQuery] = useState("")
  const [generalSettings, setGeneralSettings] = useState({ 
    sunday: { start: "09:00", end: "13:00", is_active: false },
    monday: { start: "09:00", end: "18:00", is_active: true },
    tuesday: { start: "09:00", end: "18:00", is_active: true },
    wednesday: { start: "09:00", end: "18:00", is_active: true },
    thursday: { start: "09:00", end: "18:00", is_active: true },
    friday: { start: "09:00", end: "18:00", is_active: true },
    saturday: { start: "09:00", end: "13:00", is_active: true },
  })
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [editingSettings, setEditingSettings] = useState(generalSettings)


  // State for availability management
  const [selectedDayForAvailability, setSelectedDayForAvailability] = useState<Date | undefined>(new Date())

  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    duration_minutes: "",
    is_active: true,
  })

  // Availability Management
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const dayNames = useMemo(() => ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"], [])

  const allDaySlots = useMemo(() => {
    if (!selectedDayForAvailability) return []

    const dayOfWeek = selectedDayForAvailability.getDay()
    const dayKey = dayNames[dayOfWeek] as keyof typeof generalSettings
    const daySettings = generalSettings[dayKey]

    if (!daySettings.is_active) {
      return []
    }

    const slots = []
    const [startHour, startMinute] = daySettings.start.split(":").map(Number)
    const [endHour, endMinute] = daySettings.end.split(":").map(Number)

    let currentHour = startHour
    let currentMinute = startMinute

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      slots.push(`${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`)

      // Increment by 60 minutes
      currentHour += 1
    }

    return slots
  }, [selectedDayForAvailability, generalSettings, dayNames])

  const updateAppointmentStatus = async (appointmentId: string, status: string, notes?: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appointmentId, status, notes }),
      })

      if (response.ok) {
        const { appointment } = await response.json()
        setAppointments((prev) => prev.map((apt) => (apt.id === appointmentId ? { ...apt, ...appointment } : apt)))
        setEditingAppointment(null)
      }
    } catch (error) {
      console.error("Error updating appointment:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateMessageStatus = async (messageId: string, status: string, adminNotes?: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: messageId, status, admin_notes: adminNotes }),
      })

      if (response.ok) {
        const { message } = await response.json()
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, ...message } : msg)))
        setEditingMessage(null)
      }
    } catch (error) {
      console.error("Error updating message:", error)
    } finally {
      setLoading(false)
    }
  }

  const createService = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newService.title,
          description: newService.description,
          price: Number.parseFloat(newService.price),
          duration_minutes: Number.parseInt(newService.duration_minutes),
          is_active: newService.is_active,
        }),
      })

      if (response.ok) {
        const { service } = await response.json()
        setServices((prev) => [...prev, service])
        setNewService({ title: "", description: "", price: "", duration_minutes: "", is_active: true })
      } else {
        const errorData = await response.json()
        console.error("Failed to create service:", errorData.message)
        // TODO: Show an error toast to the user
      }
    } catch (error) {
      console.error("Error creating service:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateService = async (serviceId: string, updates: any) => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: serviceId, ...updates }),
      })

      if (response.ok) {
        const { service } = await response.json()
        setServices((prev) => prev.map((svc) => (svc.id === serviceId ? { ...svc, ...service } : svc)))
        setEditingService(null)
        setIsEditServiceDialogOpen(false) // Fecha o diálogo de edição
      } else {
        const errorData = await response.json()
        console.error("Failed to update service:", errorData.message)
        // TODO: Show an error toast to the user
      }
    } catch (error) {
      console.error("Error updating service:", error)
    } finally {
      setLoading(false)
    }
  }

  const updatePatient = async (patientId: string, updates: any) => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/patients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: patientId, ...updates }),
      })

      if (response.ok) {
        const { patient } = await response.json()
        setPatients((prev) => prev.map((p) => (p.id === patientId ? { ...p, ...patient } : p)))
        setEditingPatient(null)
        setIsEditPatientDialogOpen(false)
      } else {
        const errorData = await response.json()
        console.error("Failed to update patient:", errorData.message)
      }
    } catch (error) {
      console.error("Error updating patient:", error)
    } finally {
      setLoading(false)
    }
  }

  const deletePatient = async (patientId: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/delete-patient", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      })

      if (response.ok) {
        setPatients((prev) => prev.filter((p) => p.id !== patientId))
        setIsDeletePatientDialogOpen(false)
        setPatientToDelete(null)
      } else {
        const errorData = await response.json()
        console.error("Failed to delete patient:", errorData.message)
        // TODO: Show an error toast
      }
    } catch (error) {
      console.error("Error deleting patient:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch availability for a selected day
  useEffect(() => {
    if (!selectedDayForAvailability) return

    const fetchAvailability = async () => {
      setLoading(true)
      const dateString = format(selectedDayForAvailability, "yyyy-MM-dd")
      try {
        const response = await fetch(`/api/admin/availability?date=${dateString}`)
        if (response.ok) {
          const { slots } = await response.json()
          setAvailableSlots(slots.sort())
        } else {
          console.error("Failed to fetch availability")
          setAvailableSlots([])
        }
      } catch (error) {
        console.error("Error fetching availability:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
  }, [selectedDayForAvailability])

  // Update availability (add/remove slots)
  const updateAvailability = async (newSlots: string[]) => {
    if (!selectedDayForAvailability) return
    setLoading(true)
    const dateString = format(selectedDayForAvailability, "yyyy-MM-dd")
    try {
      const response = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateString, slots: newSlots }),
      })
      if (response.ok) {
        setAvailableSlots(newSlots.sort())
      } else {
        console.error("Failed to update availability")
        // TODO: Show error toast
      }
    } catch (error) {
      console.error("Error updating availability:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSlot = (slot: string) => {
    const newSlots = availableSlots.includes(slot)
      ? availableSlots.filter((s) => s !== slot)
      : [...availableSlots, slot]

    // We call updateAvailability directly to save the change
    updateAvailability(newSlots)
  }

  // Calculate metrics
  const todayAppointments = appointments.filter((apt) => isToday(new Date(apt.appointment_date)))
  const upcomingAppointments = appointments.filter((apt) => isAfter(new Date(apt.appointment_date), new Date()))
  const unreadMessages = messages.filter((msg) => msg.status === "unread")
  const totalPatients = patients.length

  const filteredPatients = patients.filter(
    (patient) =>
      patient.full_name &&
      patient.full_name.toLowerCase().includes(patientSearchQuery.toLowerCase()),
  )

  const getPatientAppointments = (patientId: string) => {
    return appointments
      .filter((apt) => apt.profiles.id === patientId)
      .sort((a, b) => {
        return new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime()
      })
  }

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

  const getMessageStatusBadge = (status: string) => {
    const statusConfig = {
      unread: { label: "Não lida", variant: "destructive" as const },
      read: { label: "Lida", variant: "secondary" as const },
      replied: { label: "Respondida", variant: "default" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unread
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStatusCardClass = (status: string) => {
    const statusConfig = {
      scheduled: "bg-blue-50 border-l-4 border-blue-400",
      confirmed: "bg-green-50 border-l-4 border-green-500",
      completed: "bg-slate-50 border-l-4 border-slate-400",
      cancelled: "bg-red-50 border-l-4 border-red-500",
    }
    const key = status as keyof typeof statusConfig
    return statusConfig[key] || "bg-gray-50"
  }

  return (
    <div className="min-h-screen bg-warm-gray">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-serif font-bold text-navy">
                Beatriz Attame
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Painel Administrativo</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {profile?.full_name || user.email}</span>
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="appointments">Consultas</TabsTrigger>
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-navy">Painel Administrativo</h1>
              <p className="text-gray-600 mt-2">Gerencie sua prática psicológica</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
                  <Calendar className="h-4 w-4 text-turquoise" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-navy">{todayAppointments.length}</div>
                  <p className="text-xs text-gray-600">Agendadas para hoje</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Próximas Consultas</CardTitle>
                  <Clock className="h-4 w-4 text-turquoise" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-navy">{upcomingAppointments.length}</div>
                  <p className="text-xs text-gray-600">Agendamentos futuros</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
                  <Users className="h-4 w-4 text-turquoise" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-navy">{totalPatients}</div>
                  <p className="text-xs text-gray-600">Pacientes cadastrados</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mensagens Não Lidas</CardTitle>
                  <MessageSquare className="h-4 w-4 text-turquoise" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-navy">{unreadMessages.length}</div>
                  <p className="text-xs text-gray-600">Aguardando resposta</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-navy">Consultas de Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                {todayAppointments.length === 0 ? ( 
                  <p className="text-gray-500 text-center py-8">Nenhuma consulta agendada para hoje</p>
                ) : (
                  <div
                    className={`pr-2 grid grid-cols-1 md:grid-cols-2 gap-4 ${
                      todayAppointments.length > 6 ? "max-h-[32rem] overflow-y-auto" : ""
                    }`}
                  >
                    {todayAppointments.map(appointment => (
                      <div
                        key={appointment.id}
                        className={`p-4 rounded-lg flex flex-col justify-between ${getStatusCardClass(
                          appointment.status,
                        )}`}
                      >
                        <div className="space-y-1 mb-4">
                          <p className="font-medium text-navy">
                            {format(new Date(appointment.appointment_date), "HH:mm")} - {appointment.services.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            Paciente: {appointment.profiles?.full_name || "Nome não informado"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          {getStatusBadge(appointment.status)}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setEditingAppointment(appointment)}>
                                Ver Detalhes
                              </Button>
                            </DialogTrigger> 
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-navy">Gerenciar Disponibilidade</CardTitle>
                <p className="text-gray-600">Selecione um dia no calendário e habilite os horários de atendimento.</p>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8 items-start">
                {/* Calendar Column */}
                <div className="flex justify-center pt-4">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDayForAvailability}
                    onSelect={setSelectedDayForAvailability}
                    className="rounded-md border"
                    locale={ptBR}
                    disabled={(date) => date < startOfDay(new Date())}
                  />
                </div>

                {/* Availability Management Column */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-navy">
                    Horários para o dia{" "}
                    {selectedDayForAvailability
                      ? format(selectedDayForAvailability, "dd/MM/yyyy")
                      : "Nenhum dia selecionado"}
                  </h3>
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <Loader2 className="h-8 w-8 animate-spin text-turquoise" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {allDaySlots.map((slot) => {
                        const now = new Date()
                        const isTodaySelected = selectedDayForAvailability ? isToday(selectedDayForAvailability) : false
                        let isSlotInThePast = false

                        if (isTodaySelected && selectedDayForAvailability) {
                          const [hour, minute] = slot.split(":").map(Number)
                          const slotDateTime = new Date(selectedDayForAvailability)
                          slotDateTime.setHours(hour, minute)
                          isSlotInThePast = isAfter(now, slotDateTime)
                        }

                        return (
                          <Button
                            key={slot}
                            variant={availableSlots.includes(slot) ? "default" : "outline"}
                            className={`h-12 ${availableSlots.includes(slot) ? "bg-turquoise hover:bg-turquoise/90" : ""}`}
                            onClick={() => handleToggleSlot(slot)}
                            disabled={isSlotInThePast}
                          >
                            {slot}
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-navy">Próximas Consultas Agendadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`pr-2 grid grid-cols-1 md:grid-cols-2 gap-4 ${
                    upcomingAppointments.length > 4 ? "max-h-[32rem] overflow-y-auto" : ""
                  }`}
                >
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map(appointment => (
                      <div
                        key={appointment.id}
                        className={`p-4 rounded-lg flex flex-col justify-between ${getStatusCardClass(
                          appointment.status,
                        )}`}
                      >
                        <div className="space-y-1 mb-4">
                          <p className="font-medium text-navy">
                            {format(new Date(appointment.appointment_date), "dd/MM/yyyy 'às' HH:mm")} -{" "}
                            {appointment.services.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            Paciente: {appointment.profiles?.full_name || "Nome não informado"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          {getStatusBadge(appointment.status)}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setEditingAppointment(appointment)}>
                                Ver Detalhes
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8 md:col-span-2">Nenhuma consulta futura agendada.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-navy">Gerenciar Pacientes</h2>
              <p className="text-sm text-gray-600">
                {patientSearchQuery ? `Exibindo ${filteredPatients.length} de ` : "Total: "}
                {patients.length} pacientes
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar paciente por nome..."
                value={patientSearchQuery}
                onChange={(e) => setPatientSearchQuery(e.target.value)}
                className="w-full md:w-1/2 lg:w-1/3 pl-10"
              />
            </div>

            <div className="grid gap-6">
              {filteredPatients.map((patient) => (
                <Card key={patient.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <Link href={`/admin/patients/${patient.id}`} className="hover:underline">
                          <h3 className="text-lg font-semibold text-navy">{patient.full_name || "Nome não informado"}</h3>
                        </Link>
                        <div className="space-y-1 text-sm text-gray-600">
                          {patient.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>{patient.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Email disponível no sistema</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Cadastrado em {format(new Date(patient.created_at), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/patients/${patient.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Link>
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setPatientToDelete(patient)
                            setIsDeletePatientDialogOpen(true)
                          }}
                        >
                          Excluir
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingPatient(patient)
                            setIsEditPatientDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredPatients.length === 0 && patientSearchQuery && (
                <div className="text-center py-10 col-span-full">
                  <p className="text-gray-600">Nenhum paciente encontrado com o nome "{patientSearchQuery}".</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-navy">Configurações</h2>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Serviços Oferecidos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-navy">{service.title}</p>
                        <p className="text-sm text-gray-600">
                          {service.duration_minutes} min - R$ {service.price}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={service.is_active ? "default" : "secondary"}>
                          {service.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingService(service)
                                setIsEditServiceDialogOpen(true)
                              }}
                            >
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Serviço</DialogTitle>
                            </DialogHeader>
                            {editingService && (
                              <div className="space-y-4">
                                <div>
                                  <Label>Nome do Serviço</Label>
                                  <Input
                                    value={editingService.title}
                                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>Descrição</Label>
                                  <Textarea
                                    value={editingService.description || ""}
                                    onChange={(e) =>
                                      setEditingService({ ...editingService, description: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Preço (R$)</Label>
                                    <Input
                                      type="number"
                                      value={editingService.price}
                                      onChange={(e) =>
                                        setEditingService({
                                          ...editingService,
                                          price: Number.parseFloat(e.target.value),
                                        })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label>Duração (min)</Label>
                                    <Input
                                      type="number"
                                      value={editingService.duration_minutes}
                                      onChange={(e) =>
                                        setEditingService({
                                          ...editingService,
                                          duration_minutes: Number.parseInt(e.target.value),
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={editingService.is_active}
                                    onChange={(e) =>
                                      setEditingService({ ...editingService, is_active: e.target.checked })
                                    }
                                  />
                                  <Label>Serviço ativo</Label>
                                </div>
                                <Button
                                  onClick={() => updateService(editingService.id, editingService)}
                                  disabled={loading}
                                  className="w-full bg-turquoise hover:bg-turquoise/90"
                                >
                                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Salvar Alterações
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-turquoise hover:bg-turquoise/90 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Novo Serviço
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Serviço</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Nome do Serviço</Label>
                          <Input
                            value={newService.title}
                            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                            placeholder="Ex: Terapia Individual"
                          />
                        </div>
                        <div>
                          <Label>Descrição</Label>
                          <Textarea
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                            placeholder="Descrição do serviço..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Preço (R$)</Label>
                            <Input
                              type="number"
                              value={newService.price}
                              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                              placeholder="150.00"
                            />
                          </div>
                          <div>
                            <Label>Duração (min)</Label>
                            <Input
                              type="number"
                              value={newService.duration_minutes}
                              onChange={(e) => setNewService({ ...newService, duration_minutes: e.target.value })}
                              placeholder="60"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newService.is_active}
                            onChange={(e) => setNewService({ ...newService, is_active: e.target.checked })}
                          />
                          <Label>Serviço ativo</Label>
                        </div>
                        <Button
                          onClick={createService}
                          disabled={loading || !newService.title || !newService.price || !newService.duration_minutes}
                          className="w-full bg-turquoise hover:bg-turquoise/90"
                        >
                          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Criar Serviço
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-navy">Configurações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Horário de Funcionamento</h4>
                    {dayNames.map((day) => {
                      const dayKey = day as keyof typeof generalSettings
                      const settings = generalSettings[dayKey]
                      const dayLabel = {
                        sunday: "Domingo",
                        monday: "Segunda-feira",
                        tuesday: "Terça-feira",
                        wednesday: "Quarta-feira",
                        thursday: "Quinta-feira",
                        friday: "Sexta-feira",
                        saturday: "Sábado",
                      }[dayKey]

                      return (
                        <div key={day} className="flex justify-between text-sm text-gray-600">
                          <span className="capitalize">{dayLabel}:</span>
                          <span className="font-medium">
                            {settings.is_active ? `${settings.start} - ${settings.end}` : "Fechado"}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Duração Padrão das Consultas</label>
                    <p className="text-sm text-gray-600">60 minutos</p>
                  </div>
                  <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => setEditingSettings(generalSettings)}
                      >
                        Editar Horários
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Horário de Funcionamento</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
                        {(Object.keys(editingSettings) as Array<keyof typeof editingSettings>).map((day) => (
                          <div key={day} className="space-y-3 p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`switch-${day}`} className="capitalize font-semibold text-navy">
                                {
                                  {
                                    sunday: "Domingo",
                                    monday: "Segunda-feira",
                                    tuesday: "Terça-feira",
                                    wednesday: "Quarta-feira",
                                    thursday: "Quinta-feira",
                                    friday: "Sexta-feira",
                                    saturday: "Sábado",
                                  }[day]
                                }
                              </Label>
                              <Switch
                                id={`switch-${day}`}
                                checked={editingSettings[day].is_active}
                                onCheckedChange={(checked) =>
                                  setEditingSettings((prev) => ({
                                    ...prev,
                                    [day]: { ...prev[day], is_active: checked },
                                  }))
                                }
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="time"
                                step="1800" // 30-minute steps
                                value={editingSettings[day].start}
                                onChange={(e) =>
                                  setEditingSettings((prev) => ({
                                    ...prev,
                                    [day]: { ...prev[day], start: e.target.value },
                                  }))
                                }
                                disabled={!editingSettings[day].is_active}
                              />
                              <span className={!editingSettings[day].is_active ? "text-gray-400" : ""}>até</span>
                              <Input
                                type="time"
                                step="1800" // 30-minute steps
                                value={editingSettings[day].end}
                                onChange={(e) =>
                                  setEditingSettings((prev) => ({
                                    ...prev,
                                    [day]: { ...prev[day], end: e.target.value },
                                  }))
                                }
                                disabled={!editingSettings[day].is_active}
                              />
                            </div>
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            setGeneralSettings(editingSettings)
                            setIsSettingsDialogOpen(false)
                          }}
                          className="w-full bg-turquoise hover:bg-turquoise/90"
                        >
                          Salvar Alterações
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Messages Tab is missing its content block, but let's close the main component correctly first */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-navy">Mensagens de Contato</h2>
              <div className="text-sm text-gray-600">{unreadMessages.length} não lidas</div>
            </div>

            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className={message.status === "unread" ? "border-turquoise" : ""}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-navy">{message.subject}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{message.name}</span>
                          <span>{message.email}</span>
                          {message.phone && <span>{message.phone}</span>}
                        </div>
                        <p className="text-xs text-gray-500">
                          {format(new Date(message.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getMessageStatusBadge(message.status)}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setEditingMessage(message)}>
                              Responder
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Responder Mensagem</DialogTitle>
                            </DialogHeader>
                            {editingMessage && (
                              <div className="space-y-4">
                                <div>
                                  <Label>Status</Label>
                                  <Select
                                    value={editingMessage.status}
                                    onValueChange={(value) => setEditingMessage({ ...editingMessage, status: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unread">Não lida</SelectItem>
                                      <SelectItem value="read">Lida</SelectItem>
                                      <SelectItem value="replied">Respondida</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Observações Administrativas</Label>
                                  <Textarea
                                    value={editingMessage.admin_notes || ""}
                                    onChange={(e) =>
                                      setEditingMessage({ ...editingMessage, admin_notes: e.target.value })
                                    }
                                    placeholder="Adicione observações sobre esta mensagem..."
                                  />
                                </div>
                                <Button
                                  onClick={() =>
                                    updateMessageStatus(
                                      editingMessage.id,
                                      editingMessage.status,
                                      editingMessage.admin_notes,
                                    )
                                  }
                                  disabled={loading}
                                  className="w-full bg-turquoise hover:bg-turquoise/90"
                                >
                                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Atualizar Status
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <p className="text-gray-700 text-pretty">{message.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

        </Tabs>
      </main>

      {/* === DIALOGS === */}
      {/* Edit Appointment Dialog */}
      <Dialog open={!!editingAppointment} onOpenChange={(isOpen) => !isOpen && setEditingAppointment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Consulta</DialogTitle>
          </DialogHeader>
          {editingAppointment && (
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={editingAppointment.status}
                  onValueChange={(value) => setEditingAppointment({ ...editingAppointment, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendada</SelectItem>
                    <SelectItem value="confirmed">Confirmada</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Observações</Label>
                <Textarea
                  value={editingAppointment.notes || ""}
                  onChange={(e) => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
                  placeholder="Adicione observações sobre a consulta..."
                />
              </div>
              <Button
                onClick={() =>
                  updateAppointmentStatus(editingAppointment.id, editingAppointment.status, editingAppointment.notes)
                }
                disabled={loading}
                className="w-full bg-turquoise hover:bg-turquoise/90"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Patient Dialog */}
      <Dialog open={isEditPatientDialogOpen} onOpenChange={setIsEditPatientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
          </DialogHeader>
          {editingPatient && (
            <div className="space-y-4">
              <div>
                <Label>Nome Completo</Label>
                <Input
                  value={editingPatient.full_name}
                  onChange={(e) => setEditingPatient({ ...editingPatient, full_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={editingPatient.phone || ""}
                  onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                />
              </div>
              <Button
                onClick={() => updatePatient(editingPatient.id, editingPatient)}
                disabled={loading}
                className="w-full bg-turquoise hover:bg-turquoise/90"
              >
                Salvar Alterações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Patient Dialog */}
      <Dialog open={isDeletePatientDialogOpen} onOpenChange={setIsDeletePatientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          {patientToDelete && (
            <div className="space-y-4">
              <p>
                Você tem certeza que deseja excluir o paciente{" "}
                <span className="font-bold">{patientToDelete.full_name}</span>?
              </p>
              <p className="text-sm font-medium text-red-600">
                Esta ação é irreversível e removerá o usuário e todos os seus dados associados.
              </p>
              <Button
                onClick={() => deletePatient(patientToDelete.id)}
                disabled={loading}
                variant="destructive"
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sim, excluir paciente
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Patient History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Histórico de Consultas: {viewingPatientHistory?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
            {viewingPatientHistory && getPatientAppointments(viewingPatientHistory.id).length > 0 ? (
              getPatientAppointments(viewingPatientHistory.id).map((apt) => (
                <div
                  key={apt.id}
                  className={`p-3 rounded-md flex justify-between items-center ${getStatusCardClass(apt.status)}`}
                >
                  <div>
                    <p className="font-medium">{apt.services.title}</p>
                    <p className="text-sm text-gray-600">
                      {format(parseISO(apt.appointment_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  {getStatusBadge(apt.status)}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Nenhuma consulta encontrada.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
