"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ConsentsListSection } from "./form-sections/consents-list-section"
import { ConsentsEditorSection } from "./form-sections/consents-editor-section"
import { ConsentsTemplatesSection } from "./form-sections/consents-templates-section"


export function MobileConsentsForm() {
  const [activeSection, setActiveSection] = useState("list")

  const sections = [
    { id: "list", label: "Lista de Cláusulas", component: ConsentsListSection },
    { id: "editor", label: "Editor", component: ConsentsEditorSection },
    { id: "templates", label: "Plantillas", component: ConsentsTemplatesSection },
  ]

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component

  return (
    <div className="space-y-4">
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

      <div className="space-y-4">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
} 