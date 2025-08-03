"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BasicInfoSection } from "./form-sections/basic-info-section"
import { MultipleContactsSection } from "./form-sections/multiple-contacts-section"
import { AddressSection } from "./form-sections/address-section"
import { IdentitySection } from "./form-sections/identity-section"

import { BillingSection } from "./form-sections/billing-section"
import { Save, X } from "lucide-react"

export function TabletPatientForm() {
  const [activeSection, setActiveSection] = useState("basic")

           const sections = [
        { id: "basic", label: "Información Básica", component: BasicInfoSection },
        { id: "contact", label: "Contacto", component: MultipleContactsSection },
        { id: "address", label: "Dirección", component: AddressSection },
        { id: "identity", label: "Identidad", component: IdentitySection },
        { id: "billing", label: "Facturación", component: BillingSection },
      ]

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component

  return (
    <div className="max-w-2xl mx-auto space-y-6">
             <div className="text-center">
         <h1 className="text-2xl font-bold tracking-tight">Crear Paciente</h1>
         <p className="text-muted-foreground">
           Añadir un nuevo paciente al sistema
         </p>
       </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {ActiveComponent && <ActiveComponent />}
      </div>

      <div className="flex items-center justify-center gap-2 pt-4 border-t">
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
  )
} 