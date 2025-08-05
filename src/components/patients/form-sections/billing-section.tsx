"use client"

import { UseFormRegister, UseFormControl, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Receipt } from "lucide-react"
import { PatientFormData } from "@/lib/validators/patient-validator"

interface BillingSectionProps {
  className?: string
  register: UseFormRegister<PatientFormData>
  control: UseFormControl<PatientFormData>
  errors: FieldErrors<PatientFormData>
  watch: UseFormWatch<PatientFormData>
  setValue: UseFormSetValue<PatientFormData>
}

export function BillingSection({ 
  className, 
  register, 
  control, 
  errors, 
  watch, 
  setValue 
}: BillingSectionProps) {
  const billingEnabled = watch("billingEnabled")

  return (
    <Card className={`${className} bg-background/50 border-border/50`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Información de Facturación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Controller
            name="billingEnabled"
            control={control}
            render={({ field }) => (
              <Checkbox 
                id="billing" 
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
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
                <Input 
                  id="billingName" 
                  placeholder="Nombre completo para facturación" 
                  {...register("billingName")}
                />
                {errors.billingName && (
                  <p className="text-sm text-destructive mt-1">{errors.billingName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingEmail">Email</Label>
                <Input 
                  id="billingEmail" 
                  type="email" 
                  placeholder="Email para facturación" 
                  {...register("billingEmail")}
                />
                {errors.billingEmail && (
                  <p className="text-sm text-destructive mt-1">{errors.billingEmail.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingDocumentType">Tipo de documento</Label>
                <Controller
                  name="billingDocumentType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingDocumentNumber">Número de documento</Label>
                <Input 
                  id="billingDocumentNumber" 
                  placeholder="Número de documento para facturación" 
                  {...register("billingDocumentNumber")}
                />
                {errors.billingDocumentNumber && (
                  <p className="text-sm text-destructive mt-1">{errors.billingDocumentNumber.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingStreet">Calle</Label>
                <Input 
                  id="billingStreet" 
                  placeholder="Dirección de la calle" 
                  {...register("billingStreet")}
                />
                {errors.billingStreet && (
                  <p className="text-sm text-destructive mt-1">{errors.billingStreet.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingNumber">Número, apt, puerta...</Label>
                <Input 
                  id="billingNumber" 
                  placeholder="Número, apartamento, puerta, etc." 
                  {...register("billingNumber")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingCity">Ciudad</Label>
                <Input 
                  id="billingCity" 
                  placeholder="Ciudad" 
                  {...register("billingCity")}
                />
                {errors.billingCity && (
                  <p className="text-sm text-destructive mt-1">{errors.billingCity.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingPostalCode">Código postal</Label>
                <Input 
                  id="billingPostalCode" 
                  placeholder="Código postal" 
                  {...register("billingPostalCode")}
                />
                {errors.billingPostalCode && (
                  <p className="text-sm text-destructive mt-1">{errors.billingPostalCode.message}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 