"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subWeeks, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface DateRangePickerProps {
  className?: string
  onDateChange?: (range: DateRange | undefined) => void
}

export default function DateRangePicker({ className, onDateChange }: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  })
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectingType, setSelectingType] = useState<"start" | "end" | null>(null)

  const presetRanges = [
    {
      label: "Hoy",
      range: { from: new Date(), to: new Date() },
    },
    {
      label: "Ayer",
      range: { from: subDays(new Date(), 1), to: subDays(new Date(), 1) },
    },
    {
      label: "Esta semana",
      range: {
        from: startOfWeek(new Date(), { weekStartsOn: 1 }),
        to: endOfWeek(new Date(), { weekStartsOn: 1 }),
      },
    },
    {
      label: "Semana pasada",
      range: {
        from: startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
        to: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
      },
    },
    {
      label: "Últimos 7 días",
      range: { from: subDays(new Date(), 6), to: new Date() },
    },
    {
      label: "Últimos 30 días",
      range: { from: subDays(new Date(), 29), to: new Date() },
    },
    {
      label: "Este mes",
      range: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    },
    {
      label: "Mes pasado",
      range: {
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfMonth(subMonths(new Date(), 1)),
      },
    },
  ]

  useEffect(() => {
    if (isOpen) {
      if (selectingType === null) {
        setSelectingType("start")
      }
      if (date?.from) {
        setCurrentMonth(date.from)
      }
    } else {
      setSelectingType(null)
    }
  }, [isOpen])

  const handlePresetClick = (range: DateRange) => {
    setDate(range)
    if (range.from) {
      setCurrentMonth(range.from)
    }
    onDateChange?.(range)
    setIsOpen(false)
  }

  const handleDateSelect = (newDate: DateRange | undefined) => {
    if (selectingType === "start" && newDate?.from) {
      const updatedRange: DateRange = { from: newDate.from, to: date?.to }
      setDate(updatedRange)
      setSelectingType("end")
    } else if (selectingType === "end" && newDate?.from && date?.from) {
      const finalRange: DateRange = { from: date.from, to: newDate.from }
      setDate(finalRange)
      onDateChange?.(finalRange)
      setIsOpen(false)
    } else {
      setDate(newDate)
    }
  }

  const handleApply = () => {
    onDateChange?.(date)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handlePresetHover = (range: DateRange) => {
    setDate(range)
    if (range.from) {
      setCurrentMonth(range.from)
    }
  }

  const handleDayMouseEnter = (day: Date) => {
    if (selectingType === "start") {
      setDate((prev) => prev ? { ...prev, from: day } : { from: day, to: undefined })
    } else if (selectingType === "end" && date?.from) {
      setDate((prev) => prev ? { ...prev, to: day } : { from: date.from, to: day })
    }
  }

  const handleStartDateClick = (e: React.MouseEvent) => {
    // Al hacer clic en INICIO, se activa la selección de FIN
    setSelectingType("end")
    setIsOpen(true)
    if (date?.to) {
      setCurrentMonth(date.to)
    }
  }

  const handleEndDateClick = (e: React.MouseEvent) => {
    // Al hacer clic en FIN, se activa la selección de INICIO
    setSelectingType("start")
    setIsOpen(true)
    if (date?.from) {
      setCurrentMonth(date.from)
    }
  }

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Seleccionar fechas"

    if (!range.to) {
      return (
        <span>
          <span
            className={cn(
              "cursor-pointer hover:bg-muted px-1 rounded",
              selectingType === "start" && "underline decoration-2 underline-offset-2",
            )}
            onClick={handleStartDateClick}
          >
            {format(range.from, "dd MMM yyyy", { locale: es })}
          </span>
        </span>
      )
    }

    if (range.from.getTime() === range.to.getTime()) {
      return (
        <span>
          <span
            className={cn(
              "cursor-pointer hover:bg-muted px-1 rounded",
              selectingType === "start" && "underline decoration-2 underline-offset-2",
            )}
            onClick={handleStartDateClick}
          >
            {format(range.from, "dd MMM yyyy", { locale: es })}
          </span>
        </span>
      )
    }

    return (
      <span>
        <span
          className={cn(
            "cursor-pointer hover:bg-muted px-1 rounded",
            selectingType === "start" && "underline decoration-2 underline-offset-2",
          )}
          onClick={handleStartDateClick}
        >
          {format(range.from, "dd MMM yyyy", { locale: es })}
        </span>
        <span> a </span>
        <span
          className={cn(
            "cursor-pointer hover:bg-muted px-1 rounded",
            selectingType === "end" && "underline decoration-2 underline-offset-2",
          )}
          onClick={handleEndDateClick}
        >
          {format(range.to, "dd MMM yyyy", { locale: es })}
        </span>
      </span>
    )
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Opciones predefinidas */}
            <div className="flex flex-col gap-1 p-3 border-r min-w-[140px]">
              <div className="text-sm font-medium mb-2">Rangos rápidos</div>
              {presetRanges.map((preset, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="justify-start h-8 px-2 text-sm whitespace-nowrap"
                  onClick={() => handlePresetClick(preset.range)}
                  onMouseEnter={() => handlePresetHover(preset.range)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {/* Calendario */}
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                selected={date}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                locale={es}
                showOutsideDays={false}
                className="rounded-md border-0"
                onDayMouseEnter={handleDayMouseEnter}
              />

              <Separator className="my-3" />

              {/* Botones de acción */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleApply} disabled={!date?.from}>
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 