"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CreditCard } from "lucide-react"

interface IdentitySectionProps {
  className?: string
}

export function IdentitySection({ className }: IdentitySectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
                 <CardTitle className="flex items-center gap-2">
           <CreditCard className="h-5 w-5" />
           Documento de Identidad
         </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           <div className="space-y-2">
             <Label htmlFor="documentType">Tipo de Documento</Label>
             <Select>
               <SelectTrigger>
                 <SelectValue placeholder="Selecciona el tipo de documento" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="passport">Pasaporte</SelectItem>
                 <SelectItem value="national-id">DNI</SelectItem>
                 <SelectItem value="driver-license">Licencia de Conducir</SelectItem>
                 <SelectItem value="social-security">Número de Seguridad Social</SelectItem>
               </SelectContent>
             </Select>
           </div>
           <div className="space-y-2">
             <Label htmlFor="documentNumber">Número de Documento</Label>
             <Input id="documentNumber" placeholder="Ingresa el número de documento" />
           </div>
           <div className="space-y-2">
             <Label htmlFor="issueDate">Fecha de Emisión</Label>
             <div className="relative">
               <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
               <Input 
                 id="issueDate" 
                 type="date" 
                 className="pl-10 min-h-[40px]" 
                 max={new Date().toISOString().split('T')[0]}
               />
             </div>
           </div>
         </div>

                 <div className="space-y-2">
           <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
           <div className="relative">
             <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
             <Input 
               id="expiryDate" 
               type="date" 
               className="pl-10 min-h-[40px]" 
               min={new Date().toISOString().split('T')[0]}
             />
           </div>
         </div>
      </CardContent>
    </Card>
  )
} 