"use client"

import { useActionState } from "react"
import type React from "react"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // Necesitarás este componente si no lo tienes
import { DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { updatePatientProfile } from "@/app/dashboard/actions"

interface EditPatientFormProps {
  patient: {
    id: string
    name: string
    email: string
    phone?: string | null
    address?: string | null
    avatarUrl?: string | null
    notes?: string | null
  }
  onSuccess: () => void // Callback para cerrar el diálogo
}

export function EditPatientForm({ patient, onSuccess }: EditPatientFormProps) {
  const [name, setName] = useState(patient.name)
  const [email, setEmail] = useState(patient.email)
  const [phone, setPhone] = useState(patient.phone || "")
  const [address, setAddress] = useState(patient.address || "")
  const [notes, setNotes] = useState(patient.notes || "")
  const [avatarUrl, setAvatarUrl] = useState(patient.avatarUrl || "")

  const [state, formAction, isPending] = useActionState(updatePatientProfile, { success: false, message: "" })

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
    const formData = new FormData(event.currentTarget)
    formData.append("id", patient.id) // Asegúrate de pasar el ID del paciente
    formAction(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <input type="hidden" name="id" value={patient.id} /> {/* Campo oculto para el ID del paciente */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Nombre
        </Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="col-span-3 border-border-light focus:border-primary-blue focus:ring-0"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="col-span-3 border-border-light focus:border-primary-blue focus:ring-0"
          type="email"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Teléfono
        </Label>
        <Input
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="col-span-3 border-border-light focus:border-primary-blue focus:ring-0"
          type="tel"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address" className="text-right">
          Dirección
        </Label>
        <Input
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="col-span-3 border-border-light focus:border-primary-blue focus:ring-0"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="avatarUrl" className="text-right">
          URL Avatar
        </Label>
        <Input
          id="avatarUrl"
          name="avatarUrl"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="col-span-3 border-border-light focus:border-primary-blue focus:ring-0"
          type="url"
        />
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
          className="col-span-3 border-border-light focus:border-primary-blue focus:ring-0 min-h-[100px]"
        />
      </div>
      <DialogFooter className="mt-6">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-border-light text-primary-text hover:bg-gray-50 bg-transparent"
            disabled={isPending}
          >
            Cancelar
          </Button>
        </DialogClose>
        <Button
          type="submit"
          className="rounded-full bg-primary-blue text-white hover:bg-primary-blue/90"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
