"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Service } from "./tariffs-management"

interface ServiceFormProps {
  service?: Service | null
  onSave: (service: Omit<Service, 'id'>) => void
  onCancel: () => void
}

export function ServiceForm({ service, onSave, onCancel }: ServiceFormProps) {
  const [name, setName] = useState(service?.name || "")
  const [finalPrice, setFinalPrice] = useState(service?.finalPrice || 0)
  const [taxType, setTaxType] = useState<'exempt' | 'general'>(service?.taxType || 'exempt')
  const [isDefault, setIsDefault] = useState(service?.isDefault || false)
  
  // Valores calculados automáticamente
  const [basePrice, setBasePrice] = useState(service?.basePrice || 0)
  const [taxAmount, setTaxAmount] = useState(service?.taxAmount || 0)

  // Recalcular valores cada vez que cambie el precio final o tipo de impuesto
  useEffect(() => {
    if (taxType === 'exempt') {
      setBasePrice(finalPrice)
      setTaxAmount(0)
    } else {
      // IVA General (21%)
      const calculatedBase = finalPrice / 1.21
      const calculatedTax = finalPrice - calculatedBase
      setBasePrice(Math.round(calculatedBase * 100) / 100)
      setTaxAmount(Math.round(calculatedTax * 100) / 100)
    }
  }, [finalPrice, taxType])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || finalPrice <= 0) {
      return
    }

    onSave({
      name: name.trim(),
      finalPrice,
      taxType,
      basePrice,
      taxAmount,
      isDefault,
    })
  }

  const formatCurrency = (amount: number) => {
    if (Number.isInteger(amount)) {
      return `${amount} €`
    }
    return `${amount.toFixed(2).replace('.', ',')} €`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Servicio</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Sesión de Terapia Individual"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="finalPrice">Precio Final (PVP)</Label>
        <div className="relative">
                     <Input
             id="finalPrice"
             type="number"
             step="1"
             min="0"
             value={finalPrice}
             onChange={(e) => setFinalPrice(parseFloat(e.target.value) || 0)}
             placeholder="0"
             className="pr-8"
             required
           />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            €
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="taxType">Tipo de Impuesto</Label>
        <Select value={taxType} onValueChange={(value: 'exempt' | 'general') => setTaxType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="exempt">
              Exento de IVA (Terapia sanitaria)
            </SelectItem>
            <SelectItem value="general">
              IVA General (21%) (Formación, informes, etc.)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desglose automático */}
      <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
        <div className="text-sm font-medium text-muted-foreground">
          Desglose Automático
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Base Imponible:</span>
            <span className="font-medium">{formatCurrency(basePrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Cuantía de IVA:</span>
            <span className="font-medium">{formatCurrency(taxAmount)}</span>
          </div>
          <div className="border-t pt-1 flex justify-between font-semibold">
            <span>Total:</span>
            <span>{formatCurrency(finalPrice)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isDefault"
          checked={isDefault}
          onCheckedChange={setIsDefault}
        />
        <Label htmlFor="isDefault">Servicio por Defecto</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {service ? "Actualizar" : "Crear"} Servicio
        </Button>
      </div>
    </form>
  )
} 