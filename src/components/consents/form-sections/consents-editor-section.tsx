"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { TextFormatToolbar } from "./text-format-toolbar"
import { TextFormatToolbarMobile } from "./text-format-toolbar-mobile"
import { RichTextEditor, RichTextEditorRef } from "./rich-text-editor"
import { useScreenSize } from "@/hooks/use-screen-size"
import { 
  Save, 
  X, 
  Edit, 
  Eye,
  EyeOff
} from "lucide-react"

interface ConsentClause {
  id: string
  title: string
  content: string
  isActive: boolean
  isRequired: boolean
  order: number
}

interface TextFormat {
  bold: boolean
  italic: boolean
  underline: boolean
  list: boolean
  listOrdered: boolean
  align: 'left' | 'center' | 'right'
}

interface ConsentsEditorSectionProps {
  className?: string
}

export function ConsentsEditorSection({ className }: ConsentsEditorSectionProps) {
  const screenSize = useScreenSize()
  const editorRef = useRef<RichTextEditorRef>(null)
  
  const [editingClause, setEditingClause] = useState<ConsentClause | null>({
    id: "",
    title: "",
    content: "",
    isActive: true,
    isRequired: false,
    order: 1
  })

  const [previewMode, setPreviewMode] = useState(false)
  const [textFormat, setTextFormat] = useState<TextFormat>({
    bold: false,
    italic: false,
    underline: false,
    list: false,
    listOrdered: false,
    align: 'left'
  })

  const handleSave = () => {
    // Aquí se guardaría la cláusula
    console.log('Guardando cláusula:', editingClause)
    setEditingClause(null)
  }

  const handleCancel = () => {
    setEditingClause(null)
  }

  const updateClause = (field: keyof ConsentClause, value: string | boolean) => {
    if (editingClause) {
      setEditingClause({ ...editingClause, [field]: value })
    }
  }

  // Función para aplicar formato desde las toolbars
  const handleApplyFormat = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.applyFormat(command, value)
    }
  }

  return (
    <div className="space-y-6">
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editor de Cláusulas
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {previewMode ? "Ocultar Vista" : "Vista Previa"}
              </Button>
            </div>
          </div>

        </CardHeader>
        <CardContent className="space-y-6">
          {!previewMode ? (
            // Modo de edición
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título de la Cláusula</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Cláusula General"
                    value={editingClause?.title || ""}
                    onChange={(e) => updateClause('title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Contenido de la Cláusula</Label>
                  
                  {/* Barra de herramientas de formato */}
                  {screenSize === 'mobile' || screenSize === 'tablet' ? (
                    <TextFormatToolbarMobile
                      format={textFormat}
                      onFormatChange={setTextFormat}
                      onApplyFormat={handleApplyFormat}
                    />
                  ) : (
                    <TextFormatToolbar
                      format={textFormat}
                      onFormatChange={setTextFormat}
                      onApplyFormat={handleApplyFormat}
                    />
                  )}
                  
                  {/* Editor de texto enriquecido */}
                  <RichTextEditor
                    ref={editorRef}
                    value={editingClause?.content || ""}
                    onChange={(value) => updateClause('content', value)}
                    format={textFormat}
                    onFormatChange={setTextFormat}
                    placeholder="Escribe aquí el contenido completo de la cláusula..."
                    rows={8}
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={editingClause?.isActive || false}
                      onCheckedChange={(checked) => updateClause('isActive', checked)}
                    />
                    <Label htmlFor="isActive" className="text-sm">
                      Cláusula Activa
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRequired"
                      checked={editingClause?.isRequired || false}
                      onCheckedChange={(checked) => updateClause('isRequired', checked)}
                    />
                    <Label htmlFor="isRequired" className="text-sm">
                      Cláusula Obligatoria
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cláusula
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </>
          ) : (
            // Modo de vista previa
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-medium">{editingClause?.title || "Título de la Cláusula"}</h3>
                  {editingClause?.isRequired && (
                    <Badge variant="destructive" className="text-xs">Obligatorio</Badge>
                  )}
                  {!editingClause?.isActive && (
                    <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox id="preview-checkbox" />
                    <div 
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: editingClause?.content || "Contenido de la cláusula aparecerá aquí..." }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p>• Esta es la vista previa de cómo se verá la cláusula para el paciente</p>
                <p>• El checkbox aparecerá automáticamente</p>
                <p>• Las cláusulas obligatorias no se pueden desmarcar</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 