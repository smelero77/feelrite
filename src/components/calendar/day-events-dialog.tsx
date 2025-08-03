"use client"

import React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { X, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { CalendarEvent } from "./month-view"

const EVENT_TYPES: Record<string, { label: string; color: string }> = {
  cita: { label: "Cita", color: "bg-chart-1" },
  recordatorio: { label: "Recordatorio", color: "bg-chart-2" },
  ejercicio: { label: "Ejercicio", color: "bg-chart-3" },
  meditacion: { label: "Meditación", color: "bg-chart-4" },
  personal: { label: "Personal", color: "bg-chart-5" }
}

interface DayEventsDialogProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  events: CalendarEvent[]
}

export function DayEventsDialog({
  isOpen,
  onClose,
  date,
  events
}: DayEventsDialogProps) {
  const sortedEvents = [...events].sort((a, b) => {
    if (a.time && b.time) {
      return a.time.localeCompare(b.time)
    }
    return 0
  })

  const dayName = format(date, "EEEE", { locale: es })
  const dayNumber = format(date, "d", { locale: es })
  const monthName = format(date, "MMMM", { locale: es })
  const year = format(date, "yyyy", { locale: es })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col animate-slide-up" 
        showCloseButton={false}
        style={{
          animation: isOpen ? 'slideUp 0.3s ease-out' : 'none'
        }}
      >
        <style jsx>{`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}</style>
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-chart-1"></div>
              <DialogTitle className="text-lg font-semibold">
                Citas del {dayName}, {dayNumber} de {monthName} {year}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 py-4">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay citas programadas para este día</p>
            </div>
          ) : (
            sortedEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg text-white ${event.color} shadow-sm`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {event.title}
                    </h3>
                    {event.time && (
                      <div className="flex items-center gap-2 text-sm opacity-90">
                        <Clock className="w-4 h-4" />
                        <span>
                          {event.time}
                          {event.endTime && !event.endDate && ` - ${event.endTime}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 