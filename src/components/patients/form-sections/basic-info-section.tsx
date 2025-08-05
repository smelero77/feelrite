"use client"

import React from "react"
import { UseFormRegister, UseFormControl, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar, User, Baby } from "lucide-react"
import { PatientFormData } from "@/lib/validators/patient-validator"

interface BasicInfoSectionProps {
  className?: string
  register: UseFormRegister<PatientFormData>
  control: UseFormControl<PatientFormData>
  errors: FieldErrors<PatientFormData>
  watch: UseFormWatch<PatientFormData>
  setValue: UseFormSetValue<PatientFormData>
}

export function BasicInfoSection({ 
  className, 
  register, 
  control, 
  errors, 
  watch, 
  setValue 
}: BasicInfoSectionProps) {
  const isMinor = watch("isMinor")

  return (
    <Card className={`${className} bg-background/50 border-border/50`}>
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
            <Input 
              id="firstName" 
              placeholder="Ingresa el nombre" 
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos</Label>
            <Input 
              id="lastName" 
              placeholder="Ingresa los apellidos" 
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
            )}
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
                {...register("birthDate")}
              />
            </div>
            {errors.birthDate && (
              <p className="text-sm text-destructive mt-1">{errors.birthDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Sexo</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Femenino</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <Label htmlFor="notes">Notas</Label>
            <Input 
              id="notes" 
              placeholder="Notas adicionales" 
              {...register("notes")}
            />
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
          <Controller
            name="isMinor"
            control={control}
            render={({ field }) => (
              <Switch
                id="isMinor"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
} 