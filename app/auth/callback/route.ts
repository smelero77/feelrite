import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const cookieStore = await cookies()
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL("/dashboard", request.url)) // Redirige a tu dashboard
    }
  }

  // Redirige a una página de error si el código no es válido o hay un error
  return NextResponse.redirect(new URL("/login?message=No se pudo iniciar sesión.", request.url))
}
