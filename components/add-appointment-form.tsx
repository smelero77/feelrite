"use client"

import { useActionState } from "react"
import type React from "react"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Loader2, CalendarIcon } from "lucide-react"
import { createAppointment } from "@/app/dashboard/actions"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils" // Asegúrate de que esta importación esté presente

interface AddAppointmentFormProps {
  patientId: string
  onSuccess: () => void // Callback para cerrar el diálogo
}

export function AddAppointmentForm({ patientId, onSuccess }: AddAppointmentFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("")
  const [type, setType] = useState("")
  const [status, setStatus] = useState("Pendiente") // Valor por defecto
  const [notes, setNotes] = useState("")

  const [state, formAction, isPending] = useActionState(createAppointment, { success: false, message: "" })

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Éxito" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
      if (state.success) {
        onSuccess() // Cerrar el diálogo en caso de éxito
      }
    }
  }, [state, onSuccess])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!date || !time || !type || !status) {
      toast({
        title: "Error de validación",
        description: "Por favor, completa todos los campos obligatorios (Fecha, Hora, Tipo, Estado).",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData(event.currentTarget)
    formData.append("patientId", patientId)
    formData.append("date", date.toISOString().split("T")[0]) // Formato YYYY-MM-DD
    formData.append("time", time)
    formData.append("type", type)
    formData.append("status", status)
    formData.append("notes", notes)

    formAction(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <input type="hidden" name="patientId" value={patientId} />

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Fecha
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("col-span-3 justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="time" className="text-right">
          Hora
        </Label>
        <Input
          id="time"
          name="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="col-span-3 border-border-light focus:border-primary-blue focus:ring-0"
          type="time"
          required
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          Tipo de Sesión
        </Label>
        <Select onValueChange={setType} value={type} name="type" required>
          <SelectTrigger className="col-span-3 border-border-light focus:border-primary-blue focus:ring-0">
            <SelectValue placeholder="Selecciona un tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Terapia Individual">Terapia Individual</SelectItem>
            <SelectItem value="Terapia de Pareja">Terapia de Pareja</SelectItem>
            <SelectItem value="Terapia Familiar">Terapia Familiar</SelectItem>
            <SelectItem value="Evaluación">Evaluación</SelectItem>
            <SelectItem value="Seguimiento">Seguimiento</SelectItem>
            <SelectItem value="Consulta Online">Consulta Online</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Estado
        </Label>
        <Select onValueChange={setStatus} value={status} name="status" required>
          <SelectTrigger className="col-span-3 border-border-light focus:border-primary-blue focus:ring-0">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
            <SelectItem value="Confirmada">Confirmada</SelectItem>
            <SelectItem value="Cancelada">Cancelada</SelectItem>
            <SelectItem value="Completada">Completada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="notes" className="text-right pt-2">
          Notas
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="col-span-3 border-border-light focus:border-primary-blue focus:ring-0 min-h-[80px]"
        />
      </div>

      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="border-border-light text-primary-text hover:bg-gray-50"
            disabled={isPending}
          >
            Cancelar
          </Button>
        </DialogClose>
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:opacity-90"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Agendando...
            </>
          ) : (
            "Agendar Cita"
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
