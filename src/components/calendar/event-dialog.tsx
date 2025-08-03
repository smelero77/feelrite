"use client"

import React from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

type EventType = "cita" | "recordatorio" | "ejercicio" | "meditacion" | "personal"

const EVENT_TYPES: Record<EventType, { label: string; color: string }> = {
  cita: { label: "Cita", color: "bg-chart-1 text-chart-1" },
  recordatorio: { label: "Recordatorio", color: "bg-chart-2 text-chart-2" },
  ejercicio: { label: "Ejercicio", color: "bg-chart-3 text-chart-3" },
  meditacion: { label: "Meditación", color: "bg-chart-4 text-chart-4" },
  personal: { label: "Personal", color: "bg-chart-5 text-chart-5" }
}

interface NewEventForm {
  title: string
  date: string
  time: string
  endDate: string
  endTime: string
  type: EventType
  notes: string
}

interface EventDialogProps {
  isOpen: boolean
  onClose: () => void
  newEvent: NewEventForm
  setNewEvent: (event: NewEventForm) => void
  onSave: () => void
}

export function EventDialog({
  isOpen,
  onClose,
  newEvent,
  setNewEvent,
  onSave
}: EventDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Cita</DialogTitle>
          <DialogDescription>
            Crea una nueva cita para tu calendario personal.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título del evento</Label>
            <Input
              id="title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Ej: Sesión de meditación"
            />
          </div>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Fecha de inicio</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Hora de inicio (opcional)</Label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="endDate">Fecha de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">Hora de fin (opcional)</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo de evento</Label>
            <Select value={newEvent.type} onValueChange={(value: EventType) => setNewEvent({ ...newEvent, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EVENT_TYPES).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${config.color.split(" ")[0]}`} />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Input
              id="notes"
              value={newEvent.notes}
              onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
              placeholder="Agrega notas adicionales..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={onSave}
            disabled={!newEvent.title || !newEvent.date}
          >
            Agregar Cita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 