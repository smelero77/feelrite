"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Plus, DollarSign, Users } from "lucide-react"
import Link from "next/link"

interface DashboardClientContentProps {
  data: {
    upcomingAppointments: { id: string; time: string; name: string }[]
    pendingTasks: { text: string; action: string; link: string }[]
    activitySummary: { title: string; value: number }[]
  }
}

export function DashboardClientContent({ data }: DashboardClientContentProps) {
  useEffect(() => {
    console.log("DEBUG: DashboardClientContent montado en el cliente.")
  }, [])

  const { upcomingAppointments, pendingTasks, activitySummary } = data

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-primary-text">Panel de Control</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tarjeta superior izquierda: Próximas Citas de Hoy */}
        <Card className="bg-white border border-border-light shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary-text">Próximas Citas de Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment, index) => (
                  <li
                    key={appointment.id || index}
                    className={`flex items-center gap-3 p-3 rounded-md ${
                      index === 0 ? "bg-primary-blue/10 border-l-4 border-primary-blue" : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <Clock className="h-4 w-4 text-primary-blue" />
                    <div className="flex-1">
                      <p className="font-medium text-primary-text">{appointment.time}</p>
                      <p className="text-secondary-text text-sm">{appointment.name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-secondary-text hover:text-primary-blue"
                      asChild
                    >
                      <Link href={`/dashboard/appointments/${appointment.id}`}>
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Detalles de la cita</span>
                      </Link>
                    </Button>
                  </li>
                ))
              ) : (
                <p className="text-secondary-text text-center py-4">No hay próximas citas.</p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Tarjeta superior derecha: Acciones Rápidas */}
        <Card className="bg-white border border-border-light shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary-text">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button className="w-full rounded-full bg-primary-blue text-white hover:bg-primary-blue/90 py-3 text-base">
              Agendar Nueva Cita
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-border-light text-primary-text hover:bg-gray-50 py-3 text-base bg-transparent"
              asChild
            >
              <Link href="/dashboard/patients/new-patient-profile-display">Registrar Nuevo Paciente</Link>
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-border-light text-primary-text hover:bg-gray-50 py-3 text-base bg-transparent"
            >
              Crear Factura Rápida
            </Button>
          </CardContent>
        </Card>

        {/* Tarjeta inferior izquierda: Tareas Pendientes */}
        <Card className="bg-white border border-border-light shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary-text">Tareas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((task, index) => (
                  <li key={index} className="flex items-center justify-between text-primary-text">
                    <p className="text-base">{task.text}</p>
                    <Link href={task.link} className="text-primary-blue hover:underline text-sm font-medium">
                      [{task.action}]
                    </Link>
                  </li>
                ))
              ) : (
                <p className="text-secondary-text text-center py-4">No hay tareas pendientes.</p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Tarjeta inferior derecha: Resumen de Actividad */}
        <Card className="bg-white border border-border-light shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary-text">Resumen de Actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activitySummary.map((stat, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-md">
                  {stat.title === "Sesiones esta semana" && <Clock className="h-5 w-5 text-primary-blue" />}
                  {stat.title === "Facturas Pendientes" && <DollarSign className="h-5 w-5 text-primary-blue" />}
                  {stat.title === "Pacientes Activos" && <Users className="h-5 w-5 text-primary-blue" />}
                  <p className="text-secondary-text text-sm mt-2">{stat.title}</p>
                  <p className="text-4xl font-bold text-primary-text">{stat.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
