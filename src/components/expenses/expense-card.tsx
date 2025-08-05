"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ExpenseForm } from "./expense-form"
import { 
  Calendar, 
  Building2, 
  FileText, 
  Edit, 
  Trash2, 
  Receipt,
  Calculator
} from "lucide-react"
import { Expense } from "./expenses-management"

interface ExpenseCardProps {
  expense: Expense
  onDelete: (id: string) => void
  onEdit: (id: string, expense: Expense) => void
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Suministros":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "Transporte":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "Software":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    case "Cuotas":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    case "Material":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function ExpenseCard({ expense, onDelete, onEdit }: ExpenseCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (updatedExpense: Omit<Expense, 'id'>) => {
    onEdit(expense.id, { ...updatedExpense, id: expense.id })
    setIsEditDialogOpen(false)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <h3 className="font-medium text-sm truncate">
                {expense.provider}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {expense.concept}
              </p>
            </div>
          </div>
          {expense.fileUrl && (
            <FileText className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Información principal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fecha:</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(expense.date)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Categoría:</span>
            <Badge className={`text-xs ${getCategoryColor(expense.category)}`}>
              {expense.category}
            </Badge>
          </div>
        </div>

        {/* Importes */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="text-sm font-medium">
              {expense.totalAmount.toFixed(2)} €
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calculator className="h-3 w-3" />
              Deducible:
            </span>
            <span className="text-sm font-bold text-primary">
              {expense.deductibleAmount.toFixed(2)} €
            </span>
          </div>
        </div>

        {/* Indicador de gasto compartido */}
        {expense.isShared && (
          <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded text-xs text-blue-700 dark:text-blue-300">
            <div className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              Gasto compartido con vivienda
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="h-3 w-3 mr-1" />
                Editar
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Editar Gasto
                </DialogTitle>
              </DialogHeader>
              <ExpenseForm 
                onSubmit={handleEdit}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(expense.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 