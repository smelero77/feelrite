import type React from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ClientSideLogger } from "@/components/client-side-logger"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient()

  // Obtener la sesión del usuario
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("DEBUG: Usuario en DashboardLayout (Server):", user ? user.email : "No autenticado")

  // Si no hay usuario, redirigir a la página de inicio de sesión
  if (!user) {
    redirect("/login")
  }

  // Preparar datos del usuario para el sidebar
  const userData = {
    name: user.email?.split('@')[0] || "Usuario", // Usar el nombre antes del @ como nombre temporal
    email: user.email || "",
    avatar: user.user_metadata?.avatar_url || undefined,
  }

  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    feelrait Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Panel de Control</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </main>
        <ClientSideLogger componentName="DashboardLayout" />
      </SidebarInset>
    </SidebarProvider>
  )
}
