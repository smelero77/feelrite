"use client"

import React, { useState } from "react"
import { 
  addMonths, 
  subMonths, 
  addWeeks, 
  subWeeks, 
  addDays, 
  subDays, 
  format,
  parseISO,
  isSameDay
} from "date-fns"

import { Card, CardContent } from "@/components/ui/card"
import { CalendarHeader } from "./calendar/calendar-header"
import { MonthView, CalendarEvent } from "./calendar/month-view"
import { WeekView } from "./calendar/week-view"
import { DayView } from "./calendar/day-view"
import { TabletDayView } from "./calendar/tablet-day-view"
import { ListView } from "./calendar/list-view"
import { EventDialog } from "./calendar/event-dialog"
import { EventDetailsDialog } from "./calendar/event-details-dialog"
import { MobileDayAgenda } from "./calendar/mobile-day-agenda"
import { useIsMobile } from "@/hooks/use-mobile"
import { useScreenSize } from "@/hooks/use-screen-size"

type CalendarView = "month" | "week" | "day" | "list"
type EventType = "cita" | "recordatorio" | "ejercicio" | "meditacion" | "personal"

// Configuración de tipos de eventos con colores del tema
const EVENT_TYPES: Record<EventType, { label: string; color: string }> = {
  cita: { label: "Cita", color: "bg-chart-1" },
  recordatorio: { label: "Recordatorio", color: "bg-chart-2" },
  ejercicio: { label: "Ejercicio", color: "bg-chart-3" },
  meditacion: { label: "Meditación", color: "bg-chart-4" },
  personal: { label: "Personal", color: "bg-chart-5" }
}

// Función para crear fecha sin hora
const createDateWithoutTime = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// Datos de ejemplo
const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Sesión de meditación matutina",
    date: createDateWithoutTime(new Date()),
    time: "08:00",
    endTime: "08:30",
    type: "meditacion",
    color: "bg-chart-4",
    notes: "Práctica diaria de mindfulness"
  },
  {
    id: "2", 
    title: "Cita con el doctor",
    date: createDateWithoutTime(new Date()),
    time: "10:30",
    endTime: "11:30",
    type: "cita",
    color: "bg-chart-1"
  },
  {
    id: "3",
    title: "Ejercicio de yoga",
    date: createDateWithoutTime(new Date()),
    time: "14:00",
    endTime: "15:00",
    type: "ejercicio",
    color: "bg-chart-3"
  },
  {
    id: "4",
    title: "Recordatorio de medicación",
    date: createDateWithoutTime(new Date()),
    time: "20:00",
    type: "recordatorio",
    color: "bg-chart-2"
  },
  {
    id: "5", 
    title: "Ejercicio cardiovascular",
    date: createDateWithoutTime(addDays(new Date(), 1)),
    time: "18:00",
    endTime: "19:00",
    type: "ejercicio",
    color: "bg-chart-3"
  },
  {
    id: "6",
    title: "Revisión semanal de progreso",
    date: createDateWithoutTime(addDays(new Date(), 3)),
    time: "10:00",
    endTime: "11:00",
    type: "personal",
    color: "bg-chart-5"
  },
  {
    id: "7",
    title: "Conferencia médica",
    date: createDateWithoutTime(addDays(new Date(), 1)),
    time: "09:00",
    endDate: createDateWithoutTime(addDays(new Date(), 4)),
    endTime: "17:00",
    type: "cita",
    color: "bg-chart-1"
  }
]

