"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MessageCircle, User, Plus, Edit, Trash2, Users } from "lucide-react"

interface Contact {
  id: string
  name: string
  relationship: string
  phone: string
  email: string
  whatsapp?: string
  isPrimary: boolean
  isEmergency: boolean
}

interface MultipleContactsSectionProps {
  className?: string
}

export function MultipleContactsSection({ className }: MultipleContactsSectionProps) {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "",
      relationship: "",
      phone: "",
      email: "",
      whatsapp: "",
      isPrimary: true,
      isEmergency: false
    }
  ])

  const addContact = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: "",
      relationship: "",
      phone: "",
      email: "",
      whatsapp: "",
      isPrimary: false,
      isEmergency: false
    }
    setContacts([...contacts, newContact])
  }

  const removeContact = (id: string) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter(contact => contact.id !== id))
    }
  }

  const updateContact = (id: string, field: keyof Contact, value: any) => {
    setContacts(contacts.map(contact => {
      if (contact.id === id) {
        return { ...contact, [field]: value }
      }
      return contact
    }))
  }

  const setPrimaryContact = (id: string) => {
    setContacts(contacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === id
    })))
  }

  const setEmergencyContact = (id: string) => {
    setContacts(contacts.map(contact => ({
      ...contact,
      isEmergency: contact.id === id
    })))
  }

  return (
    <Card className={className}>
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
        {contacts.map((contact, index) => (
          <div key={contact.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Contacto {index + 1}</span>
                {contact.isPrimary && (
                  <Badge variant="default" className="text-xs">Principal</Badge>
                )}
                {contact.isEmergency && (
                  <Badge variant="destructive" className="text-xs">Emergencia</Badge>
                )}
              </div>
              {contacts.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContact(contact.id)}
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
                  value={contact.name}
                  onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`relationship-${contact.id}`}>Relación</Label>
                <Select
                  value={contact.relationship}
                  onValueChange={(value) => updateContact(contact.id, 'relationship', value)}
                >
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
                    value={contact.phone}
                    onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                  />
                </div>
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
                    value={contact.email}
                    onChange={(e) => updateContact(contact.id, 'email', e.target.value)}
                  />
                </div>
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
                    value={contact.whatsapp}
                    onChange={(e) => updateContact(contact.id, 'whatsapp', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`primary-${contact.id}`}
                  checked={contact.isPrimary}
                  onChange={() => setPrimaryContact(contact.id)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor={`primary-${contact.id}`} className="text-sm">
                  Contacto Principal
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`emergency-${contact.id}`}
                  checked={contact.isEmergency}
                  onChange={() => setEmergencyContact(contact.id)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor={`emergency-${contact.id}`} className="text-sm">
                  Contacto de Emergencia
                </Label>
              </div>
            </div>
          </div>
        ))}

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
            <li>• Al menos un contacto debe ser marcado como "Principal"</li>
            <li>• Se recomienda tener al menos un "Contacto de Emergencia"</li>
            <li>• Para menores de edad, es obligatorio incluir información de padres o tutores</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 