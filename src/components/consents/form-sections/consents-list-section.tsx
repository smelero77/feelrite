"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Copy,
  MoreHorizontal
} from "lucide-react"

interface ConsentClause {
  id: string
  title: string
  content: string
  isActive: boolean
  isRequired: boolean
  order: number
}

interface ConsentsListSectionProps {
  className?: string
}

export function ConsentsListSection({ className }: ConsentsListSectionProps) {
  const [clauses, setClauses] = useState<ConsentClause[]>([
    {
      id: "1",
      title: "Cláusula General",
      content: "Acepto haber recibido toda la información necesaria, de forma confidencial, clara, comprensible y satisfactoria sobre la naturaleza y propósito de los objetivos, procedimientos, temporalidad y honorarios que se seguirán a lo largo del proceso que se deriva de la demanda que al mismo he formulado, una vez efectuada la inicial valoración profesional que al mismo/a corresponde, aplicándose al efecto la obligación de confidencialidad y el resto de los preceptos que rigen en el Código Deontológico y normas de deontología profesional de la Psicología. Así mismo quedo informado de que el presente consentimiento PODRÁ SER REVOCADO LIBREMENTE, en cualquier momento, tanto por el paciente como por el profesional, de acuerdo con lo establecido en la legislación aplicable.",
      isActive: true,
      isRequired: true,
      order: 1
    },
    {
      id: "2",
      title: "Protección de Datos",
      content: "Igualmente, he sido informado/a de que en cumplimiento del Reglamento General de Protección de Datos y la Ley Orgánica 3/2018, de 5 Diciembre de PDGDD, los datos personales que facilita se recogerán en el fichero de pacientes. Los datos se recogerán con la única finalidad de elaborar los documentos derivados de esta intervención profesional, su facturación, seguimiento posterior y las funciones propias de la actividad profesional que los justifica.",
      isActive: true,
      isRequired: true,
      order: 2
    },
    {
      id: "3",
      title: "Sesiones No Presenciales",
      content: "Acepto realizar sesiones no presenciales.",
      isActive: true,
      isRequired: false,
      order: 3
    },
    {
      id: "4",
      title: "Grabación de Sesiones",
      content: "Acepto que el profesional grave una sesión mediante medios audiovisuales para la supervisión profesional del caso.",
      isActive: false,
      isRequired: false,
      order: 4
    }
  ])

  const addClause = () => {
    const newClause: ConsentClause = {
      id: Date.now().toString(),
      title: "Nueva Cláusula",
      content: "",
      isActive: true,
      isRequired: false,
      order: clauses.length + 1
    }
    setClauses([...clauses, newClause])
  }

  const toggleClauseStatus = (id: string) => {
    setClauses(clauses.map(clause => 
      clause.id === id ? { ...clause, isActive: !clause.isActive } : clause
    ))
  }

  const toggleRequired = (id: string) => {
    setClauses(clauses.map(clause => 
      clause.id === id ? { ...clause, isRequired: !clause.isRequired } : clause
    ))
  }

  const removeClause = (id: string) => {
    setClauses(clauses.filter(clause => clause.id !== id))
  }

  const copyClause = (clause: ConsentClause) => {
    const newClause: ConsentClause = {
      ...clause,
      id: Date.now().toString(),
      title: `${clause.title} (Copia)`,
      order: clauses.length + 1
    }
    setClauses([...clauses, newClause])
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Cláusulas de Consentimiento
          </CardTitle>
          <Button onClick={addClause} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Añadir Cláusula
          </Button>
        </div>

      </CardHeader>
      <CardContent className="space-y-4">
        {clauses.map((clause) => (
          <div key={clause.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">{clause.title}</h3>
                  {clause.isRequired && (
                    <Badge variant="destructive" className="text-xs">Obligatorio</Badge>
                  )}
                  {!clause.isActive && (
                    <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {clause.content}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyClause(clause)}
                  title="Copiar cláusula"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  title="Editar cláusula"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeClause(clause.id)}
                  className="text-destructive hover:text-destructive"
                  title="Eliminar cláusula"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-2 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`active-${clause.id}`}
                  checked={clause.isActive}
                  onCheckedChange={() => toggleClauseStatus(clause.id)}
                />
                <label htmlFor={`active-${clause.id}`} className="text-sm">
                  Activa
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${clause.id}`}
                  checked={clause.isRequired}
                  onCheckedChange={() => toggleRequired(clause.id)}
                />
                <label htmlFor={`required-${clause.id}`} className="text-sm">
                  Obligatoria
                </label>
              </div>
            </div>
          </div>
        ))}

        {clauses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay cláusulas definidas</p>
            <p className="text-sm">Añade tu primera cláusula de consentimiento</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 