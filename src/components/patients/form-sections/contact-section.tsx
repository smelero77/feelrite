"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MessageCircle } from "lucide-react"

interface ContactSectionProps {
  className?: string
}

export function ContactSection({ className }: ContactSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
                 <CardTitle className="flex items-center gap-2">
           <Phone className="h-5 w-5" />
           Información de Contacto
         </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="space-y-2">
             <Label htmlFor="phone">Teléfono</Label>
             <div className="relative">
               <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
               <Input id="phone" type="tel" placeholder="Ingresa el número de teléfono" className="pl-10" />
             </div>
           </div>
           <div className="space-y-2">
             <Label htmlFor="email">Email</Label>
             <div className="relative">
               <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
               <Input id="email" type="email" placeholder="Ingresa la dirección de email" className="pl-10" />
             </div>
           </div>
           <div className="space-y-2">
             <Label htmlFor="whatsapp">WhatsApp</Label>
             <div className="relative">
               <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
               <Input id="whatsapp" type="tel" placeholder="Ingresa el número de WhatsApp" className="pl-10" />
             </div>
           </div>
         </div>

                 <div className="space-y-2">
           <Label htmlFor="whatsapp">Abrir WhatsApp</Label>
           <Button variant="outline" size="sm" className="w-full">
             Abrir WhatsApp
           </Button>
         </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="timezone">Zona Horaria</Label>
             <Select>
               <SelectTrigger>
                 <SelectValue placeholder="Selecciona la zona horaria" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="utc-8">UTC-8 (Hora del Pacífico)</SelectItem>
                 <SelectItem value="utc-7">UTC-7 (Hora de Montaña)</SelectItem>
                 <SelectItem value="utc-6">UTC-6 (Hora Central)</SelectItem>
                 <SelectItem value="utc-5">UTC-5 (Hora del Este)</SelectItem>
                 <SelectItem value="utc+0">UTC+0 (GMT)</SelectItem>
                 <SelectItem value="utc+1">UTC+1 (Hora Central Europea)</SelectItem>
               </SelectContent>
             </Select>
           </div>
           
           <div className="space-y-2">
             <Label htmlFor="language">Idioma</Label>
             <Select>
               <SelectTrigger>
                 <SelectValue placeholder="Selecciona el idioma" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="english">Inglés</SelectItem>
                 <SelectItem value="spanish">Español</SelectItem>
                 <SelectItem value="french">Francés</SelectItem>
                 <SelectItem value="german">Alemán</SelectItem>
               </SelectContent>
             </Select>
           </div>
         </div>
      </CardContent>
    </Card>
  )
} 