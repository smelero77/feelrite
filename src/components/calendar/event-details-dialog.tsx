"use client"

import React from "react"
import { format, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { X, Clock, Calendar, FileText, Edit, Trash2 } from "lucide-react"

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

interface EventDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  event: CalendarEvent | null
  onEdit: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
}

export function EventDetailsDialog({
  isOpen,
  onClose,
  event,
  onEdit,
  onDelete
}: EventDetailsDialogProps) {
  if (!event) return null

  const handleEdit = () => {
    onEdit(event)
    onClose()
  }

  const handleDelete = () => {
    onDelete(event.id)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[500px] animate-slide-up" 
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
              <div className={`inline-block px-3 py-1 rounded-full text-sm text-white ${event.color}`}>
                {EVENT_TYPES[event.type]?.label || event.type}
              </div>
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

        <div className="space-y-6 py-4">
          {/* Título del evento */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{event.title}</h3>
          </div>

          {/* Información del evento */}
          <div className="space-y-4">
            {!event.endDate || isSameDay(event.date, event.endDate) ? (
              // Eventos de un solo día
              <>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{format(event.date, "EEEE, d 'de' MMMM yyyy", { locale: es })}</span>
                </div>
                
                {event.time && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      {event.endTime && !event.endDate 
                        ? `${event.time} - ${event.endTime}`
                        : event.time
                      }
                    </span>
                  </div>
                )}
              </>
            ) : null}

            {event.endDate && !isSameDay(event.date, event.endDate) && (
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Desde {format(event.date, "EEEE, d 'de' MMMM yyyy", { locale: es })}</span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>a {format(event.endDate, "EEEE, d 'de' MMMM yyyy", { locale: es })}</span>
                </div>
                {event.endTime && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{event.endTime}</span>
                  </div>
                )}
              </div>
            )}

            {event.notes && (
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Notas</span>
                </div>
                <div className="pl-7 text-sm bg-muted/30 p-3 rounded-lg">
                  {event.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 