import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { MonthlyCalendar } from "@/components/monthly-calendar"
import { getAllAppointments } from "@/app/dashboard/actions"

function CalendarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      
      {/* Calendar grid skeleton */}
      <div className="border rounded-lg overflow-hidden">
        {/* Days header */}
        <div className="grid grid-cols-7 border-b bg-gray-50">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-12 m-2" />
          ))}
        </div>
        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="min-h-[120px] p-2 border-r border-b">
              <Skeleton className="h-4 w-6 mb-2" />
              <div className="space-y-1">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

async function CalendarComponent() {
  const appointmentsResult = await getAllAppointments()
  
  if (!appointmentsResult.success || !appointmentsResult.data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error al cargar las citas: {appointmentsResult.message}</p>
      </div>
    )
  }

  return (
    <MonthlyCalendar appointments={appointmentsResult.data} />
  )
}

export default async function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary-text">Calendario de Citas</h1>
        <p className="text-secondary-text mt-2">
          Gestiona y visualiza todas tus citas de manera interactiva
        </p>
      </div>

      <Suspense fallback={<CalendarSkeleton />}>
        <CalendarComponent />
      </Suspense>
    </div>
  )
} 