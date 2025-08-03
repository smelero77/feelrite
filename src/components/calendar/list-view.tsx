"use client"

import React from "react"
import { format, parseISO, startOfDay } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarEvent } from "./month-view"

const EVENT_TYPES: Record<string, { label: string; color: string }> = {
  cita: { label: "Cita", color: "bg-chart-1 text-chart-1" },
  recordatorio: { label: "Recordatorio", color: "bg-chart-2 text-chart-2" },
  ejercicio: { label: "Ejercicio", color: "bg-chart-3 text-chart-3" },
  meditacion: { label: "Meditación", color: "bg-chart-4 text-chart-4" },
  personal: { label: "Personal", color: "bg-chart-5 text-chart-5" }
}

interface ListViewProps {
  events: CalendarEvent[]
}

export function ListView({ events }: ListViewProps) {
  const sortedEvents = [...events]
    .sort((a, b) => {
      const dateCompare = a.date.getTime() - b.date.getTime()
      if (dateCompare !== 0) return dateCompare
      
      if (a.time && b.time) {
        return a.time.localeCompare(b.time)
      }
      return 0
    })
    .filter(event => event.date >= startOfDay(new Date()))

  const groupedEvents = sortedEvents.reduce((groups, event) => {
    const dateKey = format(event.date, "yyyy-MM-dd")
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(event)
    return groups
  }, {} as Record<string, CalendarEvent[]>)

  return (
    <div className="space-y-4">
      {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => (
        <Card key={dateKey}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {format(parseISO(dateKey), "EEEE, d 'de' MMMM yyyy", { locale: es })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dayEvents.map(event => (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-accent/20 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${event.color}`} />
                  <div className="flex-1">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                      {event.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
                      )}
                      <span>{EVENT_TYPES[event.type]?.label || event.type}</span>
                    </div>
                    {event.notes && (
                      <div className="text-sm text-muted-foreground mt-1">{event.notes}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {sortedEvents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay eventos próximos</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 