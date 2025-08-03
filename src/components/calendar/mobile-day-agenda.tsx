"use client"

import React, { useState, useEffect, Fragment } from "react"
import { format, isSameDay } from "date-fns"
import { es } from "date-fns/locale"

import { CalendarEvent } from "./month-view"

const EVENT_TYPES: Record<string, { label: string; color: string }> = {
  cita: { label: "Cita", color: "bg-chart-1" },
  recordatorio: { label: "Recordatorio", color: "bg-chart-2" },
  ejercicio: { label: "Ejercicio", color: "bg-chart-3" },
  meditacion: { label: "Meditación", color: "bg-chart-4" },
  personal: { label: "Personal", color: "bg-chart-5" }
}

interface MobileDayAgendaProps {
  currentDate: Date
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  onDragStart?: (event: CalendarEvent) => void
  onDragEnd?: () => void
  onDrop?: (targetDate: Date, targetTime?: string) => void
  draggedEvent?: CalendarEvent | null
}

export function MobileDayAgenda({ 
  currentDate, 
  events, 
  onEventClick,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedEvent
}: MobileDayAgendaProps) {
  // Estado para trackear el slot target durante el drag
  const [dragTargetSlot, setDragTargetSlot] = useState<{hour: number, minute: number} | null>(null)
  // Ref para el contenedor scrolleable
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  // Estado para tracking de touch/mouse drag
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartPos, setDragStartPos] = useState<{x: number, y: number} | null>(null)
  // Estado para diferenciar entre click y drag
  const [isPointerDragging, setIsPointerDragging] = useState(false)
  const [clickStartTime, setClickStartTime] = useState(0)
  
  // Limpiar estado de drag cuando cambien los eventos
  useEffect(() => {
    if (!draggedEvent) {
      setDragTargetSlot(null)
      setIsDragging(false)
      setIsPointerDragging(false)
    }
  }, [events, draggedEvent])
  
  // Función para auto-scroll durante drag
  const handleAutoScroll = React.useCallback((e: React.DragEvent) => {
    if (!scrollContainerRef.current || !draggedEvent) return
    
    const container = scrollContainerRef.current
    const rect = container.getBoundingClientRect()
    const scrollThreshold = 60 // píxeles desde el borde para activar scroll
    const scrollSpeed = 5
    
    const y = e.clientY - rect.top
    
    if (y < scrollThreshold) {
      // Scroll hacia arriba
      container.scrollTop = Math.max(0, container.scrollTop - scrollSpeed)
    } else if (y > rect.height - scrollThreshold) {
      // Scroll hacia abajo  
      container.scrollTop = Math.min(
        container.scrollHeight - container.clientHeight,
        container.scrollTop + scrollSpeed
      )
    }
  }, [draggedEvent])
  
  // Generar intervalos de 30 minutos (48 intervalos: 00:00, 00:30, 01:00, 01:30, ...)
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = (i % 2) * 30
    return { hour, minute, isHalfHour: minute === 30 }
  })
  
  // Filtrar eventos del día actual
  const dayEvents = events.filter(event => isSameDay(event.date, currentDate))
  
  // Función para determinar si un evento ocupa una hora específica
  const isEventAtHour = (event: CalendarEvent, hour: number) => {
    if (!event.time) return false
    
    const startHour = parseInt(event.time.split(":")[0])
    let endHour = startHour
    
    // Si tiene hora de fin, calcular la hora de fin
    if (event.endTime) {
      endHour = parseInt(event.endTime.split(":")[0])
      // Si el minuto de fin no es 00, incluir la siguiente hora
      const endMinute = parseInt(event.endTime.split(":")[1])
      if (endMinute > 0) {
        endHour += 1
      }
    } else {
      // Si no tiene hora de fin, asumir 1 hora de duración
      endHour = startHour + 1
    }
    
    return hour >= startHour && hour < endHour
  }
  
  // Obtener todos los eventos que ocupan una hora específica
  const getEventsAtHour = (hour: number) => {
    return dayEvents.filter(event => isEventAtHour(event, hour))
  }
  
  // Función para determinar si un evento empieza en una hora específica
  const doesEventStartAtHour = (event: CalendarEvent, hour: number) => {
    if (!event.time) return false
    const startHour = parseInt(event.time.split(":")[0])
    return startHour === hour
  }

  // Handlers para touch/mouse drag (más confiable que HTML5 drag/drop en móvil)
  const handlePointerDown = (e: React.PointerEvent, event: CalendarEvent) => {
    e.preventDefault()
    // console.log('🎯 Pointer down:', event.title)
    const rect = e.currentTarget.getBoundingClientRect()
    setDragStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setIsDragging(true)
    setIsPointerDragging(false)
    setClickStartTime(Date.now())
    onDragStart?.(event)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !draggedEvent || !scrollContainerRef.current) return
    
    e.preventDefault()
    setIsPointerDragging(true) // Marcar que estamos arrastrando
    const container = scrollContainerRef.current
    const rect = container.getBoundingClientRect()
    const y = e.clientY - rect.top + container.scrollTop
    
    // Calcular en qué slot estamos basado en la posición Y
    const slotIndex = Math.floor(y / 48)
    const hour = Math.floor(slotIndex / 2)
    const minute = (slotIndex % 2) * 30
    
    if (hour >= 0 && hour < 24) {
      // console.log('🎯 Pointer move over slot:', { hour, minute, y })
      setDragTargetSlot({ hour, minute })
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !draggedEvent) return
    
    // console.log('🎯 Pointer up - checking drop')
    if (dragTargetSlot && onDrop && isPointerDragging) {
      const timeString = `${dragTargetSlot.hour.toString().padStart(2, '0')}:${dragTargetSlot.minute.toString().padStart(2, '0')}`
      // console.log('📞 Ejecutando drop con:', { currentDate, timeString })
      onDrop(currentDate, timeString)
    }
    
    setIsDragging(false)
    setIsPointerDragging(false)
    setDragStartPos(null)
    setDragTargetSlot(null)
    onDragEnd?.()
  }

  // Handlers para drag and drop (mantener como fallback)
  const handleDragOver = (e: React.DragEvent, hour: number, minute: number) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    // Solo log esporádico para evitar spam
    if (Math.random() < 0.1) {
      // console.log('Drag over:', { hour, minute })
    }
    if (draggedEvent) {
      setDragTargetSlot({ hour, minute })
      handleAutoScroll(e)
    }
  }

  const handleDropOnTimeSlot = (e: React.DragEvent, hour: number, minute: number) => {
    e.preventDefault()
    e.stopPropagation()
    // console.log('🎯 DROP DETECTADO en mobile-day-agenda:', { hour, minute, draggedEvent: draggedEvent?.title })
    if (onDrop && draggedEvent) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      // console.log('📞 Llamando onDrop con:', { currentDate, timeString })
      onDrop(currentDate, timeString)
    } else {
      // console.log('❌ No se puede hacer drop:', { onDrop: !!onDrop, draggedEvent: !!draggedEvent })
    }
    setDragTargetSlot(null)
  }

  const handleDragEnd = () => {
    // console.log('🏁 Drag end - draggedEvent:', draggedEvent?.title)
    onDragEnd?.()
    setDragTargetSlot(null)
    setIsPointerDragging(false)
  }

  // Manejar click en evento (solo si no hay drag)
  const handleEventClick = (event: CalendarEvent) => {
    const timeDiff = Date.now() - clickStartTime
    // Solo ejecutar click si no estamos en medio de un drag pointer y ha pasado poco tiempo
    if (!isPointerDragging && timeDiff < 300) {
      onEventClick?.(event)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Solo limpiar si realmente salimos del contenedor principal
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragTargetSlot(null)
    }
  }

  // Función para calcular la duración de un evento en minutos
  const getEventDurationInMinutes = (event: CalendarEvent) => {
    if (!event.time) return 60 // duración por defecto de 1 hora
    
    if (event.endTime) {
      const startMinutes = parseInt(event.time.split(':')[0]) * 60 + parseInt(event.time.split(':')[1])
      const endMinutes = parseInt(event.endTime.split(':')[0]) * 60 + parseInt(event.endTime.split(':')[1])
      return endMinutes - startMinutes
    }
    
    return 60 // duración por defecto de 1 hora si no hay endTime
  }

  // Función para obtener la hora que se debe mostrar en el evento
  const getDisplayTime = (event: CalendarEvent) => {
    // Si este evento está siendo arrastrado y tenemos un target slot, mostrar la nueva hora
    if (draggedEvent?.id === event.id && dragTargetSlot) {
      const newStartTime = `${dragTargetSlot.hour.toString().padStart(2, '0')}:${dragTargetSlot.minute.toString().padStart(2, '0')}`
      
      // Calcular la duración original del evento
      const durationMinutes = getEventDurationInMinutes(event)
      
      // Calcular la nueva hora de fin manteniendo la misma duración
      const newStartTotalMinutes = dragTargetSlot.hour * 60 + dragTargetSlot.minute
      const newEndTotalMinutes = newStartTotalMinutes + durationMinutes
      
      const newEndHour = Math.floor(newEndTotalMinutes / 60)
      const newEndMinute = newEndTotalMinutes % 60
      const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMinute.toString().padStart(2, '0')}`
      
      return `${newStartTime} - ${newEndTime}`
    }
    
      // Si no está siendo arrastrado, mostrar la hora original
  return event.time + (event.endTime ? ` - ${event.endTime}` : '')
}

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
    
    // Calcular la posición en píxeles (cada slot de 30 min = 48px)
    const totalMinutes = hours * 60 + minutes
    const slotIndex = totalMinutes / 30 // Cada slot es de 30 minutos
    return slotIndex * 48 // 48px por slot
  }

  const currentTimePosition = getCurrentTimePosition()
  const isToday = isSameDay(currentDate, new Date())

  return (
    <div className="absolute inset-0 bg-background flex flex-col">
            {/* Cabecera específica para vista de día */}
      <div className="flex-shrink-0 bg-background border-b border-border">
        {multiDayEventInfo && (
          <div 
            className={`${multiDayEventInfo.event.color} rounded-lg shadow-sm mt-2 mb-1`}
            style={{
              marginLeft: '64px',
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

      {/* Contenedor de la agenda con scroll propio */}
      <div 
        className="flex-1 overflow-y-auto overscroll-contain" 
        onDragLeave={handleDragLeave} 
        ref={scrollContainerRef} 
        onDragOver={handleAutoScroll}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        <div className="relative" style={{ height: '2304px' }}> {/* 48 slots * 48px = 2304px */}
          {/* Debug: Marcadores de referencia cada 4 horas */}
          {/* {process.env.NODE_ENV === 'development' && [0, 4, 8, 12, 16, 20].map(hour => {
            // Calcular la posición real basada en el slot index
            const slotIndex = hour * 2 // cada hora son 2 slots (00:00 y 00:30)
            const realPosition = slotIndex * 48
            return (
              <div 
                key={`marker-${hour}`}
                className="absolute left-0 w-full border-t border-red-500 z-30"
                style={{ top: `${realPosition}px` }}
              >
                <span className="bg-red-500 text-white text-xs px-1">
                  {hour.toString().padStart(2, '0')}:00 @ slot{slotIndex} = {realPosition}px
                </span>
              </div>
            )
          })} */}
          
          {/* Etiquetas de horas posicionadas absolutamente */}
          {timeSlots.filter(slot => !slot.isHalfHour && slot.hour !== 0).map((slot) => {
            const slotIndex = slot.hour * 2
            const labelPosition = slotIndex * 48
            
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
                  {format(new Date().setHours(slot.hour, 0), "HH:mm")}
                </span>
              </div>
            )
          })}
          
          {/* Líneas horizontales posicionadas absolutamente */}
          {timeSlots.map((slot, index) => {
            const slotIndex = slot.hour * 2 + Math.floor(slot.minute / 30)
            const linePosition = slotIndex * 48
            
            return (
              <div
                key={`line-${slot.hour}-${slot.minute}`}
                className="absolute left-16 right-0 z-10"
                style={{ top: `${linePosition}px` }}
              >
                {!slot.isHalfHour ? (
                  /* Línea continua para horas completas */
                  <div className="w-full h-px bg-border/60" />
                ) : (
                  /* Línea discontinua para medias horas */
                  <div className="w-full h-px border-t border-dashed border-border/40" />
                )}
              </div>
            )
          })}
          
          {timeSlots.map((slot, index) => {
            const eventsAtSlot = getEventsAtHour(slot.hour)
            const startingEvents = eventsAtSlot.filter(event => {
              if (!event.time) return false
              const [eventHour, eventMinute] = event.time.split(":").map(Number)
              return eventHour === slot.hour && 
                     ((slot.minute === 0 && eventMinute < 30) || 
                      (slot.minute === 30 && eventMinute >= 30))
            })
            
            return (
              <div key={`${slot.hour}-${slot.minute}`} className="relative flex">
                {/* Debug temporal para slots */}
                {/* {process.env.NODE_ENV === 'development' && slot.hour === 8 && slot.minute === 0 && (
                  <div className="absolute top-0 left-0 text-xs bg-red-500 text-white px-1 z-50">
                    08:00 Slot {slot.hour * 2 + Math.floor(slot.minute / 30)} @ posición DOM {index * 48}px (teórico: {(slot.hour * 2 + Math.floor(slot.minute / 30)) * 48}px)
                  </div>
                )} */}
                {/* {process.env.NODE_ENV === 'development' && slot.hour === 20 && slot.minute === 0 && (
                  <div className="absolute top-0 left-0 text-xs bg-purple-500 text-white px-1 z-50">
                    20:00 Slot {slot.hour * 2 + Math.floor(slot.minute / 30)} @ posición DOM {index * 48}px (teórico: {(slot.hour * 2 + Math.floor(slot.minute / 30)) * 48}px)
                  </div>
                )} */}
                
                {/* Columna de hora con borde derecho */}
                <div className="w-16 flex-shrink-0 border-r border-border/30 h-12">
                  {/* Las etiquetas de hora ahora se renderizan de forma absoluta */}
                </div>
                
                {/* Área de eventos con línea horizontal */}
                <div 
                  className={`flex-1 relative h-12 pl-4 ${
                    draggedEvent && dragTargetSlot?.hour === slot.hour && dragTargetSlot?.minute === slot.minute 
                      ? 'bg-primary/20 border-l-2 border-primary' 
                      : ''
                  }`}
                  onDragOver={(e) => handleDragOver(e, slot.hour, slot.minute)}
                  onDragEnter={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onDrop={(e) => handleDropOnTimeSlot(e, slot.hour, slot.minute)}
                  style={{ minHeight: '48px' }}
                >
                  {draggedEvent && dragTargetSlot?.hour === slot.hour && dragTargetSlot?.minute === slot.minute && (
                    /* Indicador visual de zona de drop activa */
                    <div className="w-full h-1 bg-primary rounded-full absolute top-0" />
                  )}
                </div>
              </div>
            )
          })}
          
                     {/* Indicador de hora actual */}
           {isToday && (
             <div 
               className="absolute z-40 flex items-center"
               style={{ 
                 top: `${currentTimePosition}px`,
                 left: '0px',
                 right: '0px'
               }}
             >
               {/* Círculo indicador */}
               <div className="w-3 h-3 bg-primary rounded-full border-2 border-background shadow-md ml-14 z-50"></div>
               {/* Línea horizontal */}
               <div className="flex-1 h-0.5 bg-primary ml-1"></div>
             </div>
           )}
          
          {/* Eventos renderizados por separado como elementos absolutos */}
          {dayEvents.filter(event => {
            // Solo mostrar eventos que tienen hora Y que no son de múltiples días
            // Los eventos de múltiples días se muestran solo en la cabecera
            const isMultiDay = event.endDate && !isSameDay(event.date, event.endDate)
            return event.time && !isMultiDay
          }).map((event) => {
            const startHour = parseInt(event.time!.split(":")[0])
            const startMinute = parseInt(event.time!.split(":")[1])
            
            // Calcular la duración del evento en minutos
            const durationMinutes = getEventDurationInMinutes(event)
            
            // Para el posicionamiento, siempre usar la hora actual del evento
            // Solo durante el drag mostrar la posición del target slot
            let displayStartHour = startHour
            let displayStartMinute = startMinute
            
            // Solo sobrescribir la posición si estamos arrastrando Y tenemos un target slot
            if (draggedEvent?.id === event.id && dragTargetSlot) {
              displayStartHour = dragTargetSlot.hour
              displayStartMinute = dragTargetSlot.minute
            }
            
            // Calcular posición vertical basada en la hora de display
            // Cada slot es de 30 minutos, así que:
            // 00:00 = slot 0, 00:30 = slot 1, 01:00 = slot 2, 01:30 = slot 3, etc.
            const slotIndex = displayStartHour * 2 + Math.floor(displayStartMinute / 30)
            const topPosition = slotIndex * 48 // 48px por slot
            
            // Debug temporal
            {/* if (process.env.NODE_ENV === 'development') {
              console.log(`Evento "${event.title}": ${event.time} -> Hora: ${displayStartHour}, Minuto: ${displayStartMinute}, Slot: ${slotIndex}, Top: ${topPosition}px`)
            } */}
            
            // Altura del evento basada en la duración en minutos (48px por cada 30 minutos)
            const eventHeight = (durationMinutes / 30) * 48

            return (
              <Fragment key={event.id}>
                {/* Debug: Línea de referencia para verificar posición */}
                {/* {process.env.NODE_ENV === 'development' && (event.time === '08:00' || event.time === '10:30') && (
                  <div 
                    className="absolute w-full border-t-2 border-yellow-400 z-40"
                    style={{ top: `${topPosition}px`, left: 0 }}
                  >
                    <span className="bg-yellow-400 text-black text-xs px-1">
                      {event.time} debería estar aquí (slot {slotIndex})
                    </span>
                  </div>
                )} */}
                
              <div
                draggable
                onDragStart={(e) => {
                  // console.log('Drag started:', event.title)
                  e.dataTransfer.effectAllowed = 'move'
                  e.dataTransfer.setData('text/plain', event.id)
                  setIsPointerDragging(true) // Marcar como drag desde el inicio
                  onDragStart?.(event)
                }}
                onDragEnd={handleDragEnd}
                onPointerDown={(e) => handlePointerDown(e, event)}
                className={`absolute ${event.color} rounded-lg shadow-sm cursor-move hover:shadow-md transition-all duration-200 select-none ${
                    draggedEvent?.id === event.id ? 'opacity-30 scale-105 z-50' : 'hover:scale-[1.02]'
                  }`}
                  style={{
                    top: `${topPosition}px`,
                    height: `${eventHeight}px`,
                    left: '64px', // Exactamente después de w-16
                    right: '16px',
                    zIndex: draggedEvent?.id === event.id ? 50 : 10
                  }}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="p-3 h-full">
                    <div className="flex flex-col h-full">
                      <h3 className="font-medium text-white text-sm leading-tight">
                        {event.title}
                      </h3>
                      
                      <div className="flex items-center gap-1 mt-1 text-xs text-white/80">
                        <span>
                          {getDisplayTime(event)}
                        </span>
                      </div>
                      
                      {event.notes && durationMinutes > 60 && (
                        <p className="text-xs text-white/70 mt-2 line-clamp-2">
                          {event.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}