import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, User, FileText, Edit, XCircle } from "lucide-react"
import Link from "next/link"
import { getAppointmentDetails } from "@/app/dashboard/actions" // Importar la acción

export default async function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const { success, data: appointment, message } = await getAppointmentDetails(params.id)

  if (!success || !appointment) {
    return (
      <div className="p-4 md:p-8 text-center text-red-500">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-text">Error al cargar la Cita</h1>
        <p>{message || "No se pudieron cargar los detalles de la cita."}</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-text">Detalles de la Cita</h1>

      <Card className="bg-white border border-border-light shadow-sm max-w-3xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-semibold text-primary-text">
            Cita #{appointment.id.substring(0, 8)}
          </CardTitle>
          <Badge
            className={`px-3 py-1 rounded-full text-sm ${
              appointment.status === "Confirmada"
                ? "bg-green-100 text-green-700"
                : appointment.status === "Pendiente"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {appointment.status}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-primary-blue" />
              <div>
                <p className="text-secondary-text text-sm">Fecha</p>
                <p className="font-medium text-primary-text">
                  {new Date(appointment.date).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary-blue" />
              <div>
                <p className="text-secondary-text text-sm">Hora</p>
                <p className="font-medium text-primary-text">{appointment.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 col-span-full sm:col-span-1">
              <User className="h-5 w-5 text-primary-blue" />
              <div>
                <p className="text-secondary-text text-sm">Paciente</p>
                <Link
                  href={`/dashboard/patients/${appointment.patientId}`}
                  className="font-medium text-primary-blue hover:underline"
                >
                  {appointment.patient.name}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3 col-span-full sm:col-span-1">
              <FileText className="h-5 w-5 text-primary-blue" />
              <div>
                <p className="text-secondary-text text-sm">Tipo de Sesión</p>
                <p className="font-medium text-primary-text">{appointment.type}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-secondary-text text-sm mb-2">Notas de la Sesión</p>
            <div className="bg-gray-50 p-4 rounded-md border border-border-light text-primary-text">
              {appointment.notes || "No hay notas para esta sesión."}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button className="flex-1 rounded-full bg-primary-blue text-white hover:bg-primary-blue/90">
              <Edit className="h-4 w-4 mr-2" /> Editar Cita
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-full border-red-400 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <XCircle className="h-4 w-4 mr-2" /> Cancelar Cita
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
