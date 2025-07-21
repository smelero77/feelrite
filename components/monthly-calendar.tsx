"use client"

import * as React from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns"
import { es } from "date-fns/locale"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Filter, List, Calendar, Grid3X3, Settings, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavigationButton } from "@/components/ui/navigation-button"

interface Event {
  id: string
  title: string
  time: string
  date: Date
  category: string
  color: string
}

interface MonthlyCalendarProps {
  appointments?: {
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

// Colores predefinidos para diferentes tipos de eventos usando variables CSS
const eventColors = {
  'Consulta General': 'bg-primary/10 text-primary border-primary/20',
  'Fisioterapia': 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  'Odontología': 'bg-chart-5/10 text-chart-5 border-chart-5/20',
  'Cardiología': 'bg-destructive/10 text-destructive border-destructive/20',
  'Dermatología': 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  'Nutrición': 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  'Psicología': 'bg-accent text-accent-foreground border-accent/20',
  'default': 'bg-muted text-muted-foreground border-border'
}

// Función para obtener estilos CSS inline usando variables del tema
const getEventStyles = (eventType: string) => {
  const varMap: Record<string, string> = {
    'Consulta General': '--primary',
    'Fisioterapia': '--chart-2',
    'Odontología': '--chart-5',
    'Cardiología': '--destructive',
    'Dermatología': '--chart-3',
    'Nutrición': '--chart-4',
    'Psicología': '--accent',
    'default': '--muted-foreground',
  }

  const cssVar = varMap[eventType] || varMap.default

  return {
    backgroundColor: `oklch(var(${cssVar}) / 0.1)`,
    color: `oklch(var(${cssVar}))`,
    borderColor: `oklch(var(${cssVar}) / 0.2)`,
    border: '1px solid',
    borderRadius: 'var(--radius)',
    padding: 'var(--spacing)',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-sans)',
    letterSpacing: 'var(--letter-spacing)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: 'var(--shadow-xs)',
  }
}

export function MonthlyCalendar({ appointments = [] }: MonthlyCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [selectedView, setSelectedView] = React.useState('month')

  // Convertir citas a eventos con colores
  const events: Event[] = React.useMemo(() => {
    return appointments.map(appointment => ({
      id: appointment.id,
      title: appointment.type,
      time: appointment.time,
      date: new Date(appointment.date),
      category: appointment.type,
      color: eventColors[appointment.type as keyof typeof eventColors] || eventColors.default
    }))
  }, [appointments])

  // Calcular el rango de fechas del mes actual
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }) // Domingo
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  })

  // Agrupar eventos por fecha
  const eventsByDate = React.useMemo(() => {
    const grouped = new Map<string, Event[]>()
    events.forEach(event => {
      const dateKey = format(event.date, 'yyyy-MM-dd')
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, [])
      }
      grouped.get(dateKey)?.push(event)
    })
    return grouped
  }, [events])

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
  }

  const totalEvents = events.length

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="space-y-6">
      {/* Header del calendario */}
      <div className="space-y-4">
        {/* Primera línea: Título y controles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Bloque con mes abreviado y día */}
            <div 
              className="p-3 text-center min-w-[60px]"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                fontFamily: 'var(--font-sans)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-sm)',
                letterSpacing: 'var(--letter-spacing)'
              }}
            >
              <div 
                className="text-xs font-semibold leading-none"
                style={{ 
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: 'var(--tracking-wider)'
                }}
              >
                {format(currentDate, 'MMM', { locale: es }).toUpperCase()}
              </div>
              <div 
                className="text-xl font-bold leading-none"
                style={{ 
                  fontFamily: 'var(--font-sans)',
                  marginTop: 'var(--spacing)'
                }}
              >
                {format(new Date(), 'd')}
              </div>
            </div>
            
            {/* Título del mes y contador de eventos */}
            <div className="flex items-center gap-3">
              <h1 
                className="text-2xl font-semibold"
                style={{ 
                  color: 'var(--foreground)',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                {format(currentDate, 'MMMM yyyy', { locale: es })}
              </h1>
              <span 
                className="text-sm font-medium"
                style={{ 
                  color: 'var(--muted-foreground)',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                {totalEvents} eventos
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Botones de vista */}
            <div 
              className="flex items-center p-1"
              style={{ 
                backgroundColor: 'oklch(var(--muted) / 0.5)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <Button
                variant={selectedView === 'filter' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant={selectedView === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={selectedView === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Calendar className="h-4 w-4" />
              </Button>
              <Button
                variant={selectedView === 'month' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setSelectedView('month')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>

            {/* Etiquetas de usuario */}
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-medium text-foreground"
              >
                M
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-medium text-foreground"
              >
                A
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-medium text-foreground"
              >
                R
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="text-sm font-medium bg-accent text-accent-foreground"
              >
                J
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm font-medium text-foreground"
              >
                Todos
              </Button>
            </div>

            {/* Botón Add Event */}
            <Button variant="default"> 
  <Plus className="h-4 w-4 mr-2" />
  Agregar Evento
</Button>

            {/* Avatar y configuración */}
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Segunda línea: Navegación y rango de fechas */}
        <div className="flex items-center justify-between">
          {/* Flecha anterior */}
          <NavigationButton onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </NavigationButton>
          
          {/* Rango de fechas centrado */}
          <div 
            className="text-sm font-medium"
            style={{ 
              color: 'oklch(var(--muted-foreground))',
              fontFamily: 'var(--font-sans)'
            }}
          >
            {format(monthStart, 'd MMM, yyyy', { locale: es })} - {format(monthEnd, 'd MMM, yyyy', { locale: es })}
          </div>
          
          {/* Flecha siguiente */}
          <NavigationButton onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </NavigationButton>
        </div>
      </div>

      {/* Grid del calendario */}
      <Card 
        className="p-0 overflow-hidden"
        style={{
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid oklch(var(--border))'
        }}
      >
        {/* Header con días de la semana */}
        <div 
          className="grid grid-cols-7 border-b"
          style={{ 
            backgroundColor: 'oklch(var(--muted) / 0.5)',
            borderBottom: '1px solid oklch(var(--border))',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          {dayNames.map((day) => (
            <div 
              key={day} 
              className="p-3 text-center text-sm font-medium border-r last:border-r-0"
              style={{ 
                color: 'var(--muted-foreground)',
                borderColor: 'oklch(var(--border))',
                fontFamily: 'var(--font-sans)'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid de días */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dateKey = format(day, 'yyyy-MM-dd')
            const dayEvents = eventsByDate.get(dateKey) || []
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())
            const maxVisibleEvents = 3
            const visibleEvents = dayEvents.slice(0, maxVisibleEvents)
            const hiddenEventsCount = dayEvents.length - maxVisibleEvents

            return (
              <div
                key={index}
                className={cn(
                  "min-h-[120px] last:border-r-0"
                )}
                style={{
                  backgroundColor: isToday 
                    ? 'oklch(var(--primary) / 0.05)' 
                    : !isCurrentMonth 
                      ? 'oklch(var(--muted) / 0.3)' 
                      : 'transparent',
                  borderColor: 'oklch(var(--border))',
                  borderRight: '1px solid oklch(var(--border))',
                  borderBottom: '1px solid oklch(var(--border))',
                  color: !isCurrentMonth ? 'oklch(var(--muted-foreground) / 0.6)' : 'oklch(var(--foreground))',
                  padding: 'var(--spacing)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div 
                  className={cn(
                    "text-sm font-medium flex items-center justify-center",
                    isToday && "w-6 h-6"
                  )}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--letter-spacing)',
                    marginBottom: 'var(--spacing)',
                    ...(isToday ? {
                      backgroundColor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      borderRadius: '50%',
                      boxShadow: 'var(--shadow-xs)'
                    } : {})
                  }}
                >
                  {format(day, 'd')}
                </div>

                <div 
                  className="space-y-1"
                  style={{ gap: 'var(--spacing)' }}
                >
                  {visibleEvents.map((event) => (
                    <div
                      key={event.id}
                      style={getEventStyles(event.title)}
                      className="text-left hover:shadow-sm"
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div style={{ opacity: 0.75 }}>{event.time}</div>
                    </div>
                  ))}
                  
                  {hiddenEventsCount > 0 && (
                    <div 
                      className="text-xs cursor-pointer hover:text-foreground"
                      style={{ 
                        color: 'var(--muted-foreground)',
                        fontFamily: 'var(--font-sans)',
                        letterSpacing: 'var(--letter-spacing)',
                        marginTop: 'var(--spacing)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {hiddenEventsCount} más...
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
} 