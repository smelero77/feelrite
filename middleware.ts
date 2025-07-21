import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  console.log(`Middleware: Procesando ${request.method} ${request.nextUrl.pathname}`)

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    },
  )

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log(`Middleware: Usuario ${user ? "autenticado" : "no autenticado"} para ${request.nextUrl.pathname}`)

    // Si el usuario está intentando acceder a /dashboard sin estar autenticado
    if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
      console.log("Middleware: Redirigiendo usuario no autenticado a /login")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Si el usuario está autenticado y trata de acceder a /login o /register
    // PERO solo si no es una redirección desde una Server Action
    if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") && user) {
      // Verificar si esta request viene de una redirección de Server Action
      const referer = request.headers.get("referer")
      const isFromServerAction =
        request.headers.get("next-action") || request.headers.get("content-type")?.includes("multipart/form-data")

      console.log(
        `Middleware: Usuario autenticado en ${request.nextUrl.pathname}, referer: ${referer}, isFromServerAction: ${isFromServerAction}`,
      )

      // Solo redirigir si NO viene de una Server Action
      if (!isFromServerAction) {
        console.log("Middleware: Redirigiendo usuario autenticado a /dashboard")
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    return response
  } catch (error) {
    console.error("Middleware: Error al verificar usuario:", error)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     * - auth callback
     */
    "/((?!_next/static|_next/image|favicon.ico|api|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
