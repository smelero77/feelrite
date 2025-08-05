"use client"

import { UseFormRegister, UseFormControl, FieldErrors, UseFormWatch, UseFormSetValue, useFieldArray } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MessageCircle, User, Plus, Edit, Trash2, Users } from "lucide-react"
import { PatientFormData } from "@/lib/validators/patient-validator"

interface MultipleContactsSectionProps {
  className?: string
  register: UseFormRegister<PatientFormData>
  control: UseFormControl<PatientFormData>
  errors: FieldErrors<PatientFormData>
  watch: UseFormWatch<PatientFormData>
  setValue: UseFormSetValue<PatientFormData>
}

export function MultipleContactsSection({ 
  className, 
  register, 
  control, 
  errors, 
  watch, 
  setValue 
}: MultipleContactsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts"
  })

  const addContact = () => {
    append({
      id: Date.now().toString(),
      name: "",
      relationship: "",
      phone: "",
      email: "",
      whatsapp: "",
      isPrimary: false,
      isEmergency: false
    })
  }

  const setPrimaryContact = (index: number) => {
    fields.forEach((_, fieldIndex) => {
      setValue(`contacts.${fieldIndex}.isPrimary`, fieldIndex === index)
    })
  }

  const setEmergencyContact = (index: number) => {
    fields.forEach((_, fieldIndex) => {
      setValue(`contacts.${fieldIndex}.isEmergency`, fieldIndex === index)
    })
  }

  return (
    <Card className={`${className} bg-background/50 border-border/50`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Contactos del Paciente
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Añade múltiples contactos para el paciente. Especialmente útil para menores de edad.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((contact, index) => (
          <div key={contact.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Contacto {index + 1}</span>
                {watch(`contacts.${index}.isPrimary`) && (
                  <Badge variant="default" className="text-xs">Principal</Badge>
                )}
                {watch(`contacts.${index}.isEmergency`) && (
                  <Badge variant="destructive" className="text-xs">Emergencia</Badge>
                )}
              </div>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${contact.id}`}>Nombre del Contacto</Label>
                <Input
                  id={`name-${contact.id}`}
                  placeholder="Nombre completo"
                  {...register(`contacts.${index}.name`)}
                />
                {errors.contacts?.[index]?.name && (
                  <p className="text-sm text-destructive mt-1">{errors.contacts[index]?.name?.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`relationship-${contact.id}`}>Relación</Label>
                <Controller
                  name={`contacts.${index}.relationship`}
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la relación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Padre/Madre</SelectItem>
                        <SelectItem value="guardian">Tutor Legal</SelectItem>
                        <SelectItem value="spouse">Cónyuge</SelectItem>
                        <SelectItem value="sibling">Hermano/a</SelectItem>
                        <SelectItem value="child">Hijo/a</SelectItem>
                        <SelectItem value="friend">Amigo/a</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.contacts?.[index]?.relationship && (
                  <p className="text-sm text-destructive mt-1">{errors.contacts[index]?.relationship?.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`phone-${contact.id}`}>Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={`phone-${contact.id}`}
                    type="tel"
                    placeholder="Número de teléfono"
                    className="pl-10"
                    {...register(`contacts.${index}.phone`)}
                  />
                </div>
                {errors.contacts?.[index]?.phone && (
                  <p className="text-sm text-destructive mt-1">{errors.contacts[index]?.phone?.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`email-${contact.id}`}>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={`email-${contact.id}`}
                    type="email"
                    placeholder="Dirección de email"
                    className="pl-10"
                    {...register(`contacts.${index}.email`)}
                  />
                </div>
                {errors.contacts?.[index]?.email && (
                  <p className="text-sm text-destructive mt-1">{errors.contacts[index]?.email?.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`whatsapp-${contact.id}`}>WhatsApp</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={`whatsapp-${contact.id}`}
                    type="tel"
                    placeholder="Número de WhatsApp"
                    className="pl-10"
                    {...register(`contacts.${index}.whatsapp`)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Controller
                  name={`contacts.${index}.isPrimary`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      id={`primary-${contact.id}`}
                      checked={field.value}
                      onChange={() => setPrimaryContact(index)}
                      className="rounded border-gray-300"
                    />
                  )}
                />
                <Label htmlFor={`primary-${contact.id}`} className="text-sm">
                  Contacto Principal
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Controller
                  name={`contacts.${index}.isEmergency`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      id={`emergency-${contact.id}`}
                      checked={field.value}
                      onChange={() => setEmergencyContact(index)}
                      className="rounded border-gray-300"
                    />
                  )}
                />
                <Label htmlFor={`emergency-${contact.id}`} className="text-sm">
                  Contacto de Emergencia
                </Label>
              </div>
            </div>
          </div>
        ))}

        {errors.contacts && typeof errors.contacts === 'object' && 'message' in errors.contacts && (
          <p className="text-sm text-destructive mt-1">{errors.contacts.message}</p>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={addContact}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Añadir Otro Contacto
        </Button>

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Información Importante</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Al menos un contacto debe ser marcado como &quot;Principal&quot;</li>
            <li>• Se recomienda tener al menos un &quot;Contacto de Emergencia&quot;</li>
            <li>• Para menores de edad, es obligatorio incluir información de padres o tutores</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 