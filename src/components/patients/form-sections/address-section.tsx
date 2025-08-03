"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"

interface AddressSectionProps {
  className?: string
}

export function AddressSection({ className }: AddressSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
                 <CardTitle className="flex items-center gap-2">
           <MapPin className="h-5 w-5" />
           Información de Dirección
         </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="space-y-2">
             <Label htmlFor="country">País</Label>
             <Select>
               <SelectTrigger>
                 <SelectValue placeholder="Selecciona el país" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="us">Estados Unidos</SelectItem>
                 <SelectItem value="ca">Canadá</SelectItem>
                 <SelectItem value="mx">México</SelectItem>
                 <SelectItem value="es">España</SelectItem>
                 <SelectItem value="fr">Francia</SelectItem>
                 <SelectItem value="de">Alemania</SelectItem>
               </SelectContent>
             </Select>
           </div>
           <div className="space-y-2">
             <Label htmlFor="state">Estado/Provincia</Label>
             <Select>
               <SelectTrigger>
                 <SelectValue placeholder="Selecciona el estado/provincia" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="ca">California</SelectItem>
                 <SelectItem value="ny">Nueva York</SelectItem>
                 <SelectItem value="tx">Texas</SelectItem>
                 <SelectItem value="fl">Florida</SelectItem>
               </SelectContent>
             </Select>
           </div>
           <div className="space-y-2">
             <Label htmlFor="city">Ciudad</Label>
             <Input id="city" placeholder="Ingresa la ciudad" />
           </div>
         </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="postalCode">Código Postal</Label>
             <Input id="postalCode" placeholder="Ingresa el código postal" />
           </div>
           <div className="space-y-2">
             <Label htmlFor="address2">Línea de Dirección 2 (Opcional)</Label>
             <Input id="address2" placeholder="Apartamento, suite, etc." />
           </div>
         </div>

                 <div className="space-y-2">
           <Label htmlFor="address">Dirección</Label>
           <Input id="address" placeholder="Ingresa la dirección de la calle" />
         </div>
         
         <div className="space-y-2">
           <Label htmlFor="address2">Línea de Dirección 2 (Opcional)</Label>
           <Input id="address2" placeholder="Apartamento, suite, etc." />
         </div>
      </CardContent>
    </Card>
  )
} 