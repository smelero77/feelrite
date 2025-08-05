"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Service } from "./tariffs-management"

interface SelectDefaultServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  services: Service[]
  onSelectDefault: (serviceId: string) => void
  onCancel: () => void
}

export function SelectDefaultServiceDialog({
  open,
  onOpenChange,
  services,
  onSelectDefault,
  onCancel,
}: SelectDefaultServiceDialogProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>("")

  const handleConfirm = () => {
    if (selectedServiceId) {
      onSelectDefault(selectedServiceId)
      setSelectedServiceId("")
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    setSelectedServiceId("")
    onCancel()
    onOpenChange(false)
  }



  const formatCurrency = (amount: number) => {
    if (Number.isInteger(amount)) {
      return `${amount} €`
    }
    return `${amount.toFixed(2).replace('.', ',')} €`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Seleccionar Nuevo Servicio por Defecto</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Debes seleccionar un servicio como nuevo por defecto antes de continuar.
          </p>
          
                     <div className="space-y-2 max-h-60 overflow-y-auto">
             {services.map((service, index) => (
               <Card
                 key={service.id}
                 className={`cursor-pointer transition-colors ${
                   selectedServiceId === service.id
                     ? "ring-2 ring-primary border-primary"
                     : "hover:bg-muted/50"
                 }`}
                 onClick={() => setSelectedServiceId(service.id)}
                 tabIndex={0}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' || e.key === ' ') {
                     e.preventDefault()
                     setSelectedServiceId(service.id)
                   }
                 }}
               >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">
                      {service.name}
                    </h4>
                    <div className="text-lg font-bold text-foreground">
                      {formatCurrency(service.finalPrice)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    {service.taxType === 'exempt' ? 'Exento de IVA' : 'IVA 21%'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
                     <div className="flex justify-end pt-4">
             <Button
               type="button"
               onClick={handleConfirm}
               disabled={!selectedServiceId}
             >
               Confirmar
             </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 