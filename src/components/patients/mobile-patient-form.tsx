"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BasicInfoSection } from "./form-sections/basic-info-section"
import { MultipleContactsSection } from "./form-sections/multiple-contacts-section"
import { AddressSection } from "./form-sections/address-section"
import { IdentitySection } from "./form-sections/identity-section"

import { BillingSection } from "./form-sections/billing-section"
import { MobileNav } from "./mobile-nav"
import { Save, X } from "lucide-react"

export function MobilePatientForm() {
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
    <div className="min-h-screen bg-background">
             <MobileNav 
         title="Crear Paciente" 
         onSave={() => console.log('Save patient')}
       />
      
      <div className="p-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className="whitespace-nowrap"
            >
              {section.label}
            </Button>
          ))}
        </div>

        <div className="space-y-4 pb-20">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 pb-safe">
        <div className="flex items-center gap-2">
                     <Button variant="outline" className="flex-1">
             <X className="h-4 w-4 mr-2" />
             Cancelar
           </Button>
           <Button className="flex-1">
             <Save className="h-4 w-4 mr-2" />
             Guardar Cambios
           </Button>
        </div>
      </div>
    </div>
  )
} 