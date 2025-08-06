import { Search } from "lucide-react"
import type { DateRange } from "react-day-picker"

import DateRangePicker from "@/components/ui/date-range-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface ExpensesFiltersProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
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
  categories,
}: ExpensesFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <DateRangePicker
        onDateChange={onDateRangeChange}
        className="w-full md:w-auto"
      />

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
