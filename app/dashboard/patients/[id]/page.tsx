import { getPatientDetails } from "@/app/dashboard/actions" // Importar la acción
import { PatientProfileView } from "@/components/patient-profile-view" // Importar el nuevo componente

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const { success, data: patient, message } = await getPatientDetails(params.id)

  if (!success || !patient) {
    return (
      <div className="p-4 md:p-8 text-center text-red-500">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-text">Error al cargar el Paciente</h1>
        <p>{message || "No se pudieron cargar los detalles del paciente."}</p>
      </div>
    )
  }

  return <PatientProfileView patient={patient} />
}
