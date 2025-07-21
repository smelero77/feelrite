import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, DollarSign, Download, Send, CheckCircle, User } from "lucide-react"
import Link from "next/link"
import { getInvoiceDetails } from "@/app/dashboard/actions" // Importar la acción

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const { success, data: invoice, message } = await getInvoiceDetails(params.id)

  if (!success || !invoice) {
    return (
      <div className="p-4 md:p-8 text-center text-red-500">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-text">Error al cargar la Factura</h1>
        <p>{message || "No se pudieron cargar los detalles de la factura."}</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-text">Detalles de la Factura</h1>

      <Card className="bg-white border border-border-light shadow-sm max-w-3xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-semibold text-primary-text">Factura #{invoice.invoiceNumber}</CardTitle>
          <Badge
            className={`px-3 py-1 rounded-full text-sm ${
              invoice.status === "Pagada"
                ? "bg-green-100 text-green-700"
                : invoice.status === "Pendiente"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {invoice.status}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-primary-blue" />
              <div>
                <p className="text-secondary-text text-sm">Fecha de Emisión</p>
                <p className="font-medium text-primary-text">
                  {new Date(invoice.date).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-primary-blue" />
              <div>
                <p className="text-secondary-text text-sm">Fecha de Vencimiento</p>
                <p className="font-medium text-primary-text">
                  {new Date(invoice.dueDate).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 col-span-full sm:col-span-1">
              <User className="h-5 w-5 text-primary-blue" />
              <div>
                <p className="text-secondary-text text-sm">Paciente</p>
                <Link
                  href={`/dashboard/patients/${invoice.patientId}`}
                  className="font-medium text-primary-blue hover:underline"
                >
                  {invoice.patient.name}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3 col-span-full sm:col-span-1">
              <DollarSign className="h-5 w-5 text-primary-blue" />
              <div>
                <p className="text-secondary-text text-sm">Monto Total</p>
                <p className="font-bold text-primary-text text-xl">{invoice.totalAmount.toFixed(2)}€</p>
              </div>
            </div>
          </div>

          {/* Detalles de los ítems - Asumiendo que los ítems se gestionan fuera de Prisma o en un modelo separado */}
          <div>
            <p className="text-secondary-text text-sm mb-2">Detalles de los Servicios</p>
            <div className="bg-gray-50 p-4 rounded-md border border-border-light">
              <div className="grid grid-cols-3 gap-2 font-semibold text-primary-text border-b pb-2 mb-2">
                <span>Descripción</span>
                <span className="text-center">Cantidad</span>
                <span className="text-right">Total</span>
              </div>
              {/* Aquí se necesitaría un modelo de Prisma para InvoiceItem si quieres que sea dinámico */}
              <div className="grid grid-cols-3 gap-2 text-primary-text py-1">
                <span>Sesión de Terapia Individual (1 hora)</span>
                <span className="text-center">1</span>
                <span className="text-right">{invoice.totalAmount.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-secondary-text text-sm mb-2">Notas de la Factura</p>
            <div className="bg-gray-50 p-4 rounded-md border border-border-light text-primary-text">
              {invoice.notes || "No hay notas adicionales para esta factura."}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button className="flex-1 rounded-full bg-primary-blue text-white hover:bg-primary-blue/90">
              <Download className="h-4 w-4 mr-2" /> Descargar PDF
            </Button>
            <Button
              variant="outline"
              className="flex-1 rounded-full border-border-light text-primary-text hover:bg-gray-50 bg-transparent"
            >
              <Send className="h-4 w-4 mr-2" /> Enviar Factura
            </Button>
            {invoice.status !== "Pagada" && (
              <Button
                variant="outline"
                className="flex-1 rounded-full border-green-400 text-green-600 hover:bg-green-50 bg-transparent"
              >
                <CheckCircle className="h-4 w-4 mr-2" /> Marcar como Pagada
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
