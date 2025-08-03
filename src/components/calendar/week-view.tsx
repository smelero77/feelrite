"use client"

import React from "react"
import { 
  format, 
  eachDayOfInterval, 
  isSameDay, 
  isToday,
  startOfWeek as getStartOfWeek,
  endOfWeek as getEndOfWeek
} from "date-fns"
import { es } from "date-fns/locale"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CalendarEvent } from "./month-view"

const EVENT_TYPES: Record<string, { label: string; color: string }> = {
  cita: { label: "Cita", color: "bg-chart-1 text-chart-1" },
  recordatorio: { label: "Recordatorio", color: "bg-chart-2 text-chart-2" },
  ejercicio: { label: "Ejercicio", color: "bg-chart-3 text-chart-3" },
  meditacion: { label: "Meditación", color: "bg-chart-4 text-chart-4" },
  personal: { label: "Personal", color: "bg-chart-5 text-chart-5" }
}

interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDragStart?: (event: CalendarEvent) => void
  onDragEnd?: () => void
  onDrop?: (targetDate: Date, targetTime?: string) => void
  draggedEvent?: CalendarEvent | null
}

export function WeekView({ 
  currentDate, 
  events, 
  onDragStart, 
  onDragEnd, 
  onDrop, 
  draggedEvent 
}: WeekViewProps) {
  const weekStart = getStartOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ 
    start: weekStart, 
    end: getEndOfWeek(currentDate, { weekStartsOn: 1 }) 
  })
  
  const hours = Array.from({ length: 24 }, (_, i) => i).filter(hour => hour !== 0)

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropOnTimeSlot = (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault()
    if (onDrop) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`
      onDrop(date, timeString)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Encabezados de días */}
      <div className="border border-border rounded-lg overflow-hidden mb-4">
        <div className="grid grid-cols-8">
          <div className="p-3 text-center text-sm font-medium text-muted-foreground bg-muted/30 border-r border-border">Hora</div>
          {weekDays.map((day, index) => (
            <div key={day.toString()} className={`p-3 text-center text-sm font-medium bg-muted/30 ${
              isToday(day) ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            } ${index < weekDays.length - 1 ? "border-r border-border" : ""}`}>
              <div>{format(day, "EEE", { locale: es })}</div>
              <div className="text-lg font-bold">{format(day, "d")}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Grid de horarios */}
      <div className="flex-1 overflow-auto border border-border rounded-lg">
        <div className="grid grid-cols-8">
          {hours.map((hour, hourIndex) => (
            <React.Fragment key={hour}>
              <div className="p-2 text-xs text-muted-foreground text-right border-r border-border bg-muted/10">
                {format(new Date().setHours(hour, 0), "HH:mm")}
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDate(day).filter(event => 
                  event.time && parseInt(event.time.split(":")[0]) === hour
                )
                const isNotLastColumn = dayIndex < weekDays.length - 1
                const isNotLastRow = hourIndex < hours.length - 1
                
                return (
                  <div 
                    key={`${day}-${hour}`} 
                    className={`min-h-[60px] p-1 bg-card hover:bg-accent/20 transition-colors ${
                      isNotLastColumn ? "border-r border-border" : ""
                    } ${
                      isNotLastRow ? "border-b border-border" : ""
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnTimeSlot(e, day, hour)}
                  >
                    {dayEvents.map(event => (
                      <Tooltip key={event.id}>
                        <TooltipTrigger asChild>
                          <div 
                            draggable
                            onDragStart={() => onDragStart?.(event)}
                            onDragEnd={onDragEnd}
                            className={`text-xs p-1 rounded-sm mb-1 cursor-move ${event.color} text-white ${
                              draggedEvent?.id === event.id ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="font-medium">{event.time}</div>
                            <div className="truncate">{event.title}</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">{event.title}</p>
                          <p>Hora: {event.time}</p>
                          <p>Tipo: {EVENT_TYPES[event.type]?.label || event.type}</p>
                          {event.notes && <p>Notas: {event.notes}</p>}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
} 