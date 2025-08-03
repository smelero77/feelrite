"use client"

import React from "react"
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  addMonths,
  subMonths,
  addDays,
  subDays
} from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MiniCalendarProps {
  currentDate: Date
  onDateSelect: (date: Date) => void
  onNavigate: (direction: "prev" | "next") => void
}

export function MiniCalendar({ 
  currentDate, 
  onDateSelect, 
  onNavigate 
}: MiniCalendarProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }) // Domingo
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 }) // Domingo
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const handlePrevMonth = () => {
    onNavigate("prev")
  }

  const handleNextMonth = () => {
    onNavigate("next")
  }

  const handleDayClick = (day: Date) => {
    onDateSelect(day)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-3 w-full">
      {/* Header del mes */}
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevMonth}
          className="h-5 w-5 p-0"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <h3 className="text-xs font-medium">
          {format(currentDate, "MMMM yyyy", { locale: es })}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextMonth}
          className="h-5 w-5 p-0"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-0.5 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-xs text-muted-foreground text-center font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isDayToday = isToday(day)
          const isSelected = isSameDay(day, currentDate)
          
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => handleDayClick(day)}
              className={`h-6 w-full p-0 text-xs font-medium rounded-md ${
                !isCurrentMonth 
                  ? "text-muted-foreground/40" 
                  : isSelected
                  ? "bg-primary text-primary-foreground"
                  : isDayToday
                  ? "bg-muted text-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {format(day, "d")}
            </Button>
          )
        })}
      </div>
    </div>
  )
} 