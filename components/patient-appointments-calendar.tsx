"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale" // Importar el locale español
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area" // Necesitarás este componente si no lo tienes
import Link from "next/link"
import { Clock, User } from "lucide-react"

interface PatientAppointmentsCalendarProps {
  appointments: {
    id: string
    date: Date
    time: string
    type: string
    status: string
    notes?: string | null
    patient: {
      name: string
    }
  }[]
}

export function PatientAppointmentsCalendar({ appointments }: PatientAppointmentsCalendarProps) {
  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>(undefined)
  const [openPopover, setOpenPopover] = React.useState(false)

  // Crear un mapa de citas por fecha para un acceso rápido
  const appointmentsByDate = React.useMemo(() => {
    const map = new Map<string, typeof appointments>()
    appointments.forEach((appt) => {
      const dateKey = format(new Date(appt.date), "yyyy-MM-dd")
      if (!map.has(dateKey)) {
        map.set(dateKey, [])
      }
      map.get(dateKey)?.push(appt)
    })
    return map
  }, [appointments])

  // Modificadores para resaltar los días con citas
  const modifiers = {
    hasAppointments: (date: Date) => appointmentsByDate.has(format(date, "yyyy-MM-dd")),
  }

  const modifiersStyles = {
    hasAppointments: {
      border: "2px solid hsl(var(--primary-blue))", // Resaltar con un borde azul
      backgroundColor: "hsl(var(--primary-blue) / 0.1)", // Fondo ligero
      borderRadius: "0.375rem", // rounded-md
    },
  }

  const handleDayClick = (day: Date | undefined) => {
    setSelectedDay(day)
    if (day && appointmentsByDate.has(format(day, "yyyy-MM-dd"))) {
      setOpenPopover(true)
    } else {
      setOpenPopover(false)
    }
  }

  const selectedDayAppointments = selectedDay ? appointmentsByDate.get(format(selectedDay, "yyyy-MM-dd")) || [] : []

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <Calendar
          mode="single"
          selected={selectedDay}
          onSelect={handleDayClick}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          locale={es} // Establecer el idioma a español
          className="rounded-md border shadow-sm bg-white"
        />
      </div>
      <div className="flex-1">
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
          <PopoverTrigger asChild>
            {/* Un botón invisible para que el popover se abra al hacer clic en el día del calendario */}
            <Button variant="ghost" className="sr-only">
              Abrir detalles de citas
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            {selectedDayAppointments.length > 0 ? (
              <ScrollArea className="h-[200px]">
                <div className="p-4">
                  <h4 className="mb-2 text-sm font-semibold">
                    Citas para el {selectedDay ? format(selectedDay, "PPP", { locale: es }) : ""}
                  </h4>
                  <div className="space-y-4">
                    {selectedDayAppointments.map((appt) => (
                      <div key={appt.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                        <p className="text-sm font-medium text-primary-text">{appt.type}</p>
                        <div className="flex items-center text-xs text-secondary-text mt-1">
                          <Clock className="h-3 w-3 mr-1" /> {appt.time}
                        </div>
                        <div className="flex items-center text-xs text-secondary-text">
                          <User className="h-3 w-3 mr-1" /> {appt.patient.name}
                        </div>
                        <Link
                          href={`/dashboard/appointments/${appt.id}`}
                          className="text-primary-blue hover:underline text-xs mt-2 inline-block"
                        >
                          Ver Detalles
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="p-4 text-center text-secondary-text text-sm">No hay citas para este día.</div>
            )}
          </PopoverContent>
        </Popover>
        {/* Mostrar la lista de citas del día seleccionado o un mensaje */}
        <Card className="bg-white border border-border-light shadow-sm mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary-text">Citas del Día Seleccionado</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayAppointments.length > 0 ? (
              <ul className="space-y-4">
                {selectedDayAppointments.map((appt) => (
                  <li key={appt.id} className="flex items-center justify-between text-primary-text">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary-blue" />
                      <div>
                        <p className="font-medium">{appt.time}</p>
                        <p className="text-secondary-text text-sm">{appt.type}</p>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/appointments/${appt.id}`}
                      className="text-primary-blue hover:underline text-sm font-medium"
                    >
                      Ver Detalles
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-secondary-text text-center py-4">
                Selecciona un día en el calendario para ver sus citas.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
