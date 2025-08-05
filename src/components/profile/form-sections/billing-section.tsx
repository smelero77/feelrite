"use client"

import React from "react"
import { UseFormRegister, UseFormControl, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Building2, CreditCard } from "lucide-react"
import { ProfileFormData } from "@/lib/validators/profile-validator"

interface BillingSectionProps {
  className?: string
  register: UseFormRegister<ProfileFormData>
  control: UseFormControl<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  watch: UseFormWatch<ProfileFormData>
  setValue: UseFormSetValue<ProfileFormData>
}

export function BillingSection({ 
  className, 
  register, 
  control, 
  errors, 
  watch, 
  setValue 
}: BillingSectionProps) {
  return (
    <Card className={`${className} bg-background/50 border-border/50`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Datos de Facturación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullAddress">Dirección Fiscal Completa *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="fullAddress" 
              placeholder="Calle, número, piso, etc." 
              className="pl-10"
              {...register("fullAddress")}
            />
          </div>
          {errors.fullAddress && (
            <p className="text-sm text-destructive mt-1">{errors.fullAddress.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">Código Postal *</Label>
            <Input 
              id="postalCode" 
              placeholder="28001" 
              {...register("postalCode")}
            />
            {errors.postalCode && (
              <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad *</Label>
            <Input 
              id="city" 
              placeholder="Madrid" 
              {...register("city")}
            />
            {errors.city && (
              <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="province">Provincia *</Label>
            <Input 
              id="province" 
              placeholder="Madrid" 
              {...register("province")}
            />
            {errors.province && (
              <p className="text-sm text-destructive mt-1">{errors.province.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">País *</Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un país" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="España">España</SelectItem>
                    <SelectItem value="Portugal">Portugal</SelectItem>
                    <SelectItem value="Francia">Francia</SelectItem>
                    <SelectItem value="Alemania">Alemania</SelectItem>
                    <SelectItem value="Italia">Italia</SelectItem>
                    <SelectItem value="Reino Unido">Reino Unido</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.country && (
              <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="iban">IBAN para Pagos</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="iban" 
              placeholder="ES91 2100 0418 4502 0005 1332" 
              className="pl-10"
              {...register("iban")}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Formato: ES91 2100 0418 4502 0005 1332
          </p>
          {errors.iban && (
            <p className="text-sm text-destructive mt-1">{errors.iban.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 