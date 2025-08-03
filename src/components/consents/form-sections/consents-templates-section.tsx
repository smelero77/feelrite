"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Download, 
  Plus, 
  Copy,
  Eye
} from "lucide-react"

interface ConsentTemplate {
  id: string
  title: string
  description: string
  content: string
  category: string
  isRequired: boolean
  tags: string[]
}

interface ConsentsTemplatesSectionProps {
  className?: string
}

export function ConsentsTemplatesSection({ className }: ConsentsTemplatesSectionProps) {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])

  const templates: ConsentTemplate[] = [
    {
      id: "1",
      title: "Cláusula General",
      description: "Cláusula básica para psicología",
      content: "Acepto haber recibido toda la información necesaria, de forma confidencial, clara, comprensible y satisfactoria sobre la naturaleza y propósito de los objetivos, procedimientos, temporalidad y honorarios que se seguirán a lo largo del proceso que se deriva de la demanda que al mismo he formulado, una vez efectuada la inicial valoración profesional que al mismo/a corresponde, aplicándose al efecto la obligación de confidencialidad y el resto de los preceptos que rigen en el Código Deontológico y normas de deontología profesional de la Psicología. Así mismo quedo informado de que el presente consentimiento PODRÁ SER REVOCADO LIBREMENTE, en cualquier momento, tanto por el paciente como por el profesional, de acuerdo con lo establecido en la legislación aplicable.",
      category: "General",
      isRequired: true,
      tags: ["básico", "obligatorio", "psicología"]
    },
    {
      id: "2",
      title: "Protección de Datos (GDPR)",
      description: "Cláusula de protección de datos según GDPR y LOPDGDD",
      content: "Igualmente, he sido informado/a de que en cumplimiento del Reglamento General de Protección de Datos y la Ley Orgánica 3/2018, de 5 Diciembre de PDGDD, los datos personales que facilita se recogerán en el fichero de pacientes. Los datos se recogerán con la única finalidad de elaborar los documentos derivados de esta intervención profesional, su facturación, seguimiento posterior y las funciones propias de la actividad profesional que los justifica.",
      category: "Legal",
      isRequired: true,
      tags: ["GDPR", "datos", "legal", "obligatorio"]
    },
    {
      id: "3",
      title: "Sesiones No Presenciales",
      description: "Consentimiento para terapia online o videollamadas",
      content: "Acepto realizar sesiones no presenciales.",
      category: "Terapia",
      isRequired: false,
      tags: ["online", "videollamada", "terapia"]
    },
    {
      id: "4",
      title: "Grabación de Sesiones",
      description: "Consentimiento para grabar sesiones con fines de supervisión",
      content: "Acepto que el profesional grave una sesión mediante medios audiovisuales para la supervisión profesional del caso.",
      category: "Supervisión",
      isRequired: false,
      tags: ["grabación", "supervisión", "audiovisual"]
    },
    {
      id: "5",
      title: "Confidencialidad y Límites",
      description: "Explicación de los límites de confidencialidad",
      content: "Entiendo que la información compartida en las sesiones es confidencial, excepto en los casos donde existe riesgo para mi seguridad o la de otros, o cuando la ley lo requiera. El psicólogo está obligado a romper la confidencialidad en situaciones de riesgo de daño a mí mismo o a otros.",
      category: "Ética",
      isRequired: true,
      tags: ["confidencialidad", "ética", "obligatorio"]
    },
    {
      id: "6",
      title: "Consentimiento para Menores",
      description: "Cláusula específica para tratamiento de menores de edad",
      content: "Como padre/madre/tutor legal, doy mi consentimiento para que mi hijo/a reciba tratamiento psicológico. Entiendo que el psicólogo mantendrá la confidencialidad apropiada para la edad del menor, pero me informará de situaciones que requieran mi conocimiento o intervención.",
      category: "Menores",
      isRequired: false,
      tags: ["menores", "padres", "tutores"]
    }
  ]

  const toggleTemplateSelection = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    )
  }

  const importSelectedTemplates = () => {
    const selected = templates.filter(t => selectedTemplates.includes(t.id))
    console.log('Importando plantillas:', selected)
    setSelectedTemplates([])
  }

  const importAllTemplates = () => {
    console.log('Importando todas las plantillas:', templates)
  }

  const categories = [...new Set(templates.map(t => t.category))]

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Plantillas de Cláusulas
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={importAllTemplates}
            >
              <Download className="h-4 w-4 mr-2" />
              Importar Todas
            </Button>
            <Button
              size="sm"
              onClick={importSelectedTemplates}
              disabled={selectedTemplates.length === 0}
            >
              <Copy className="h-4 w-4 mr-2" />
              Importar Seleccionadas ({selectedTemplates.length})
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Plantillas predefinidas que puedes usar como base para tus cláusulas
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map(category => (
          <div key={category} className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {category}
            </h3>
            <div className="grid gap-3">
              {templates
                .filter(template => template.category === category)
                .map(template => (
                  <div key={template.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{template.title}</h4>
                          {template.isRequired && (
                            <Badge variant="destructive" className="text-xs">Obligatorio</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Checkbox
                          id={`template-${template.id}`}
                          checked={selectedTemplates.includes(template.id)}
                          onCheckedChange={() => toggleTemplateSelection(template.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Vista previa"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {template.content}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {templates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay plantillas disponibles</p>
            <p className="text-sm">Las plantillas aparecerán aquí cuando estén disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 