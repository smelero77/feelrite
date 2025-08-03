"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar, User, Baby } from "lucide-react"

interface BasicInfoSectionProps {
  className?: string
}

export function BasicInfoSection({ className }: BasicInfoSectionProps) {
  const [isMinor, setIsMinor] = React.useState(false)

  return (
    <Card className={className}>
      <CardHeader>
                 <CardTitle className="flex items-center gap-2">
           <User className="h-5 w-5" />
           Información Básica
         </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
             <Label htmlFor="firstName">Nombre</Label>
             <Input id="firstName" placeholder="Ingresa el nombre" />
           </div>
           <div className="space-y-2">
             <Label htmlFor="lastName">Apellidos</Label>
             <Input id="lastName" placeholder="Ingresa los apellidos" />
          </div>
        </div>
        
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           <div className="space-y-2">
             <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
             <div className="relative">
               <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
               <Input 
                 id="birthDate" 
                 type="date" 
                 className="pl-10 min-h-[40px]" 
                 max={new Date().toISOString().split('T')[0]}
               />
             </div>
           </div>
           <div className="space-y-2">
             <Label htmlFor="gender">Sexo</Label>
             <Select>
               <SelectTrigger>
                 <SelectValue placeholder="Selecciona el sexo" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="male">Masculino</SelectItem>
                 <SelectItem value="female">Femenino</SelectItem>
                 <SelectItem value="other">Otro</SelectItem>
               </SelectContent>
             </Select>
           </div>
           <div className="space-y-2 md:col-span-2 lg:col-span-1">
             <Label htmlFor="notes">Notas</Label>
             <Input id="notes" placeholder="Notas adicionales" />
           </div>
         </div>

         <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
           <div className="flex items-center gap-3">
             <Baby className="h-5 w-5 text-muted-foreground" />
             <div>
               <Label htmlFor="isMinor" className="text-sm font-medium">
                 ¿Es menor de edad?
               </Label>
               <p className="text-xs text-muted-foreground">
                 Marca esta opción si el paciente es menor de 18 años
               </p>
             </div>
           </div>
           <Switch
             id="isMinor"
             checked={isMinor}
             onCheckedChange={setIsMinor}
           />
         </div>
        
      </CardContent>
    </Card>
  )
} 