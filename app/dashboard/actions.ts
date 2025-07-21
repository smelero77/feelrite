"use server"

import prisma from "@/lib/prisma"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

// Función para obtener el perfil del usuario
export async function getUserProfile() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login") // Redirigir si no hay usuario autenticado
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
    })
    return { success: true, data: { email: user.email, ...profile } }
  } catch (error: any) {
    console.error("Error al obtener el perfil:", error.message)
    return { success: false, message: "Error al cargar el perfil." }
  }
}

// Función para obtener datos del dashboard
export async function getDashboardData() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  try {
    // Ejemplo: Obtener las próximas citas (filtrar por paciente si es necesario)
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        // Aquí podrías filtrar por un patientId asociado al usuario si tu modelo lo permite
        // Por ahora, solo un ejemplo de filtro por fecha
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
      take: 3, // Limitar a 3 próximas citas
      include: { patient: true }, // Incluir datos del paciente
    })

    // Ejemplo: Obtener tareas pendientes (puedes definir un modelo de Task en Prisma)
    // Por simplicidad, usaremos un mock por ahora si no hay modelo de Task
    const pendingTasks = [
      { text: "La sesión con Carlos Rey ha finalizado.", action: "Añadir notas", link: "#" },
      { text: "Revisar historial de Ana Soto.", action: "Ver historial", link: "#" },
      { text: "Factura pendiente de pago de Elena Díaz.", action: "Enviar recordatorio", link: "#" },
    ]

    // Ejemplo: Resumen de actividad (contar registros)
    const sessionsThisWeek = await prisma.appointment.count({
      where: {
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          lte: new Date(),
        },
      },
    })
    const pendingInvoices = await prisma.invoice.count({
      where: { status: "Pendiente" },
    })
    const activePatients = await prisma.patient.count() // O filtrar por pacientes activos si tienes un campo de estado

    const activitySummary = [
      { title: "Sesiones esta semana", value: sessionsThisWeek },
      { title: "Facturas Pendientes", value: pendingInvoices },
      { title: "Pacientes Activos", value: activePatients },
    ]

    return {
      success: true,
      data: {
        upcomingAppointments: upcomingAppointments.map((appt) => ({
          time: appt.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          name: appt.patient.name,
          id: appt.id,
        })),
        pendingTasks, // Mantener mock por ahora
        activitySummary,
      },
    }
  } catch (error: any) {
    console.error("Error al obtener datos del dashboard:", error.message)
    return { success: false, message: "Error al cargar los datos del dashboard." }
  }
}

// Función para obtener detalles de una cita
export async function getAppointmentDetails(id: string) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/login")
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { patient: true },
    })
    if (!appointment) {
      return { success: false, message: "Cita no encontrada." }
    }
    return { success: true, data: appointment }
  } catch (error: any) {
    console.error("Error al obtener detalles de la cita:", error.message)
    return { success: false, message: "Error al cargar los detalles de la cita." }
  }
}

// Función para obtener detalles de un paciente
export async function getPatientDetails(id: string) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/login")
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: { appointments: { orderBy: { date: "desc" } }, invoices: { orderBy: { date: "desc" } } },
    })
    if (!patient) {
      return { success: false, message: "Paciente no encontrado." }
    }
    return { success: true, data: patient }
  } catch (error: any) {
    console.error("Error al obtener detalles del paciente:", error.message)
    return { success: false, message: "Error al cargar los detalles del paciente." }
  }
}

// Función para obtener detalles de una factura
export async function getInvoiceDetails(id: string) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/login")
  }

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { patient: true },
    })
    if (!invoice) {
      return { success: false, message: "Factura no encontrada." }
    }
    return { success: true, data: invoice }
  } catch (error: any) {
    console.error("Error al obtener detalles de la factura:", error.message)
    return { success: false, message: "Error al cargar los detalles de la factura." }
  }
}