export function Calendar() {
  const isMobile = useIsMobile()
  const screenSize = useScreenSize()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>("month")
  const [events, setEvents] = useState<CalendarEvent[]>(SAMPLE_EVENTS)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  
  // Estado del formulario para nuevo evento
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    endDate: format(new Date(), "yyyy-MM-dd"),
    endTime: "",
    type: "personal" as EventType,
    notes: ""
  })

  // Navegación entre períodos
  const navigate = (direction: "prev" | "next") => {
    switch (view) {
      case "month":
        setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
        break
      case "week":
        setCurrentDate(direction === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
        break
      case "day":
        setCurrentDate(direction === "next" ? addDays(currentDate, 1) : subDays(currentDate, 1))
        break
    }
  }

  // Volver a hoy
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Función para manejar cambios en filtros
  const handleFiltersChange = (filters: Set<string>) => {
    setSelectedFilters(filters)
  }

  // Función para manejar cambios en búsqueda
  const handleSearchChange = (search: string) => {
    setSearchTerm(search)
  }

  // Filtrar eventos basado en filtros y búsqueda
  const filteredEvents = events.filter(event => {
    // Filtro por tipo
    const passesTypeFilter = selectedFilters.size === 0 || selectedFilters.has(event.type)
    
    // Filtro por búsqueda en título y notas
    const passesSearchFilter = searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.notes && event.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return passesTypeFilter && passesSearchFilter
  })

  // Abrir modal para agregar evento
  const openAddEventDialog = () => {
    setIsDialogOpen(true)
  }

  // Cerrar modal
  const closeDialog = () => {
    setIsDialogOpen(false)
    setNewEvent({
      title: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "",
      endDate: format(new Date(), "yyyy-MM-dd"),
      endTime: "",
      type: "personal",
      notes: ""
    })
  }

  // Manejar clic en evento
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsDetailsDialogOpen(true)
  }

  // Cerrar modal de detalles
  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false)
    setSelectedEvent(null)
  }

  // Manejar edición de evento
  const handleEditEvent = (event: CalendarEvent) => {
    // Por ahora, solo cerramos el modal de detalles
    // En el futuro, aquí se podría abrir un modal de edición
    closeDetailsDialog()
  }

  // Manejar eliminación de evento
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId))
  }

  // Agregar nuevo evento
  const handleAddEvent = () => {
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: createDateWithoutTime(parseISO(newEvent.date)),
      time: newEvent.time,
      endDate: newEvent.endDate ? createDateWithoutTime(parseISO(newEvent.endDate)) : undefined,
      endTime: newEvent.endTime || undefined,
      type: newEvent.type,
      notes: newEvent.notes,
      color: EVENT_TYPES[newEvent.type].color
    }
    
    setEvents([...events, event])
    closeDialog()
  }

  // Drag and Drop handlers
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null)

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event)
  }

  const handleDragEnd = () => {
    setDraggedEvent(null)
  }

  const handleDrop = (targetDate: Date, targetTime?: string) => {
    // console.log('handleDrop llamado:', { draggedEvent: draggedEvent?.title, targetTime })
    if (!draggedEvent) {
      // console.log('No hay draggedEvent, saliendo')
      return
    }

    const updatedEvents = events.map(event => {
      if (event.id === draggedEvent.id) {
        // Calcular nueva hora de inicio
        const newStartTime = targetTime || event.time
        
        // Mantener la duración original si existe endTime
        let newEndTime = event.endTime
        if (event.time && event.endTime && newStartTime) {
          // Calcular duración original en minutos
          const [origStartHour, origStartMinute] = event.time.split(":").map(Number)
          const [origEndHour, origEndMinute] = event.endTime.split(":").map(Number)
          const originalDuration = (origEndHour * 60 + origEndMinute) - (origStartHour * 60 + origStartMinute)
          
          // Calcular nueva hora de fin
          const [newStartHour, newStartMinute] = newStartTime.split(":").map(Number)
          const newEndTotalMinutes = newStartHour * 60 + newStartMinute + originalDuration
          
          const newEndHour = Math.floor(newEndTotalMinutes / 60) % 24
          const newEndMinute = newEndTotalMinutes % 60
          newEndTime = `${newEndHour.toString().padStart(2, "0")}:${newEndMinute.toString().padStart(2, "0")}`
        }

        // console.log('Actualizando evento:', { 
        //   from: { time: event.time, endTime: event.endTime }, 
        //   to: { time: newStartTime, endTime: newEndTime }
        // })

        return {
          ...event,
          date: createDateWithoutTime(targetDate),
          time: newStartTime,
          endTime: newEndTime
        }
      }
      return event
    })

    // console.log('Estableciendo nuevos eventos')
    setEvents(updatedEvents)
    setDraggedEvent(null)
  }

  // Calcular el número de eventos según la vista
  const getEventsCount = () => {
    switch (view) {
      case "day":
        // Para vista de día, contar solo eventos del día actual
        return filteredEvents.filter(event => 
          isSameDay(event.date, currentDate)
        ).length
      case "week":
        // Para vista de semana, contar eventos de esa semana
        const weekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 1)
        const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6)
        return filteredEvents.filter(event => 
          event.date >= weekStart && event.date <= weekEnd
        ).length
      default:
        // Para mes y lista, mostrar todos los eventos filtrados
        return filteredEvents.length
    }
  }

  // Renderizar la vista actual
  const renderCurrentView = () => {
    const dragProps = {
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onDrop: handleDrop,
      draggedEvent
    }

    switch (view) {
      case "month":
        return <MonthView currentDate={currentDate} events={filteredEvents} {...dragProps} />
      case "week":
        return <WeekView currentDate={currentDate} events={filteredEvents} {...dragProps} />
      case "day":
        // Seleccionar vista según el tamaño de pantalla
        switch (screenSize) {
          case "mobile":
            return <MobileDayAgenda 
              currentDate={currentDate} 
              events={filteredEvents} 
              {...dragProps}
              onEventClick={handleEventClick}
            />
          case "tablet":
            return <TabletDayView 
              currentDate={currentDate} 
              events={filteredEvents} 
              {...dragProps}
              onEventClick={handleEventClick}
              onDateSelect={(date) => setCurrentDate(date)}
              onNavigate={navigate}
            />
          case "desktop":
          default:
            return <DayView 
              currentDate={currentDate} 
              events={filteredEvents} 
              {...dragProps}
              onEventClick={handleEventClick}
              onDateSelect={(date) => setCurrentDate(date)}
              onNavigate={navigate}
            />
        }
      case "list":
        return <ListView events={filteredEvents} />
      default:
        return <MonthView currentDate={currentDate} events={filteredEvents} {...dragProps} />
    }
  }

  return (
    <Card className="w-full h-full flex flex-col border-0 shadow-none">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        eventsCount={getEventsCount()}
        onViewChange={setView}
        onNavigate={navigate}
        onTodayClick={goToToday}
        onAddEventClick={openAddEventDialog}
        onFiltersChange={handleFiltersChange}
        onSearchChange={handleSearchChange}
      />

      {view === "day" ? (
        <div className="flex-1 relative overflow-hidden">
          {renderCurrentView()}
        </div>
      ) : (
        <CardContent className="flex-1 p-6 pt-0 overflow-hidden">
          <div className="h-full overflow-auto">
            {renderCurrentView()}
          </div>
        </CardContent>
      )}

      <EventDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        onSave={handleAddEvent}
      />

      <EventDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </Card>
  )
} 