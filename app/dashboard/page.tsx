import { getDashboardData } from "./actions"
import { DashboardClientContent } from "@/components/dashboard-client-content"

export default async function DashboardPage() {
  const dashboardData = await getDashboardData()

  if (!dashboardData.success || !dashboardData.data) {
    return (
      <div className="p-4 md:p-8 text-center text-red-500">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-text">Error al cargar el Dashboard</h1>
        <p>{dashboardData.message || "No se pudieron cargar los datos del dashboard."}</p>
      </div>
    )
  }

  return <DashboardClientContent data={dashboardData.data} />
}
