"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Users, MessageSquare, LogOut, Clock, Phone, Mail, Eye, Edit, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { format, isToday, isAfter } from "date-fns"
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
  patients,
  messages: initialMessages,
  services: initialServices,
  user,
  profile,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [appointments, setAppointments] = useState(initialAppointments)
  const [messages, setMessages] = useState(initialMessages)
  const [services, setServices] = useState(initialServices)
  const [loading, setLoading] = useState(false)

  // State for forms
  const [editingAppointment, setEditingAppointment] = useState<any>(null)
  const [editingService, setEditingService] = useState<any>(null)
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false)
  const [editingMessage, setEditingMessage] = useState<any>(null)
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    duration_minutes: "",
    is_active: true,
  })

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

  // Calculate metrics
  const todayAppointments = appointments.filter((apt) => isToday(new Date(apt.appointment_date)))
  const upcomingAppointments = appointments.filter((apt) => isAfter(new Date(apt.appointment_date), new Date()))
  const unreadMessages = messages.filter((msg) => msg.status === "unread")
  const totalPatients = patients.length

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
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium text-navy">
                            {format(new Date(appointment.appointment_date), "HH:mm")} - {appointment.services.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            Paciente: {appointment.profiles?.full_name || "Nome não informado"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(appointment.status)}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setEditingAppointment(appointment)}>
                                Ver Detalhes
                              </Button>
                            </DialogTrigger>
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
                                      onValueChange={(value) =>
                                        setEditingAppointment({ ...editingAppointment, status: value })
                                      }
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
                                      onChange={(e) =>
                                        setEditingAppointment({ ...editingAppointment, notes: e.target.value })
                                      }
                                      placeholder="Adicione observações sobre a consulta..."
                                    />
                                  </div>
                                  <Button
                                    onClick={() =>
                                      updateAppointmentStatus(
                                        editingAppointment.id,
                                        editingAppointment.status,
                                        editingAppointment.notes,
                                      )
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
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-navy">Gerenciar Consultas</h2>
              <Button className="bg-turquoise hover:bg-turquoise/90 text-white">Nova Consulta</Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data/Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Paciente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Serviço
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-navy font-medium">
                              {format(new Date(appointment.appointment_date), "dd/MM/yyyy")}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(new Date(appointment.appointment_date), "HH:mm")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.profiles?.full_name || "Nome não informado"}
                            </div>
                            <div className="text-sm text-gray-500">{appointment.profiles?.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{appointment.services.title}</div>
                            <div className="text-sm text-gray-500">{appointment.services.duration_minutes} min</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(appointment.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setEditingAppointment(appointment)}>
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar Consulta</DialogTitle>
                                </DialogHeader>
                                {editingAppointment && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Status</Label>
                                      <Select
                                        value={editingAppointment.status}
                                        onValueChange={(value) =>
                                          setEditingAppointment({ ...editingAppointment, status: value })
                                        }
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
                                        onChange={(e) =>
                                          setEditingAppointment({ ...editingAppointment, notes: e.target.value })
                                        }
                                        placeholder="Adicione observações sobre a consulta..."
                                      />
                                    </div>
                                    <Button
                                      onClick={() =>
                                        updateAppointmentStatus(
                                          editingAppointment.id,
                                          editingAppointment.status,
                                          editingAppointment.notes,
                                        )
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-navy">Gerenciar Pacientes</h2>
              <Button className="bg-turquoise hover:bg-turquoise/90 text-white">Adicionar Paciente</Button>
            </div>

            <div className="grid gap-6">
              {patients.map((patient) => (
                <Card key={patient.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-navy">{patient.full_name || "Nome não informado"}</h3>
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
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Histórico
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Horário de Funcionamento</label>
                    <p className="text-sm text-gray-600">Segunda à Sexta: 9h às 18h</p>
                    <p className="text-sm text-gray-600">Sábado: 9h às 13h</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Duração Padrão das Consultas</label>
                    <p className="text-sm text-gray-600">60 minutos</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Agendamento Antecipado</label>
                    <p className="text-sm text-gray-600">Até 30 dias</p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Editar Configurações
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
