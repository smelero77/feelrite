"use client"

import React from "react"
import { UseFormRegister, UseFormControl, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, CreditCard } from "lucide-react"
import { ProfileFormData } from "@/lib/validators/profile-validator"

interface IdentificationSectionProps {
  className?: string
  register: UseFormRegister<ProfileFormData>
  control: UseFormControl<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  watch: UseFormWatch<ProfileFormData>
  setValue: UseFormSetValue<ProfileFormData>
}

export function IdentificationSection({ 
  className, 
  register, 
  control, 
  errors, 
  watch, 
  setValue 
}: IdentificationSectionProps) {
  return (
    <Card className={`${className} bg-background/50 border-border/50`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Datos de Identificación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre Completo *</Label>
            <Input 
              id="fullName" 
              placeholder="Nombre y apellidos" 
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nif">NIF / CIF *</Label>
            <Input 
              id="nif" 
              placeholder="12345678A" 
              {...register("nif")}
            />
            {errors.nif && (
              <p className="text-sm text-destructive mt-1">{errors.nif.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="professionalLicense">Número de Colegiada *</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="professionalLicense" 
                placeholder="N.º de colegiación" 
                className="pl-10"
                {...register("professionalLicense")}
              />
            </div>
            {errors.professionalLicense && (
              <p className="text-sm text-destructive mt-1">{errors.professionalLicense.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Profesional *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                type="email"
                placeholder="tu@email.com" 
                className="pl-10"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono Profesional</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="phone" 
              type="tel"
              placeholder="+34 600 000 000" 
              className="pl-10"
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 