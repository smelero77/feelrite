"use client"

import React from "react"
import { format, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { Clock } from "lucide-react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CalendarEvent } from "./month-view"
import { MiniCalendar } from "./mini-calendar"

const EVENT_TYPES: Record<string, { label: string; color: string }> = {
  cita: { label: "Cita", color: "bg-chart-1 text-chart-1" },
  recordatorio: { label: "Recordatorio", color: "bg-chart-2 text-chart-2" },
  ejercicio: { label: "Ejercicio", color: "bg-chart-3 text-chart-3" },
  meditacion: { label: "Meditación", color: "bg-chart-4 text-chart-4" },
  personal: { label: "Personal", color: "bg-chart-5 text-chart-5" }
}

interface DayViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDragStart?: (event: CalendarEvent) => void
  onDragEnd?: () => void
  onDrop?: (targetDate: Date, targetTime?: string) => void
  draggedEvent?: CalendarEvent | null
  onEventClick?: (event: CalendarEvent) => void
  onDateSelect?: (date: Date) => void
  onNavigate?: (direction: "prev" | "next") => void
}

export function DayView({ 
  currentDate, 
  events, 
  onDragStart, 
  onDragEnd, 
  onDrop, 
  draggedEvent,
  onEventClick,
  onDateSelect,
  onNavigate
}: DayViewProps) {
  // Generar intervalos de 30 minutos en lugar de horas
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = (i % 2) * 30
    return { hour, minute, isHalfHour: minute === 30 }
  })
  
  const dayEvents = events.filter(event => isSameDay(event.date, currentDate))
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStartTime, setDragStartTime] = React.useState(0)
  const [dragTargetSlot, setDragTargetSlot] = React.useState<{hour: number, minute: number} | null>(null)

  // Función para obtener eventos de múltiples días que incluyen el día actual
  const getMultiDayEventForCurrentDate = () => {
    // Buscar eventos de múltiples días que incluyan el día actual
    const multiDayEvents = events.filter(event => {
      if (!event.endDate) return false
      
      // Verificar si el día actual está dentro del rango del evento
      const eventStart = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate())
      const eventEnd = new Date(event.endDate.getFullYear(), event.endDate.getMonth(), event.endDate.getDate())
      const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
      
      return today >= eventStart && today <= eventEnd && !isSameDay(event.date, event.endDate)
    })
    
    if (multiDayEvents.length === 0) return null
    
    // Tomar el primer evento de múltiples días
    const event = multiDayEvents[0]
    
    // Calcular qué día es en la secuencia del evento
    const startDate = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate())
    const endDate = new Date(event.endDate!.getFullYear(), event.endDate!.getMonth(), event.endDate!.getDate())
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const currentDayInSequence = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    return {
      event,
      currentDay: currentDayInSequence,
      totalDays: totalDays
    }
  }

  const multiDayEventInfo = getMultiDayEventForCurrentDate()

  // Calcular la posición de la hora actual
  const getCurrentTimePosition = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    
    // Calcular la posición en píxeles (cada slot de 30 min = 60px)
    const totalMinutes = hours * 60 + minutes
    const slotIndex = totalMinutes / 30
    return slotIndex * 60 // 60px por slot
  }

  const currentTimePosition = getCurrentTimePosition()
  const isToday = isSameDay(currentDate, new Date())

  // Función para calcular la duración de un evento en minutos
  const getEventDurationInMinutes = (event: CalendarEvent) => {
    if (!event.time) return 60
    
    if (event.endTime) {
      const startMinutes = parseInt(event.time.split(':')[0]) * 60 + parseInt(event.time.split(':')[1])
      const endMinutes = parseInt(event.endTime.split(':')[0]) * 60 + parseInt(event.endTime.split(':')[1])
      return endMinutes - startMinutes
    }
    
    return 60
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropOnTimeSlot = (e: React.DragEvent, hour: number, minute: number = 0) => {
    e.preventDefault()
    if (onDrop) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      onDrop(currentDate, timeString)
    }
    setDragTargetSlot(null)
  }

  const handleDragOverSlot = (e: React.DragEvent, hour: number, minute: number) => {
    e.preventDefault()
    if (draggedEvent) {
      setDragTargetSlot({ hour, minute })
    }
  }

  const handleEventMouseDown = (event: CalendarEvent) => {
    setDragStartTime(Date.now())
    setIsDragging(false)
  }

  const handleEventDragStart = (event: CalendarEvent) => {
    setIsDragging(true)
    onDragStart?.(event)
  }

  const handleEventDragEnd = () => {
    setIsDragging(false)
    onDragEnd?.()
  }

  const handleEventClick = (event: CalendarEvent) => {
    // Solo ejecutar click si no estamos en medio de un drag
    // y ha pasado poco tiempo desde el mousedown (para detectar clicks reales)
    const timeDiff = Date.now() - dragStartTime
    if (!isDragging && timeDiff < 200) {
      onEventClick?.(event)
    }
  }

  return (
    <div className="h-full">
      {/* El contenedor principal es ahora una fila flex */}
      <div className="flex h-full">
        {/* ✅ NUEVO: Contenedor para la columna izquierda (Cabecera + Calendario Principal) */}
        <div className="flex flex-col flex-1">
          {/* ✅ MUEVE LA CABECERA AQUÍ: Cabecera específica para vista de día */}
          <div className="bg-background border-b border-border">
            {multiDayEventInfo && (
              <div 
                className={`${multiDayEventInfo.event.color} rounded-lg shadow-sm mt-2 mb-1`}
                style={{
                  marginLeft: '64px',
                  // Ajusta el margen para que no se solape con el borde del mini-calendario
                  marginRight: '16px' 
                }}
              >
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white text-sm leading-tight truncate">
                      {multiDayEventInfo.event.title}
                    </h3>
                    <span className="text-xs text-white/80 ml-2 flex-shrink-0">
                      Día {multiDayEventInfo.currentDay} de {multiDayEventInfo.totalDays}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col items-center px-6 pb-1">
              <p className="text-lg font-semibold text-foreground">
                {format(currentDate, "EEE dd", { locale: es })}
              </p>
            </div>
          </div>
          
          {/* Calendario principal (Cuadrícula) */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div 
              className="relative"
              style={{ 
                height: '2880px' // 48 slots * 60px = 2880px (como tablet)
              }}
            >
              {/* Indicador de hora actual */}
              {isToday && (
                <div 
                  className="absolute z-40 flex items-center w-full"
                  style={{ 
                    top: `${currentTimePosition}px`
                  }}
                >
                  {/* Círculo indicador */}
                  <div className="w-3 h-3 bg-primary rounded-full border-2 border-background shadow-md ml-16 z-50"></div>
                  {/* Línea horizontal */}
                  <div className="flex-1 h-0.5 bg-primary ml-1"></div>
                </div>
              )}

              {/* Línea vertical separadora */}
              <div className="absolute left-16 top-0 w-px bg-border/30 z-15" style={{ height: '2880px' }}></div>
              
              {/* Etiquetas de horas posicionadas absolutamente */}
              {timeSlots.filter(slot => !slot.isHalfHour && slot.hour !== 0).map((slot) => {
                const slotIndex = slot.hour * 2
                const labelPosition = slotIndex * 60
                
                return (
                  <div
                    key={`label-${slot.hour}`}
                    className="absolute left-0 w-16 text-right pr-4 z-20 flex items-center justify-end"
                    style={{ 
                      top: `${labelPosition - 12}px`, // -12px para centrar la etiqueta con la línea
                      height: '24px'
                    }}
                  >
                    <span className="text-sm text-muted-foreground font-medium">
                      {format(new Date(0, 0, 0, slot.hour, 0), "HH:mm")}
                    </span>
                  </div>
                )
              })}
              
              {/* Líneas horizontales posicionadas absolutamente */}
              {timeSlots.map((slot, index) => {
                const slotIndex = slot.hour * 2 + Math.floor(slot.minute / 30)
                const linePosition = slotIndex * 60
                
                return (
                  <div
                    key={`line-${slot.hour}-${slot.minute}`}
                    className="absolute left-16 right-0 z-10"
                    style={{ top: `${linePosition}px` }}
                  >
                    {!slot.isHalfHour ? (
                      /* Línea continua para horas completas */
                      <div className="w-full h-px bg-border/30" />
                    ) : (
                      /* Línea discontinua para medias horas */
                      <div className="w-full h-px border-t border-dashed border-border/40" />
                    )}
                  </div>
                )
              })}
              
              {/* Áreas de drop para eventos */}
              {timeSlots.map((slot, index) => {
                const slotIndex = slot.hour * 2 + Math.floor(slot.minute / 30)
                const slotPosition = slotIndex * 60
                
                return (
                  <div
                    key={`drop-${slot.hour}-${slot.minute}`}
                    className={`absolute ${
                      draggedEvent && dragTargetSlot?.hour === slot.hour && dragTargetSlot?.minute === slot.minute 
                        ? 'bg-primary/20 border-l-2 border-primary' 
                        : ''
                    }`}
                    style={{
                      top: `${slotPosition}px`,
                      left: '64px',
                      right: '16px',
                      height: '60px',
                      zIndex: 5
                    }}
                    onDragOver={(e) => handleDragOverSlot(e, slot.hour, slot.minute)}
                    onDrop={(e) => handleDropOnTimeSlot(e, slot.hour, slot.minute)}
                  >
                    {draggedEvent && dragTargetSlot?.hour === slot.hour && dragTargetSlot?.minute === slot.minute && (
                      <div className="w-full h-1 bg-primary rounded-full absolute top-0" />
                    )}
                  </div>
                )
              })}
              
              {/* Eventos renderizados por separado como elementos absolutos */}
              {dayEvents.filter(event => {
                // Solo mostrar eventos que tienen hora Y que no son de múltiples días
                const isMultiDay = event.endDate && !isSameDay(event.date, event.endDate)
                return event.time && !isMultiDay
              }).map((event) => {
                const startHour = parseInt(event.time!.split(":")[0])
                const startMinute = parseInt(event.time!.split(":")[1])
                
                // Calcular la duración del evento en minutos
                const durationMinutes = getEventDurationInMinutes(event)
                
                // Para el posicionamiento
                let displayStartHour = startHour
                let displayStartMinute = startMinute
                
                if (draggedEvent?.id === event.id && dragTargetSlot) {
                  displayStartHour = dragTargetSlot.hour
                  displayStartMinute = dragTargetSlot.minute
                }
                
                // Calcular posición vertical
                const slotIndex = displayStartHour * 2 + Math.floor(displayStartMinute / 30)
                const topPosition = slotIndex * 60 // 60px por slot
                
                // Altura del evento basada en la duración
                const eventHeight = (durationMinutes / 30) * 60

                return (
                  <div
                    key={event.id}
                    draggable
                    onMouseDown={() => handleEventMouseDown(event)}
                    onDragStart={() => handleEventDragStart(event)}
                    onDragEnd={handleEventDragEnd}
                    onClick={() => handleEventClick(event)}
                    className={`absolute ${event.color} rounded-lg shadow-sm cursor-move hover:shadow-md transition-all duration-200 select-none ${
                      draggedEvent?.id === event.id ? 'opacity-30 scale-105 z-50' : 'hover:scale-[1.02]'
                    }`}
                    style={{
                      top: `${topPosition}px`,
                      height: `${eventHeight}px`,
                      left: '64px',
                      right: '16px',
                      zIndex: draggedEvent?.id === event.id ? 50 : 10
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-3 h-full">
                          <div className="flex flex-col h-full">
                            <div className="font-medium flex items-center gap-2 text-white">
                              <Clock className="w-4 h-4" />
                              {event.time}{event.endTime ? ` - ${event.endTime}` : ''} - {event.title}
                            </div>
                            <div className="text-sm opacity-90 text-white">{EVENT_TYPES[event.type]?.label || event.type}</div>
                            {event.notes && durationMinutes > 60 && (
                              <div className="text-sm mt-1 opacity-90 text-white">{event.notes}</div>
                            )}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{event.title}</p>
                        <p>Hora: {event.time}{event.endTime ? ` - ${event.endTime}` : ''}</p>
                        <p>Tipo: {EVENT_TYPES[event.type]?.label || event.type}</p>
                        {event.notes && <p>Notas: {event.notes}</p>}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Columna derecha: Mini calendario */}
        <div className="w-64 border-l border-border overflow-y-auto">
          <div className="p-4 pt-2">
            <MiniCalendar
              currentDate={currentDate}
              onDateSelect={onDateSelect || (() => {})}
              onNavigate={onNavigate || (() => {})}
            />
          </div>
        </div>
      </div>
    </div>
  )
}