"use client"

import { UseFormRegister, UseFormControl, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"
import { PatientFormData } from "@/lib/validators/patient-validator"

interface AddressSectionProps {
  className?: string
  register: UseFormRegister<PatientFormData>
  control: UseFormControl<PatientFormData>
  errors: FieldErrors<PatientFormData>
  watch: UseFormWatch<PatientFormData>
  setValue: UseFormSetValue<PatientFormData>
}

export function AddressSection({ 
  className, 
  register, 
  control, 
  errors, 
  watch, 
  setValue 
}: AddressSectionProps) {
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
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado/Provincia</Label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input 
              id="city" 
              placeholder="Ingresa la ciudad" 
              {...register("city")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">Código Postal</Label>
            <Input 
              id="postalCode" 
              placeholder="Ingresa el código postal" 
              {...register("postalCode")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">Número, apt, puerta...</Label>
            <Input 
              id="number" 
              placeholder="Número, apartamento, puerta, etc." 
              {...register("number")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="street">Dirección</Label>
          <Input 
            id="street" 
            placeholder="Ingresa la dirección de la calle" 
            {...register("street")}
          />
        </div>
      </CardContent>
    </Card>
  )
} 