"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConsentsListSection } from "./form-sections/consents-list-section"
import { ConsentsEditorSection } from "./form-sections/consents-editor-section"
import { ConsentsTemplatesSection } from "./form-sections/consents-templates-section"


export function DesktopConsentsForm() {
  const [activeTab, setActiveTab] = useState("list")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Lista de Cláusulas</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <ConsentsListSection />
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          <ConsentsEditorSection />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <ConsentsTemplatesSection />
        </TabsContent>
      </Tabs>
    </div>
  )
} 