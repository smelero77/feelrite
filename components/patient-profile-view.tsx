"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge" // Asegúrate de que este componente esté disponible
import { Mail, Phone, MapPin, LinkIcon, Edit, Plus, Clock, Download, ChevronRight, DollarSign } from "lucide-react" // Importar LinkIcon y otros iconos
import Link from "next/link"
import { useState } from "react"
import { EditPatientForm } from "./edit-patient-form"
import { PatientAppointmentsCalendar } from "./patient-appointments-calendar"
import { AddAppointmentForm } from "./add-appointment-form"

interface PatientProfileViewProps {
  patient: {
    id: string
    name: string
    email: string
    phone?: string | null
    address?: string | null
    avatarUrl?: string | null
    notes?: string | null
    appointments: {
      id: string
      date: Date
      time: string
      type: string
      status: string
      notes?: string | null
    }[]
    invoices: {
      id: string
      invoiceNumber: string
      date: Date
      dueDate: Date
      totalAmount: number
      status: string
      notes?: string | null
    }[]
  }
}

export function PatientProfileView({ patient }: PatientProfileViewProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddAppointmentDialogOpen, setIsAddAppointmentDialogOpen] = useState(false)

  const totalAppointments = patient.appointments.length
  const totalInvoices = patient.invoices.length
  const totalNotes = patient.notes ? 1 : 0 // Asumiendo que 'notes' es un campo único para el paciente

  return (
    <div className="p-4 md:p-8">
      {/* Cabecera de la página */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-text">Perfil del Paciente</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog open={isAddAppointmentDialogOpen} onOpenChange={setIsAddAppointmentDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-primary text-primary-foreground hover:opacity-90 px-6 py-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Agendar Cita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Agendar Nueva Cita</DialogTitle>
                <DialogDescription>
                  Completa los detalles para agendar una nueva cita para {patient.name}.
                </DialogDescription>
              </DialogHeader>
              <AddAppointmentForm patientId={patient.id} onSuccess={() => setIsAddAppointmentDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full border-border-light text-primary-text hover:bg-gray-50 bg-transparent"
              >
                <Edit className="h-4 w-4 mr-2" /> Editar Perfil
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Editar Perfil del Paciente</DialogTitle>
                <DialogDescription>
                  Realiza cambios en la información del paciente aquí. Haz clic en guardar cuando hayas terminado.
                </DialogDescription>
              </DialogHeader>
              <EditPatientForm patient={patient} onSuccess={() => setIsEditDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <Tabs defaultValue="overview" className="w-full mb-6">
        <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
          <TabsTrigger
            value="overview"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
          >
            Resumen
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
          >
            Citas
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
          >
            Facturas
          </TabsTrigger>
        </TabsList>

        {/* Contenido de la pestaña "Resumen" */}
        <TabsContent value="overview">
          {/* Este div es el contenedor principal de las dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda (1/3 del ancho en pantallas grandes) */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Tarjeta de Información del Paciente (Perfil) */}
              <Card className="bg-white border border-border-light shadow-sm">
                <CardContent className="flex flex-col items-center p-6">
                  <div className="relative mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={patient.avatarUrl || "/placeholder.svg?height=100&width=100&query=patient-avatar"}
                        alt={patient.name}
                      />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {/* Badge "PRO" añadido aquí */}
                    <Badge 
                      className="absolute -top-2 -right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold"
                    >
                      PRO
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-semibold text-primary-text mb-1">{patient.name}</h2>
                  <p className="text-secondary-text text-sm mb-4">Paciente</p>
                  {/* Estadísticas de Citas, Facturas, Notas */}
                  <div className="grid grid-cols-3 w-full border-y border-border-light py-4 mb-4">
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold text-primary-text">{totalAppointments}</span>
                      <span className="text-secondary-text text-xs">Citas</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-border-light">
                      <span className="text-xl font-bold text-primary-text">{totalInvoices}</span>
                      <span className="text-secondary-text text-xs">Facturas</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold text-primary-text">{totalNotes}</span>
                      <span className="text-secondary-text text-xs">Notas</span>
                    </div>
                  </div>
                  {/* Información de contacto */}
                  <div className="w-full space-y-3 text-primary-text text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-secondary-text" />
                      <span>{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-secondary-text" />
                      <span>{patient.phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-secondary-text" />
                      <span>{patient.address || "N/A"}</span>
                    </div>
                    {/* Enlace de ejemplo */}
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-secondary-text" />
                      <Link href="#" className="text-primary-blue hover:underline">
                        https://feelrait.com
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tarjeta de "Completa tu Perfil" */}
              <Card className="bg-white border border-border-light shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary-text">Completa tu Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full bg-primary" 
                        style={{ width: "66%" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-primary-text">66%</span>
                  </div>
                  <p className="text-secondary-text text-sm">Añade más información para mejorar la experiencia.</p>
                </CardContent>
              </Card>

              {/* Tarjeta de "Habilidades" */}
              <Card className="bg-white border border-border-light shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary-text">Habilidades</CardTitle>
                </CardHeader>
                <CardContent className="text-secondary-text text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-border-light text-primary-text">
                      Comunicación
                    </Badge>
                    <Badge variant="outline" className="border-border-light text-primary-text">
                      Empatía
                    </Badge>
                    <Badge variant="outline" className="border-border-light text-primary-text">
                      Análisis
                    </Badge>
                    <Badge variant="outline" className="border-border-light text-primary-text">
                      Gestión del Estrés
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Columna Derecha (2/3 del ancho en pantallas grandes) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Tarjeta de "Actividad Reciente" */}
              <Card className="bg-white border border-border-light shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-primary-text">Actividad Reciente</CardTitle>
                  <Link href="#" className="text-primary-blue text-sm font-medium hover:underline">
                    Ver Todo
                  </Link>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-secondary-text mt-1" />
                      <div>
                        <p className="font-medium text-primary-text">
                          Actualización de la ficha del paciente.
                          <Badge className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                            Última
                          </Badge>
                        </p>
                        <p className="text-secondary-text text-sm">
                          Realizado el{" "}
                          {new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
                        </p>
                        <p className="text-secondary-text text-sm mt-1">
                          Se actualizó la información de contacto y las notas del paciente.
                        </p>
                                        <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-white hover:opacity-90"
                  style={{ 
                    backgroundColor: 'var(--primary-blue)', 
                    borderColor: 'var(--primary-blue)'
                  }}
                >
                          <Download className="h-4 w-4 mr-2" /> Descargar Informe
                        </Button>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-secondary-text mt-1" />
                      <div>
                        <p className="font-medium text-primary-text">Nueva cita agendada.</p>
                        <p className="text-secondary-text text-sm">
                          Agendada el{" "}
                          {new Date(new Date().setDate(new Date().getDate() - 2)).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-secondary-text text-sm mt-1">Cita de seguimiento para el 25 de Julio.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-secondary-text mt-1" />
                      <div>
                        <p className="font-medium text-primary-text">Factura #INV-2024-001 emitida.</p>
                        <p className="text-secondary-text text-sm">
                          Emitida el{" "}
                          {new Date(new Date().setDate(new Date().getDate() - 5)).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-secondary-text text-sm mt-1">Factura por sesión de terapia individual.</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Tarjeta "Sobre Mí" (Notas del Paciente) */}
              <Card className="bg-white border border-border-light shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary-text">Sobre Mí</CardTitle>
                </CardHeader>
                <CardContent className="text-secondary-text text-sm">
                  {patient.notes || "No hay notas adicionales para este paciente."}
                </CardContent>
              </Card>

              {/* Tarjeta de "Conexiones" */}
              <Card className="bg-white border border-border-light shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-primary-text">Conexiones</CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Ver todas las conexiones</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Olivia Davis" />
                          <AvatarFallback>OD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-primary-text">Olivia Davis</p>
                          <p className="text-secondary-text text-sm">olivia.davis@example.com</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white hover:opacity-90"
                        style={{ backgroundColor: 'var(--primary-blue)' }}
                      >
                        Conectar
                      </Button>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="John Doe" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-primary-text">John Doe</p>
                          <p className="text-secondary-text text-sm">john.doe@example.com</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-border-light text-primary-text hover:bg-gray-50 bg-transparent"
                      >
                        Desconectar
                      </Button>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Alice Smith" />
                          <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-primary-text">Alice Smith</p>
                          <p className="text-secondary-text text-sm">alice.smith@example.com</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white hover:opacity-90"
                        style={{ backgroundColor: 'var(--primary-blue)' }}
                      >
                        Conectar
                      </Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Contenido de la pestaña "Citas" (sin cambios) */}
        <TabsContent value="appointments">
          <PatientAppointmentsCalendar 
            appointments={patient.appointments.map(appointment => ({
              ...appointment,
              patient: { name: patient.name }
            }))} 
          />
        </TabsContent>

        {/* Contenido de la pestaña "Facturas" (sin cambios) */}
        <TabsContent value="invoices">
          <Card className="bg-white border border-border-light shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary-text">Todas las Facturas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {patient.invoices && patient.invoices.length > 0 ? (
                  patient.invoices.map((invoice) => (
                    <li key={invoice.id} className="flex items-center justify-between text-primary-text">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-primary-blue" />
                        <div>
                          <p className="font-medium">Factura #{invoice.invoiceNumber}</p>
                          <p className="text-secondary-text text-sm">
                            {new Date(invoice.date).toLocaleDateString("es-ES")} - {invoice.totalAmount.toFixed(2)}€ (
                            {invoice.status})
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="text-primary-blue hover:underline text-sm font-medium"
                      >
                        Ver Detalles
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="text-secondary-text text-center py-4">
                    No hay facturas registradas para este paciente.
                  </p>
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
