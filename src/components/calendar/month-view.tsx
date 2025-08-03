"use client"

import React, { useState } from "react"
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday
} from "date-fns"
import { es } from "date-fns/locale"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DayEventsDialog } from "./day-events-dialog"
import { EventDetailsDialog } from "./event-details-dialog"
import { useIsMobile } from "@/hooks/use-mobile"

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  time?: string
  endDate?: Date
  endTime?: string
  type: string
  notes?: string
  color: string
}

const EVENT_TYPES: Record<string, { label: string; color: string }> = {
  cita: { label: "Cita", color: "bg-chart-1 text-chart-1" },
  recordatorio: { label: "Recordatorio", color: "bg-chart-2 text-chart-2" },
  ejercicio: { label: "Ejercicio", color: "bg-chart-3 text-chart-3" },
  meditacion: { label: "Meditación", color: "bg-chart-4 text-chart-4" },
  personal: { label: "Personal", color: "bg-chart-5 text-chart-5" }
}

interface MonthViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDragStart?: (event: CalendarEvent) => void
  onDragEnd?: () => void
  onDrop?: (targetDate: Date) => void
  draggedEvent?: CalendarEvent | null
}

export function MonthView({ 
  currentDate, 
  events, 
  onDragStart, 
  onDragEnd, 
  onDrop, 
  draggedEvent 
}: MonthViewProps) {
  const isMobile = useIsMobile()
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false)
  
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  
  const weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

  const getEventsForDate = (date: Date) => {
    const dayEvents = events.filter(event => {
      // En móvil, incluir todos los eventos que ocurran en esta fecha
      if (isMobile) {
        if (!event.endDate || isSameDay(event.date, event.endDate)) {
          // Evento de un día
          return isSameDay(event.date, date)
        } else {
          // Evento de múltiples días - verificar si la fecha está en el rango
          return date >= event.date && date <= event.endDate
        }
      } else {
        // En desktop, solo eventos de un día que empiecen en esta fecha (comportamiento original)
        if (!event.endDate || isSameDay(event.date, event.endDate)) {
          return isSameDay(event.date, date)
        }
        return false
      }
    })
    
    return dayEvents.sort((a, b) => {
      if (a.time && b.time) {
        return a.time.localeCompare(b.time)
      }
      // Si uno no tiene hora, lo ponemos al final
      if (a.time && !b.time) return -1
      if (!a.time && b.time) return 1
      return 0
    })
  }

  const getMultiDayEventBars = () => {
    const bars: Array<{
      event: CalendarEvent
      startCol: number
      length: number
      row: number
      level: number
    }> = []

    const multiDayEvents = events.filter(event => 
      event.endDate && !isSameDay(event.date, event.endDate)
    )

    // Agrupar eventos por fila para calcular niveles correctamente
    const eventsByRow: { [row: number]: Array<{
      event: CalendarEvent
      startCol: number
      length: number
      row: number
    }> } = {}

    multiDayEvents.forEach(event => {
      if (!event.endDate) return

      const eventDays = eachDayOfInterval({ start: event.date, end: event.endDate })
      
      // Para cada día del evento, encontrar su posición en el grid
      const eventPositions = eventDays
        .map(day => {
          const dayIndex = days.findIndex(d => isSameDay(d, day))
          if (dayIndex === -1) return null
          return {
            dayIndex,
            row: Math.floor(dayIndex / 7),
            col: dayIndex % 7,
            date: day
          }
        })
        .filter(pos => pos !== null)

      if (eventPositions.length === 0) return

      // Agrupar posiciones por fila
      const rowGroups: { [row: number]: typeof eventPositions } = {}
      eventPositions.forEach(pos => {
        if (!rowGroups[pos.row]) rowGroups[pos.row] = []
        rowGroups[pos.row].push(pos)
      })

      // Crear una barra para cada fila
      Object.entries(rowGroups).forEach(([rowStr, positions]) => {
        const row = parseInt(rowStr)
        const sortedPositions = positions.sort((a, b) => a.col - b.col)
        
        // Verificar que los días sean consecutivos en esta fila
        const firstCol = sortedPositions[0].col
        const lastCol = sortedPositions[sortedPositions.length - 1].col
        const expectedLength = lastCol - firstCol + 1
        
        // Solo crear la barra si los días son consecutivos
        if (sortedPositions.length === expectedLength) {
          if (!eventsByRow[row]) eventsByRow[row] = []
          eventsByRow[row].push({
            event,
            startCol: firstCol,
            length: expectedLength,
            row
          })
        }
      })
    })

    // Asignar niveles para evitar solapamientos
    Object.entries(eventsByRow).forEach(([rowStr, rowEvents]) => {
      // Ordenar eventos por hora de inicio y luego por columna de inicio
      const sortedEvents = rowEvents.sort((a, b) => {
        // Primero por hora de inicio si existe
        if (a.event.time && b.event.time) {
          const timeCompare = a.event.time.localeCompare(b.event.time)
          if (timeCompare !== 0) return timeCompare
        }
        // Luego por columna de inicio
        return a.startCol - b.startCol
      })

      // Asignar niveles
      const usedLevels: { [level: number]: Array<{ startCol: number; endCol: number }> } = {}
      
      sortedEvents.forEach(eventBar => {
        let level = 0
        const eventEndCol = eventBar.startCol + eventBar.length - 1
        
        // Encontrar el primer nivel disponible
        while (usedLevels[level]) {
          const conflicts = usedLevels[level].some(usedRange => 
            !(eventBar.startCol > usedRange.endCol || eventEndCol < usedRange.startCol)
          )
          if (!conflicts) break
          level++
        }
        
        // Registrar el uso de este nivel
        if (!usedLevels[level]) usedLevels[level] = []
        usedLevels[level].push({ startCol: eventBar.startCol, endCol: eventEndCol })
        
        // Agregar al resultado con el nivel asignado
        bars.push({
          ...eventBar,
          level
        })
      })
    })

    return bars
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropOnDay = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    if (onDrop) {
      onDrop(date)
    }
  }

  const handleShowMoreEvents = (date: Date, dayEvents: CalendarEvent[]) => {
    setSelectedDay(date)
    setIsDayDialogOpen(true)
  }

  const handleEventClick = (event: CalendarEvent, dayDate?: Date) => {
    if (isMobile && dayDate) {
      // En móvil, abrir el diálogo del día completo
      setSelectedDay(dayDate)
      setIsDayDialogOpen(true)
    } else {
      // En desktop, abrir el diálogo del evento individual
      setSelectedEvent(event)
      setIsEventDetailsOpen(true)
    }
  }

  const handleEditEvent = (event: CalendarEvent) => {
    // TODO: Implementar edición
    console.log("Editar evento:", event)
  }

  const handleDeleteEvent = (eventId: string) => {
    // TODO: Implementar eliminación
    console.log("Eliminar evento:", eventId)
  }

  const multiDayBars = getMultiDayEventBars()

  // Función para obtener el color de fondo del evento (sin el prefijo bg-)
  const getEventDotColor = (eventColor: string) => {
    return eventColor.replace('bg-', '')
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Encabezados de días */}
      <div className="grid grid-cols-7">
        {weekdays.map((day, index) => (
          <div 
            key={day} 
            className={`p-3 text-center text-xs font-medium text-muted-foreground bg-muted/30 ${
              index < weekdays.length - 1 ? "border-r border-border" : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Contenedor con posición relativa para las barras */}
      <div className="relative">
        {/* Barras de eventos multi-día - Solo en desktop */}
        {!isMobile && multiDayBars.map((bar, index) => {
          // Calcular la posición vertical exacta donde empiezan los eventos normales
          const cellPadding = 12; // p-3 (0.75rem * 16px = 12px)
          const dayNumberHeight = 24; // altura del número del día (text-sm font-medium ~24px)
          const dayNumberMarginBottom = 8; // mb-2 (0.5rem * 16px = 8px)
          const eventSpacing = 6; // space-y-1.5 (0.375rem * 16px = 6px)
          const eventHeight = 24; // altura natural del evento (text-xs p-1.5 rounded-sm)
          const eventStartY = bar.row * 160 + cellPadding + dayNumberHeight + dayNumberMarginBottom + (bar.level * (eventHeight + eventSpacing));
          
          return (
            <div
              key={`${bar.event.id}-${bar.row}-${bar.level}`}
              className={`absolute text-xs p-1.5 rounded-sm truncate cursor-pointer ${bar.event.color} text-white z-10`}
              style={{
                top: `${eventStartY}px`,
                left: `calc(${(bar.startCol * 100) / 7}% + 12px)`,
                width: `calc(${(bar.length * 100) / 7}% - 24px)`
              }}
              onClick={() => handleEventClick(bar.event)}
            >
              {bar.event.time && <span className="font-medium">{bar.event.time}</span>} {bar.event.title}
            </div>
          )
        })}
        
        {/* Días del calendario */}
        <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = getEventsForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isDayToday = isToday(day)
          const isNotLastColumn = (index + 1) % 7 !== 0
          const isNotLastRow = index < days.length - 7
          
          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 bg-card hover:bg-accent/20 transition-colors ${
                isNotLastColumn ? "border-r border-border" : ""
              } ${
                isNotLastRow ? "border-b border-border" : ""
              } ${
                !isCurrentMonth ? "text-muted-foreground bg-muted/20" : ""
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnDay(e, day)}
            >
              {/* Área del número del día con altura fija y alineación izquierda */}
              <div className="h-6 mb-2 flex items-start justify-start">
                <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                  isDayToday 
                    ? "bg-primary text-primary-foreground font-bold" 
                    : "font-medium"
                }`}>
                  {format(day, "d")}
                </span>
              </div>
              
              {/* Renderizado condicional según si es móvil o no */}
              {isMobile ? (
                // Vista móvil: puntos de colores alineados a la misma altura
                <div className="flex flex-wrap gap-1">
                  {dayEvents.map(event => (
                    <Tooltip key={event.id}>
                      <TooltipTrigger asChild>
                                                 <button 
                           onClick={() => handleEventClick(event, day)}
                           className={`w-2.5 h-2.5 rounded-full ${event.color} shadow-sm hover:scale-110 transition-transform cursor-pointer ${
                             draggedEvent?.id === event.id ? 'opacity-50' : ''
                           }`}
                           aria-label={`${event.title} - ${event.time || 'Sin hora'}`}
                         />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{event.title}</p>
                        {event.time && (
                          <p>
                            {event.time}
                            {event.endTime && !event.endDate && ` - ${event.endTime}`}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                                     {dayEvents.length > 9 && (
                     <button 
                       onClick={() => handleShowMoreEvents(day, dayEvents)}
                       className="w-2.5 h-2.5 rounded-full bg-muted-foreground text-white text-[8px] font-bold flex items-center justify-center hover:scale-110 transition-transform"
                       title={`+${dayEvents.length - 9} eventos más`}
                     >
                       +
                     </button>
                   )}
                </div>
              ) : (
                // Vista desktop: barras con texto (comportamiento original)
                <div className="space-y-1.5">
                  {dayEvents.slice(0, 3).map(event => (
                    <Tooltip key={event.id}>
                      <TooltipTrigger asChild>
                        <div 
                          draggable
                          onDragStart={() => onDragStart?.(event)}
                          onDragEnd={onDragEnd}
                          onClick={() => handleEventClick(event, day)}
                          className={`text-xs p-1.5 rounded-sm truncate cursor-pointer ${event.color} text-white ${
                            draggedEvent?.id === event.id ? 'opacity-50' : ''
                          }`}
                        >
                          {event.time && <span className="font-medium">{event.time}</span>} {event.title}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{event.title}</p>
                        {event.time && (
                          <p>
                            {event.time}
                            {event.endTime && !event.endDate && ` - ${event.endTime}`}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {dayEvents.length > 3 && (
                    <button 
                      onClick={() => handleShowMoreEvents(day, dayEvents)}
                      className="w-full text-xs text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-sm p-1 transition-colors"
                    >
                      +{dayEvents.length - 3} más
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
        </div>
      </div>
      
      {selectedDay && (
        <DayEventsDialog
          isOpen={isDayDialogOpen}
          onClose={() => {
            setIsDayDialogOpen(false)
            setSelectedDay(null)
          }}
          date={selectedDay}
          events={events.filter(event => isSameDay(event.date, selectedDay))}
        />
      )}

      <EventDetailsDialog
        isOpen={isEventDetailsOpen}
        onClose={() => {
          setIsEventDetailsOpen(false)
          setSelectedEvent(null)
        }}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  )
} 