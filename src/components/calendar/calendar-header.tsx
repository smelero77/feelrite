"use client"

import * as React from "react"
import { 
  Calendar as CalendarIcon,
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search,
  Filter,
  RefreshCw
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

type CalendarView = "month" | "week" | "day" | "list"

interface CalendarHeaderProps {
  currentDate: Date
  view: CalendarView
  eventsCount: number
  onViewChange: (view: CalendarView) => void
  onNavigate: (direction: "prev" | "next") => void
  onTodayClick: () => void
  onAddEventClick: () => void
  onFiltersChange: (filters: Set<string>) => void
  onSearchChange: (searchTerm: string) => void
}

export function CalendarHeader({
  currentDate,
  view,
  eventsCount,
  onViewChange,
  onNavigate,
  onTodayClick,
  onAddEventClick,
  onFiltersChange,
  onSearchChange
}: CalendarHeaderProps) {
  const [selectedFilters, setSelectedFilters] = React.useState<Set<string>>(new Set())
  const [isSearchActive, setIsSearchActive] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const EVENT_TYPES = {
    cita: { label: "Cita", color: "bg-chart-1" },
    recordatorio: { label: "Recordatorio", color: "bg-chart-2" },
    ejercicio: { label: "Ejercicio", color: "bg-chart-3" },
    meditacion: { label: "Meditación", color: "bg-chart-4" },
    personal: { label: "Personal", color: "bg-chart-5" }
  }

  const handleFilterChange = (filterType: string, checked: boolean) => {
    const newFilters = new Set(selectedFilters)
    if (checked) {
      newFilters.add(filterType)
    } else {
      newFilters.delete(filterType)
    }
    setSelectedFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    const newFilters = new Set<string>()
    setSelectedFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleDropdownOpenChange = (open: boolean) => {
    if (!open) {
      // Quitar focus cuando se cierre el dropdown
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      }, 0)
    }
  }

  const handleSearchToggle = () => {
    const newSearchActive = !isSearchActive
    setIsSearchActive(newSearchActive)
    
    if (!newSearchActive) {
      setSearchTerm("")
      onSearchChange("")
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange(value)
  }


  
  const getPeriodTitle = () => {
    switch (view) {
      case "month":
        const monthYear = format(currentDate, "MMMM yyyy", { locale: es })
        return monthYear.charAt(0).toUpperCase() + monthYear.slice(1)
      case "week":
        const weekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 1)
        const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6)
        return `${format(weekStart, "d MMM", { locale: es })} - ${format(weekEnd, "d MMM yyyy", { locale: es })}`
      case "day":
        return format(currentDate, "EEEE, d 'de' MMMM yyyy", { locale: es })
      case "list":
        return "Próximos eventos"
      default:
        return ""
    }
  }

  return (
    <div className="flex-shrink-0">
      <CardHeader className="border-b border-border py-3 px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground w-12 h-6 flex items-center justify-center rounded-none">
                {format(currentDate, "MMM", { locale: es }).toUpperCase()}
              </Button>
              <Button variant="outline" size="sm" className="text-2xl font-bold w-12 h-8 flex items-center justify-center leading-none">
                {format(currentDate, "d")}
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold">{getPeriodTitle()}</CardTitle>
                <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                  {eventsCount} {eventsCount === 1 ? 'cita' : 'citas'}
                </span>
              </div>
              {/* Navegador de rango de fechas */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Button variant="outline" size="sm" onClick={() => onNavigate("prev")} className="w-6 h-6 p-0 rounded-full">
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <span className="font-medium">
                  {view === "day" 
                    ? format(currentDate, "d 'de' MMMM, yyyy", { locale: es })
                    : `${format(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), "MMM d, yyyy", { locale: es })} - ${format(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), "MMM d, yyyy", { locale: es })}`
                  }
                </span>
                <Button variant="outline" size="sm" onClick={() => onNavigate("next")} className="w-6 h-6 p-0 rounded-full">
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap sm:justify-end justify-between w-full sm:w-auto">
            {/* Botones de vista */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={view === "month" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewChange("month")}
                className="text-xs px-2"
              >
                M
              </Button>
              <Button
                variant={view === "week" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewChange("week")}
                className="text-xs px-2"
              >
                W
              </Button>
              <Button
                variant={view === "day" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewChange("day")}
                className="text-xs px-2"
              >
                D
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewChange("list")}
                className="text-xs px-2"
              >
                L
              </Button>
            </div>
            

            
            {/* Botones de acción */}
            <div className="flex items-center gap-2">
              {view === "day" && (
                <Button variant="outline" size="sm" onClick={onTodayClick}>
                  Hoy
                </Button>
              )}
              <DropdownMenu onOpenChange={handleDropdownOpenChange}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="relative focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 data-[state=open]:ring-0 data-[state=open]:ring-offset-0 outline-none focus:outline-none"
                  >
                    <Filter className="w-4 h-4" />
                    {selectedFilters.size > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {selectedFilters.size}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  {Object.entries(EVENT_TYPES).map(([type, config]) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={selectedFilters.has(type)}
                      onCheckedChange={(checked) => handleFilterChange(type, checked)}
                      onSelect={(e) => e.preventDefault()}
                      className="flex items-center justify-between pl-2"
                    >
                      <div className="flex items-center gap-2 text-left">
                        <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                        <span>{config.label}</span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={clearAllFilters}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Limpiar filtros
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSearchToggle}
                className={isSearchActive ? "ring-2 ring-primary ring-offset-2" : ""}
              >
                <Search className="w-4 h-4" />
              </Button>
              
              <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={onAddEventClick}>
                <Plus className="w-4 h-4 mr-2" />
                Cita
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {/* Campo de búsqueda */}
      {isSearchActive && (
        <div className="px-6 py-3 border-b border-border bg-muted/20">
          <Input
            placeholder="Buscar en título y descripción de citas..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="max-w-md text-sidebar-foreground placeholder:text-sidebar-foreground"
            autoFocus
          />
        </div>
      )}
    </div>
  )
} 