"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Upload, FileText, Calculator, Brain, CheckCircle } from "lucide-react"
import { Expense } from "./expenses-management"

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void
  onCancel: () => void
}

// Simulación de extracción de datos por IA
const extractDataFromFile = async (file: File): Promise<Partial<Expense>> => {
  // Simular delay de procesamiento
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Datos hardcodeados de la factura de Endesa analizada
  return {
    date: "2024-01-15",
    provider: "Endesa",
    concept: "Factura Luz Enero 2024",
    category: "Suministros",
    totalAmount: 60.50,
    taxType: "21" as const,
    isShared: true,
  }
}

// Cálculo de base imponible y cuota de IVA
const calculateTaxAmounts = (totalAmount: number, taxType: string) => {
  const taxRate = parseFloat(taxType) / 100
  const baseAmount = totalAmount / (1 + taxRate)
  const taxAmount = totalAmount - baseAmount
  
  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100
  }
}

// Cálculo del importe deducible para gastos compartidos
const calculateDeductibleAmount = (totalAmount: number, isShared: boolean) => {
  if (!isShared) return totalAmount
  
  // 20% de la vivienda afecto a la actividad * 30% de deducibilidad
  const homePercentage = 0.20
  const deductiblePercentage = 0.30
  
  return Math.round(totalAmount * homePercentage * deductiblePercentage * 100) / 100
}

export function ExpenseForm({ onSubmit, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState<Partial<Expense>>({
    date: new Date().toISOString().split('T')[0],
    provider: "",
    concept: "",
    category: "",
    totalAmount: 0,
    taxType: "21",
    isShared: false,
  })
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractedData, setExtractedData] = useState<Partial<Expense> | null>(null)

  // Cálculos automáticos
  const { baseAmount, taxAmount } = calculateTaxAmounts(
    formData.totalAmount || 0, 
    formData.taxType || "21"
  )
  
  const deductibleAmount = calculateDeductibleAmount(
    formData.totalAmount || 0,
    formData.isShared || false
  )

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    
    const file = acceptedFiles[0]
    setUploadedFile(file)
    setIsProcessing(true)
    
    try {
      const extracted = await extractDataFromFile(file)
      setExtractedData(extracted)
      
      // Pre-rellenar el formulario con los datos extraídos
      setFormData(prev => ({
        ...prev,
        ...extracted
      }))
    } catch (error) {
      console.error("Error procesando archivo:", error)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.date || !formData.provider || !formData.concept || !formData.category || !formData.totalAmount) {
      alert("Por favor, completa todos los campos obligatorios")
      return
    }

    const expense: Omit<Expense, 'id'> = {
      date: formData.date,
      provider: formData.provider,
      concept: formData.concept,
      category: formData.category,
      totalAmount: formData.totalAmount,
      taxType: formData.taxType as '21' | '10' | '4' | '0',
      baseAmount,
      taxAmount,
      isShared: formData.isShared || false,
      deductibleAmount,
      fileUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : undefined,
    }

    onSubmit(expense)
  }

  const handleInputChange = (field: keyof Expense, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="space-y-6">
      {/* Zona de subida de archivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Asistencia por IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
          >
            <input {...getInputProps()} />
            {isProcessing ? (
              <div className="space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground">Procesando archivo con IA...</p>
              </div>
            ) : uploadedFile ? (
              <div className="space-y-2">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">Archivo procesado correctamente</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="font-medium">
                  {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra y suelta tu factura aquí'}
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, PNG, JPG hasta 10MB
                </p>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setUploadedFile(null)}
              disabled={isProcessing}
            >
              <FileText className="h-4 w-4 mr-2" />
              O rellenar manualmente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda - Vista previa del archivo */}
          {uploadedFile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Vista Previa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Columna derecha - Campos del formulario */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Proveedor *</Label>
                <Input
                  id="provider"
                  placeholder="Ej: Endesa, Taxi Madrid"
                  value={formData.provider}
                  onChange={(e) => handleInputChange("provider", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="concept">Concepto *</Label>
              <Input
                id="concept"
                placeholder="Ej: Factura Luz Enero 2024"
                value={formData.concept}
                onChange={(e) => handleInputChange("concept", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Suministros">Suministros</SelectItem>
                  <SelectItem value="Cuotas">Cuotas</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Transporte">Transporte</SelectItem>
                  <SelectItem value="Material">Material</SelectItem>
                  <SelectItem value="Otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Importe Total (€) *</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.totalAmount || ""}
                  onChange={(e) => handleInputChange("totalAmount", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxType">Tipo IVA *</Label>
                <Select 
                  value={formData.taxType} 
                  onValueChange={(value) => handleInputChange("taxType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="21">21%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="4">4%</SelectItem>
                    <SelectItem value="0">Exento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Base Imponible</Label>
                <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center">
                  <span className="text-sm">{baseAmount.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cuota IVA</Label>
                <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center">
                  <span className="text-sm">{taxAmount.toFixed(2)} €</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Importe Deducible</Label>
                <div className="h-10 px-3 py-2 bg-primary/10 rounded-md flex items-center">
                  <span className="text-sm font-medium text-primary">
                    {deductibleAmount.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Calculator className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="isShared" className="text-sm font-medium">
                    Gasto compartido con mi vivienda
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Marca esta opción para suministros del hogar
                  </p>
                </div>
              </div>
              <Switch
                id="isShared"
                checked={formData.isShared || false}
                onCheckedChange={(checked) => handleInputChange("isShared", checked)}
              />
            </div>

            {formData.isShared && (
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Cálculo de Deducibilidad
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Porcentaje de vivienda afecto a la actividad: <strong>20%</strong><br />
                  Porcentaje de deducibilidad: <strong>30%</strong><br />
                  Importe deducible: <strong>{deductibleAmount.toFixed(2)} €</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Guardar Gasto
          </Button>
        </div>
      </form>
    </div>
  )
} 