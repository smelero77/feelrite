"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma" // Importar la instancia de Prisma

// Función de utilidad para validar el email
function isValidEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email)
}

// Función de utilidad para validar la fortaleza de la contraseña
function isValidPassword(password: string): string | null {
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres."
  }
  if (!/[A-Z]/.test(password)) {
    return "La contraseña debe contener al menos una mayúscula."
  }
  if (!/[a-z]/.test(password)) {
    return "La contraseña debe contener al menos una minúscula."
  }
  if (!/[0-9]/.test(password)) {
    return "La contraseña debe contener al menos un número."
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "La contraseña debe contener al menos un carácter especial."
  }
  return null // La contraseña es válida
}

export async function signUp(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm-password") as string

  console.log("Server Action: signUp iniciado.")

  // Validaciones del lado del servidor
  if (!email || !password || !confirmPassword) {
    return { success: false, message: "Todos los campos son requeridos." }
  }
  if (!isValidEmail(email)) {
    return { success: false, message: "Formato de email inválido." }
  }
  if (password !== confirmPassword) {
    return { success: false, message: "Las contraseñas no coinciden." }
  }
  const passwordError = isValidPassword(password)
  if (passwordError) {
    return { success: false, message: passwordError }
  }

  const supabase = await getSupabaseServerClient()
  const emailRedirectToUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
  console.log(`emailRedirectTo URL: ${emailRedirectToUrl}`)

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: emailRedirectToUrl,
    },
  })

  if (error) {
    console.error("Error al registrar usuario en Supabase:", error.message)
    return { success: false, message: error.message }
  }

  console.log("Usuario registrado exitosamente. Redirigiendo a /login.")
  revalidatePath("/", "layout")
  redirect("/login?message=Revisa tu email para verificar tu cuenta.")
}

export async function signIn(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("Server Action: signIn iniciado para email:", email)

  // Validaciones del lado del servidor
  if (!email || !password) {
    console.log("Error: Email y contraseña son requeridos")
    return { success: false, message: "Email y contraseña son requeridos." }
  }
  if (!isValidEmail(email)) {
    console.log("Error: Formato de email inválido")
    return { success: false, message: "Formato de email inválido." }
  }

  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Error al iniciar sesión en Supabase:", error.message)
    return { success: false, message: error.message }
  }

  if (!data.user) {
    console.error("Error: No se obtuvo usuario después del login exitoso")
    return { success: false, message: "Error interno de autenticación." }
  }

  console.log("Usuario autenticado exitosamente:", data.user.email)

  // Revalidar todas las rutas relacionadas con autenticación
  revalidatePath("/", "layout")
  revalidatePath("/dashboard", "layout")
  revalidatePath("/login", "page")

  console.log("Ejecutando redirect a /dashboard...")
  redirect("/dashboard")
}

export async function signOut() {
  console.log("Server Action: signOut iniciado.")
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error al cerrar sesión:", error.message)
  } else {
    console.log("Sesión cerrada exitosamente. Redirigiendo a /login.")
  }

  revalidatePath("/", "layout")
  redirect("/login")
}

export async function requestPasswordReset(prevState: any, formData: FormData) {
  const email = formData.get("email") as string

  console.log("Server Action: requestPasswordReset iniciado.")

  if (!email || !isValidEmail(email)) {
    return { success: false, message: "Por favor, introduce un email válido." }
  }

  const supabase = await getSupabaseServerClient()
  const redirectToUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/update-password` // URL a la que redirigir después de hacer clic en el email
  console.log(`Password reset redirect URL: ${redirectToUrl}`)

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectToUrl,
  })

  if (error) {
    console.error("Error al solicitar restablecimiento de contraseña:", error.message)
    return { success: false, message: error.message }
  }

  return {
    success: true,
    message: "Si tu email está registrado, recibirás un enlace para restablecer tu contraseña.",
  }
}

export async function updatePassword(prevState: any, formData: FormData) {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm-password") as string

  console.log("Server Action: updatePassword iniciado.")

  if (!password || !confirmPassword) {
    return { success: false, message: "Todos los campos son requeridos." }
  }
  if (password !== confirmPassword) {
    return { success: false, message: "Las contraseñas no coinciden." }
  }
  const passwordError = isValidPassword(password)
  if (passwordError) {
    return { success: false, message: passwordError }
  }

  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error("Error al actualizar la contraseña:", error.message)
    return { success: false, message: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/login?message=Tu contraseña ha sido actualizada exitosamente. Por favor, inicia sesión.")
}

export async function updateUserProfile(prevState: any, formData: FormData) {
  const username = formData.get("username") as string
  const website = formData.get("website") as string

  console.log("Server Action: updateUserProfile iniciado.")

  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error("Error: Usuario no autenticado para actualizar perfil.", userError?.message)
    return { success: false, message: "No autorizado para actualizar el perfil." }
  }

  try {
    const updates = {
      id: user.id,
      username,
      website,
      updatedAt: new Date(), // Prisma maneja automáticamente el formato ISO
    }

    // Usar Prisma para upsert (insertar o actualizar) el perfil
    const { id, ...dataToUpsert } = updates // Separar 'id' para el 'where'
    await prisma.profile.upsert({
      where: { id: updates.id },
      update: dataToUpsert,
      create: updates,
    })

    console.log("Perfil actualizado exitosamente.")
    revalidatePath("/dashboard/profile", "page") // Revalidar la página de perfil para mostrar los cambios
    return { success: true, message: "Perfil actualizado exitosamente." }
  } catch (error: any) {
    console.error("Error inesperado al actualizar el perfil:", error.message)
    return { success: false, message: "Error inesperado al actualizar el perfil." }
  }
}