// Nueva función para actualizar el perfil del paciente
export async function updatePatientProfile(prevState: any, formData: FormData) {
  const patientId = formData.get("id") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const notes = formData.get("notes") as string
  const avatarUrl = formData.get("avatarUrl") as string

  console.log("Server Action: updatePatientProfile iniciado para paciente ID:", patientId)

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("Error: Usuario no autenticado para actualizar perfil de paciente.", userError?.message)
    return { success: false, message: "No autorizado para actualizar el perfil del paciente." }
  }

  // Validaciones básicas
  if (!patientId || !name || !email) {
    return { success: false, message: "Nombre y email del paciente son requeridos." }
  }

  try {
    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        name,
        email,
        phone: phone || null,
        address: address || null,
        notes: notes || null,
        avatarUrl: avatarUrl || null,
        updatedAt: new Date(),
      },
    })

    console.log("Perfil del paciente actualizado exitosamente:", updatedPatient.id)
    revalidatePath(`/dashboard/patients/${patientId}`, "page") // Revalidar la página de perfil del paciente
    return { success: true, message: "Perfil del paciente actualizado exitosamente." }
  } catch (error: any) {
    console.error("Error al actualizar el perfil del paciente:", error.message)
    // Manejar error de email duplicado si es necesario
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return { success: false, message: "El email ya está registrado para otro paciente." }
    }
    return { success: false, message: "Error al actualizar el perfil del paciente." }
  }
}

// Nueva función para crear una cita
export async function createAppointment(prevState: any, formData: FormData) {
  const patientId = formData.get("patientId") as string
  const dateString = formData.get("date") as string
  const time = formData.get("time") as string
  const type = formData.get("type") as string
  const status = formData.get("status") as string
  const notes = formData.get("notes") as string

  console.log("Server Action: createAppointment iniciado para paciente ID:", patientId)

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("Error: Usuario no autenticado para crear cita.", userError?.message)
    return { success: false, message: "No autorizado para crear la cita." }
  }

  // Validaciones básicas
  if (!patientId || !dateString || !time || !type || !status) {
    return { success: false, message: "Todos los campos obligatorios deben ser completados." }
  }

  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return { success: false, message: "Formato de fecha inválido." }
  }

  try {
    const newAppointment = await prisma.appointment.create({
      data: {
        patientId,
        date,
        time,
        type,
        status,
        notes: notes || null,
      },
    })

    console.log("Cita creada exitosamente:", newAppointment.id)
    revalidatePath(`/dashboard/patients/${patientId}`, "page") // Revalidar la página del paciente
    revalidatePath("/dashboard", "page") // Revalidar el dashboard para actualizar próximas citas
    revalidatePath("/dashboard/calendar", "page") // Revalidar el calendario
    return { success: true, message: "Cita agendada exitosamente." }
  } catch (error: any) {
    console.error("Error al crear la cita:", error.message)
    return { success: false, message: "Error al agendar la cita." }
  }
}

// Función para obtener todas las citas para el calendario
export async function getAllAppointments() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
      },
      orderBy: {
        date: "asc",
      },
    })

    return { success: true, data: appointments }
  } catch (error: any) {
    console.error("Error al obtener citas:", error.message)
    return { success: false, message: "Error al cargar las citas." }
  }
}

// Función para crear una cita desde objetos (para el dialog)
export async function createAppointmentFromDialog(appointmentData: {
  patientId: string;
  date: Date;
  time: string;
  type: string;
  notes?: string;
}) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, message: "No autorizado para crear la cita." }
  }

  // Validaciones básicas
  if (!appointmentData.patientId || !appointmentData.date || !appointmentData.time || !appointmentData.type) {
    return { success: false, message: "Todos los campos obligatorios deben ser completados." }
  }

  try {
    const newAppointment = await prisma.appointment.create({
      data: {
        patientId: appointmentData.patientId,
        date: appointmentData.date,
        time: appointmentData.time,
        type: appointmentData.type,
        status: "programada", // Estado por defecto
        notes: appointmentData.notes || null,
      },
    })

    console.log("Cita creada exitosamente:", newAppointment.id)
    revalidatePath("/dashboard/calendar", "page") // Revalidar el calendario
    revalidatePath("/dashboard", "page") // Revalidar el dashboard
    return { success: true, message: "Cita creada exitosamente." }
  } catch (error: any) {
    console.error("Error al crear la cita:", error.message)
    return { success: false, message: "Error al crear la cita." }
  }
}
