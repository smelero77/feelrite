import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, User, Plus } from "lucide-react"

export default function NewPatientProfileDisplayPage() {
  return (
    <div className="p-4 md:p-8">
      {/* Cabecera de la página */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        {/* Título y ID del paciente */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-text">Asf Asdf</h1>
          <p className="text-sm text-secondary-text">PACIENTE ID: 488</p>
        </div>

        {/* Datos clave del paciente (centrado en pantallas grandes) */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-secondary-text text-sm md:justify-center flex-1">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Edad: 8</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Sexo: Masculino</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>Última cita: --</span>
          </div>
        </div>

        {/* Botones de acción (a la derecha) */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="rounded-full border-border-light text-primary-text hover:bg-gray-50 bg-transparent"
          >
            Consentimiento Informado
          </Button>
          <Button
            variant="outline"
            className="rounded-full border-border-light text-primary-text hover:bg-gray-50 bg-transparent"
          >
            Otra Documentación
          </Button>
          <Button className="rounded-full bg-primary-blue text-white hover:bg-primary-blue/90 px-6 py-2">
            <Plus className="h-4 w-4 mr-2" /> Agendar Cita
          </Button>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1 mb-6">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-primary-blue data-[state=active]:text-white rounded-md text-primary-text"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="facturas"
            className="data-[state=active]:bg-primary-blue data-[state=active]:text-white rounded-md text-primary-text"
          >
            Facturas
          </TabsTrigger>
          <TabsTrigger
            value="tus-notas"
            className="data-[state=active]:bg-primary-blue data-[state=active]:text-white rounded-md text-primary-text"
          >
            Tus Notas
          </TabsTrigger>
        </TabsList>

        {/* Contenido de la pestaña "General" */}
        <TabsContent value="general">
          <h2 className="text-2xl font-bold text-primary-text mb-6">Información Recogida Fuera de Terapia</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border border-border-light shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary-text">Autoregistro</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary-text">
                Registros diarios de pensamientos, emociones y comportamientos.
              </CardContent>
            </Card>
            <Card className="bg-white border border-border-light shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary-text">Diario Terapéutico</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary-text">
                Espacio para reflexiones personales y progreso entre sesiones.
              </CardContent>
            </Card>
            <Card className="bg-white border border-border-light shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary-text">Biblioteca de Recursos</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary-text">
                Acceso a artículos, ejercicios y materiales de apoyo.
              </CardContent>
            </Card>
            <Card className="bg-white border border-border-light shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary-text">Tracking Emocional</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary-text">
                Seguimiento de estados de ánimo y patrones emocionales.
              </CardContent>
            </Card>
            <Card className="bg-white border border-border-light shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary-text">Mensajes</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary-text">Comunicación segura y directa con el terapeuta.</CardContent>
            </Card>
            <Card className="bg-white border border-border-light shadow-sm opacity-50 relative">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-secondary-text">Actividad Física</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary-text">
                Registro y seguimiento de la actividad física diaria.
              </CardContent>
              <Badge className="absolute top-4 right-4 bg-gray-200 text-gray-600 text-xs">Próximamente</Badge>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-primary-text mb-6">Información Recogida en Terapia</h2>
          <Card className="bg-white border border-border-light shadow-sm w-full mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary-text">Transcripciones</CardTitle>
            </CardHeader>
            <CardContent className="text-secondary-text">
              Acceso a transcripciones de sesiones (si aplica y con consentimiento).
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-primary-text mb-6">Optimización del Tratamiento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white border border-border-light shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary-text">Resumen de la Semana</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary-text">
                Visión general del progreso y los hitos semanales.
              </CardContent>
            </Card>
            <Card className="bg-white border border-border-light shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary-text">Evolución de Sintomatología</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary-text">
                Gráficos y datos sobre la mejora de los síntomas.
              </CardContent>
            </Card>
            <Card className="bg-white border border-border-light shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary-text">Recursos Favoritos</CardTitle>
              </CardHeader>
              <CardContent className="text-secondary-text">
                Colección personalizada de recursos útiles para el paciente.
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contenido de la pestaña "Facturas" (vacío por ahora) */}
        <TabsContent value="facturas">
          <div className="p-6 text-center text-secondary-text">Aquí se mostrarán las facturas del paciente.</div>
        </TabsContent>

        {/* Contenido de la pestaña "Tus Notas" (vacío por ahora) */}
        <TabsContent value="tus-notas">
          <div className="p-6 text-center text-secondary-text">
            Aquí podrás añadir y ver tus notas sobre el paciente.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
