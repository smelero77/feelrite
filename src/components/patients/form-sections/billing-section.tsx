"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Receipt } from "lucide-react"

interface BillingSectionProps {
  className?: string
}

export function BillingSection({ className }: BillingSectionProps) {
  const [billingEnabled, setBillingEnabled] = useState(false)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Información de Facturación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="billing" 
            checked={billingEnabled}
            onCheckedChange={(checked) => setBillingEnabled(checked as boolean)}
          />
          <Label htmlFor="billing" className="text-sm font-normal">
            Este paciente requiere información de facturación
          </Label>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Cuando está habilitado, campos adicionales de facturación estarán disponibles para este paciente.
        </div>

                 {billingEnabled && (
           <div className="space-y-4 pt-4 border-t">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="billingName">Nombre en las facturas</Label>
                 <Input id="billingName" placeholder="Nombre completo para facturación" />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="billingEmail">Email</Label>
                 <Input id="billingEmail" type="email" placeholder="Email para facturación" />
               </div>
             </div>
 
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="billingDocumentType">Tipo de documento</Label>
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
                 <Label htmlFor="billingDocumentNumber">Número de documento</Label>
                 <Input id="billingDocumentNumber" placeholder="Número de documento para facturación" />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="billingStreet">Calle</Label>
                 <Input id="billingStreet" placeholder="Dirección de la calle" />
               </div>
             </div>
 
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="billingNumber">Número, apt, puerta...</Label>
                 <Input id="billingNumber" placeholder="Número, apartamento, puerta, etc." />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="billingCity">Ciudad</Label>
                 <Input id="billingCity" placeholder="Ciudad" />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="billingPostalCode">Código postal</Label>
                 <Input id="billingPostalCode" placeholder="Código postal" />
               </div>
             </div>
           </div>
         )}
      </CardContent>
    </Card>
  )
} 