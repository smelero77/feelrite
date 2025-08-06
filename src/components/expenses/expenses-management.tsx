"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Receipt, Euro, Calculator, FileText } from "lucide-react"
import { ExpenseForm } from "./expense-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { KpiCard } from "./kpi-card"
import { ExpensesFilters } from "./expenses-filters"
import { ExpensesChart } from "./expenses-chart"
import { ExpenseTable } from "./expense-table"
import { isWithinInterval, parseISO } from "date-fns"
import type { DateRange } from "react-day-picker"

export type Expense = {
  id: string
  date: string          // Fecha del gasto
  provider: string      // Ej: "Endesa", "Taxi"
  concept: string       // Ej: "Factura Luz Junio", "Carrera a supervisión"
  category: string      // Ej: "Suministros", "Transporte"
  totalAmount: number   // El PVP total del ticket o factura
  taxType: '21' | '10' | '4' | '0' // Tipo de IVA
  baseAmount: number    // Calculado
  taxAmount: number     // Calculado
  isShared: boolean     // ¿Es un gasto de suministros de casa?
  deductibleAmount: number // El importe final que es fiscalmente deducible
  fileUrl?: string      // URL al justificante
}

// Datos de ejemplo para demostración
const initialExpenses: Expense[] = [
  {
    id: "1",
    date: "2024-01-15",
    provider: "Endesa",
    concept: "Factura Luz Enero 2024",
    category: "Suministros",
    totalAmount: 60.50,
    taxType: "21",
    baseAmount: 50.00,
    taxAmount: 10.50,
    isShared: true,
    deductibleAmount: 3.64,
    fileUrl: "/sample-invoice.pdf"
  },
  {
    id: "2",
    date: "2024-01-10",
    provider: "Taxi Madrid",
    concept: "Carrera a supervisión clínica",
    category: "Transporte",
    totalAmount: 25.00,
    taxType: "21",
    baseAmount: 20.66,
    taxAmount: 4.34,
    isShared: false,
    deductibleAmount: 25.00,
    fileUrl: "/taxi-receipt.jpg"
  },
  {
    id: "3",
    date: "2024-01-20",
    provider: "Office Depot",
    concept: "Material de oficina",
    category: "Material",
    totalAmount: 45.80,
    taxType: "21",
    baseAmount: 37.85,
    taxAmount: 7.95,
    isShared: false,
    deductibleAmount: 45.80,
    fileUrl: "/office-receipt.pdf"
  },
  {
    id: "4",
    date: "2024-01-25",
    provider: "Orange",
    concept: "Factura internet y móvil",
    category: "Telecomunicaciones",
    totalAmount: 89.90,
    taxType: "21",
    baseAmount: 74.30,
    taxAmount: 15.60,
    isShared: true,
    deductibleAmount: 44.95,
    fileUrl: "/internet-bill.pdf"
  },
  {
    id: "5",
    date: "2024-01-28",
    provider: "Gas Natural",
    concept: "Factura gas diciembre",
    category: "Suministros",
    totalAmount: 120.30,
    taxType: "21",
    baseAmount: 99.42,
    taxAmount: 20.88,
    isShared: true,
    deductibleAmount: 6.02,
    fileUrl: "/gas-bill.pdf"
  }
]

export function ExpensesManagement() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  // Estados para filtros
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
  })
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(expenses.map(expense => expense.category))]
    return uniqueCategories.sort()
  }, [expenses])

  // Filtrar gastos basado en los filtros aplicados
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Filtro por rango de fechas
      const isInDateRange = dateRange?.from && dateRange?.to 
        ? isWithinInterval(parseISO(expense.date), { start: dateRange.from, end: dateRange.to })
        : true

      // Filtro por categoría
      const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory

      // Filtro por búsqueda
      const matchesSearch = searchTerm === "" || 
        expense.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())

      return isInDateRange && matchesCategory && matchesSearch
    })
  }, [expenses, dateRange, selectedCategory, searchTerm])

  // Calcular KPIs
  const kpis = useMemo(() => {
    const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.totalAmount, 0)
    const totalDeductible = filteredExpenses.reduce((sum, expense) => sum + expense.deductibleAmount, 0)
    const totalVAT = filteredExpenses.reduce((sum, expense) => sum + expense.taxAmount, 0)

    return {
      totalSpent,
      totalDeductible,
      totalVAT
    }
  }, [filteredExpenses])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString(), // Generar ID único
    }
    setExpenses(prev => [expense, ...prev])
    setIsFormOpen(false)
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
  }

  const handleEditExpense = (id: string) => {
    // Por ahora, solo abrimos el formulario para editar
    // En el futuro, aquí se podría implementar la lógica de edición
    console.log("Editar gasto:", id)
  }

  const handleViewExpense = (id: string) => {
    // Por ahora, solo mostramos en consola
    // En el futuro, aquí se podría abrir un modal de detalles
    console.log("Ver gasto:", id)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Gastos</h1>
          <p className="text-muted-foreground">
            Gestiona y analiza tus gastos profesionales de forma inteligente
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Gasto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Registrar Nuevo Gasto
              </DialogTitle>
            </DialogHeader>
            <ExpenseForm 
              onSubmit={handleAddExpense}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex justify-end">
        <ExpensesFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories}
        />
      </div>

      {/* Sección 1: KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title="Total Gastado"
          value={formatCurrency(kpis.totalSpent)}
          icon={Euro}
          description="Importe total de facturas"
        />
        <KpiCard
          title="Total Deducible"
          value={formatCurrency(kpis.totalDeductible)}
          icon={Calculator}
          description="Importe fiscalmente deducible"
        />
        <KpiCard
          title="Total IVA Soportado"
          value={formatCurrency(kpis.totalVAT)}
          icon={FileText}
          description="IVA soportado en facturas"
        />
      </div>

      {/* Sección 2: Gráfico */}
      <div>
        <ExpensesChart expenses={filteredExpenses} />
      </div>

      {/* Sección 3: Tabla de Gastos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Detalle de Gastos</h2>
          <p className="text-sm text-muted-foreground">
            {filteredExpenses.length} gastos encontrados
          </p>
        </div>
        <ExpenseTable
          expenses={filteredExpenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
          onView={handleViewExpense}
        />
      </div>
    </div>
  )
} 