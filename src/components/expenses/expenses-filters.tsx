import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"

export type DateRange = {
  from: Date
  to: Date
}

interface ExpensesFiltersProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  categories: string[]
}

export function ExpensesFilters({
  dateRange,
  onDateRangeChange,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  categories
}: ExpensesFiltersProps) {

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      {/* Selector de rango de fechas */}
      <DateRangePicker
        onUpdate={({ range }) => onDateRangeChange({ from: range.from, to: range.to || range.from })}
        initialDateFrom={dateRange.from}
        initialDateTo={dateRange.to}
        align="start"
        showCompare={false}
      />

      {/* Selector de categoría */}
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Búsqueda */}
      <div className="relative w-full md:w-[250px]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar gastos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  )
} 