"use client"

import React from "react"
import { UseFormRegister, UseFormControl, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, Image, FileText, Palette } from "lucide-react"
import { ProfileFormData } from "@/lib/validators/profile-validator"

interface BrandingSectionProps {
  className?: string
  register: UseFormRegister<ProfileFormData>
  control: UseFormControl<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  watch: UseFormWatch<ProfileFormData>
  setValue: UseFormSetValue<ProfileFormData>
}

export function BrandingSection({ 
  className, 
  register, 
  control, 
  errors, 
  watch, 
  setValue 
}: BrandingSectionProps) {
  const logoUrl = watch("logoUrl")
  const signatureImageUrl = watch("signatureImageUrl")

  const handleFileUpload = (field: "logoUrl" | "signatureImageUrl", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // TODO: Implementar subida real de archivos
      const fakeUrl = URL.createObjectURL(file)
      setValue(field, fakeUrl)
    }
  }

  return (
    <Card className={`${className} bg-background/50 border-border/50`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Personalización
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Logotipo Profesional</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload("logoUrl", e)}
                  className="hidden"
                  {...register("logoUrl")}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("logo")?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Logo
                </Button>
              </div>
              {logoUrl && (
                <div className="w-16 h-16 border rounded-lg overflow-hidden">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Tu logo aparecerá en las facturas y documentos profesionales.
            </p>
            {errors.logoUrl && (
              <p className="text-sm text-destructive mt-1">{errors.logoUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="signature">Firma Digitalizada</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="signature"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload("signatureImageUrl", e)}
                  className="hidden"
                  {...register("signatureImageUrl")}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("signature")?.click()}
                  className="w-full"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Subir Firma
                </Button>
              </div>
              {signatureImageUrl && (
                <div className="w-16 h-16 border rounded-lg overflow-hidden">
                  <img
                    src={signatureImageUrl}
                    alt="Firma"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Tu firma aparecerá en los consentimientos informados y documentos legales.
            </p>
            {errors.signatureImageUrl && (
              <p className="text-sm text-destructive mt-1">{errors.signatureImageUrl.message}</p>
            )}
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Contexto para la IA</h4>
          <p className="text-sm text-muted-foreground">
            Tu logo aparecerá en las facturas y tu firma en los consentimientos. 
            Esta información se utilizará para automatizar la generación de documentos 
            y asegurar la consistencia profesional en toda tu práctica.
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 