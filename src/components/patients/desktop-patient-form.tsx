"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BasicInfoSection } from "./form-sections/basic-info-section"
import { MultipleContactsSection } from "./form-sections/multiple-contacts-section"
import { AddressSection } from "./form-sections/address-section"
import { IdentitySection } from "./form-sections/identity-section"

import { BillingSection } from "./form-sections/billing-section"
import { Save, X } from "lucide-react"

export function DesktopPatientForm() {
  const [activeTab, setActiveTab] = useState("basic")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
                 <div>
           <h1 className="text-3xl font-bold tracking-tight">Crear Paciente</h1>
           <p className="text-muted-foreground">
             Añadir un nuevo paciente al sistema
           </p>
         </div>
        <div className="flex items-center gap-2">
                     <Button variant="outline">
             <X className="h-4 w-4 mr-2" />
             Cancelar
           </Button>
           <Button>
             <Save className="h-4 w-4 mr-2" />
             Guardar Cambios
           </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                         <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="contact">Contacto</TabsTrigger>
          <TabsTrigger value="address">Dirección</TabsTrigger>
          <TabsTrigger value="identity">Identidad</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BasicInfoSection />
            <BillingSection />
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <MultipleContactsSection />
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          <AddressSection />
        </TabsContent>

        <TabsContent value="identity" className="space-y-4">
          <IdentitySection />
        </TabsContent>


      </Tabs>
    </div>
  )
} 