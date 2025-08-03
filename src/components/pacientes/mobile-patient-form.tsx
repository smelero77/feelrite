"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, User, Phone, MapPin, FileText, Users, ChevronRight } from "lucide-react"
import MobileNav from "./mobile-nav"

export default function MobilePatientForm() {
  const [activeTab, setActiveTab] = useState("datos")
  const [customFields, setCustomFields] = useState<Array<{id: string, label: string, value: string}>>([])

  const addCustomField = () => {
    const newField = {
      id: `custom-${Date.now()}`,
      label: "",
      value: ""
    }
    setCustomFields([...customFields, newField])
  }

  const updateCustomField = (id: string, field: string, value: string) => {
    setCustomFields(customFields.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ))
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <MobileNav 
        title="Ficha del Paciente" 
        onSave={() => console.log('Guardando...')}
      />

      {/* Tab Navigation */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("datos")}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "datos"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          }`}
        >
          Datos
        </button>
        <button
          onClick={() => setActiveTab("contactos")}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "contactos"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          }`}
        >
          Contactos
        </button>
      </div>

      {/* Datos Personales Tab */}
      {activeTab === "datos" && (
        <div className="space-y-4">
          {/* Información Básica */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ficha">N. de ficha</Label>
                <Input id="ficha" placeholder="1" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" placeholder="Sergio" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input id="apellidos" placeholder="Apellidos" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="escuela">Escuela / trabajo</Label>
                <Input id="escuela" placeholder="Escuela / trabajo" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nacimiento">Fecha de nacimiento</Label>
                <Input id="nacimiento" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zona">Zona horaria</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Europe/Madrid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="europe/madrid">Europe/Madrid</SelectItem>
                    <SelectItem value="europe/paris">Europe/Paris</SelectItem>
                    <SelectItem value="europe/london">Europe/London</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idioma">Idioma</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Español" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="español">Español</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="français">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Teléfono */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Phone className="h-4 w-4" />
                Teléfono
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prefijo">Prefijo</Label>
                <Input id="prefijo" placeholder="+34" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" placeholder="600 00 00 00" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Abrir WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* Dirección */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" />
                Dirección
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pais">País</Label>
                <Input id="pais" placeholder="Spain" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="calle">Calle</Label>
                <Input id="calle" placeholder="Calle" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numero">Número, apt, puerta...</Label>
                <Input id="numero" placeholder="Número, apt, puerta..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input id="ciudad" placeholder="Ciudad" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo">Código postal</Label>
                <Input id="codigo" placeholder="Código postal" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provincia">Estado/Provincia</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado/provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="madrid">Madrid</SelectItem>
                    <SelectItem value="barcelona">Barcelona</SelectItem>
                    <SelectItem value="valencia">Valencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documento de identidad */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" />
                Documento de identidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="documento">Documento de identidad</Label>
                <Input id="documento" placeholder="Documento de identidad" />
              </div>
            </CardContent>
          </Card>

          {/* Campos personalizados */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Campos personalizados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customFields.map((field) => (
                <div key={field.id} className="space-y-3">
                  <div className="space-y-2">
                    <Label>Etiqueta</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateCustomField(field.id, "label", e.target.value)}
                      placeholder="Etiqueta del campo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor</Label>
                    <Input
                      value={field.value}
                      onChange={(e) => updateCustomField(field.id, "value", e.target.value)}
                      placeholder="Valor del campo"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCustomField(field.id)}
                    className="w-full"
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addCustomField} className="flex items-center gap-2 w-full">
                <Plus className="h-4 w-4" />
                Añadir campo personalizado
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contactos Tab */}
      {activeTab === "contactos" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Contactos del paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contacto Padre */}
              <div className="space-y-4">
                <h3 className="font-medium">Padre</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="padre-nombre">Nombre</Label>
                    <Input id="padre-nombre" placeholder="Nombre" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="padre-email">Email</Label>
                    <Input id="padre-email" type="email" placeholder="Email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="padre-prefijo">Prefijo</Label>
                    <Input id="padre-prefijo" placeholder="+34" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="padre-telefono">Teléfono</Label>
                    <Input id="padre-telefono" placeholder="Teléfono" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="padre-dni">DNI</Label>
                    <Input id="padre-dni" placeholder="DNI" />
                  </div>
                </div>
              </div>

              <Button variant="outline" className="flex items-center gap-2 w-full">
                <Plus className="h-4 w-4" />
                Añadir contacto
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 pb-safe">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">Cancelar</Button>
          <Button className="flex-1">Guardar Cambios</Button>
        </div>
      </div>
    </div>
  )
} 