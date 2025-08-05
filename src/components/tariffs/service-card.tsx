import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
import { Service } from "./tariffs-management"

interface ServiceCardProps {
  service: Service
  onEdit: () => void
  onDelete: () => void
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  const formatCurrency = (amount: number) => {
    if (Number.isInteger(amount)) {
      return `${amount} €`
    }
    return `${amount.toFixed(2).replace('.', ',')} €`
  }

  const getTaxTypeLabel = (taxType: 'exempt' | 'general') => {
    return taxType === 'exempt' ? 'Exento' : 'IVA 21%'
  }

  return (
    <Card className="relative">
             {service.isDefault && (
         <div className="absolute -top-2 -right-2">
           <Badge className="text-xs bg-primary text-primary-foreground">
             Por Defecto
           </Badge>
         </div>
       )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground line-clamp-2">
              {service.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {getTaxTypeLabel(service.taxType)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-2 min-h-[120px] flex flex-col">
          <div className="text-center flex-1 flex flex-col justify-center">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(service.finalPrice)}
            </div>
            <div className="text-xs text-muted-foreground">
              Precio Final (PVP)
            </div>
          </div>

          {service.taxType === 'general' && (
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <div className="flex justify-between">
                <span>Base:</span>
                <span>{formatCurrency(service.basePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA:</span>
                <span>{formatCurrency(service.taxAmount)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 