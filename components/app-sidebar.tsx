"use client"

import * as React from "react"
import {
  Calendar,
  CalendarDays,
  FileText,
  Home,
  Receipt,
  Users,
  Building2,
  UserPlus,
  Clock,
  Stethoscope,
  Heart,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Datos específicos del consultorio médico
const data = {
  user: {
    name: "Dr. Juan Pérez",
    email: "doctor@feelrite.com",
    avatar: "/placeholder-user.jpg",
  },
  teams: [
    {
      name: "Mi Consultorio",
      logo: Building2,
      plan: "Plan Profesional",
    },
    {
      name: "Clínica Central",
      logo: Heart,
      plan: "Plan Enterprise",
    },
    {
      name: "Centro Médico",
      logo: Stethoscope,
      plan: "Plan Básico",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Resumen",
          url: "/dashboard",
        },
        {
          title: "Estadísticas",
          url: "/dashboard/stats",
        },
        {
          title: "Configuración",
          url: "/dashboard/settings",
        },
      ],
    },
    {
      title: "Pacientes",
      url: "/dashboard/patients",
      icon: Users,
      items: [
        {
          title: "Ver Todos",
          url: "/dashboard/patients",
        },
        {
          title: "Nuevo Paciente",
          url: "/dashboard/patients/new-patient-profile-display",
        },
        {
          title: "Historiales",
          url: "/dashboard/patients/histories",
        },
        {
          title: "Búsqueda",
          url: "/dashboard/patients/search",
        },
      ],
    },
    {
      title: "Citas",
      url: "/dashboard/appointments",
      icon: Calendar,
      items: [
        {
          title: "Calendario",
          url: "/dashboard/calendar",
        },
        {
          title: "Lista de Citas",
          url: "/dashboard/appointments",
        },
        {
          title: "Nueva Cita",
          url: "/dashboard/appointments/new",
        },
        {
          title: "Citas Pendientes",
          url: "/dashboard/appointments/pending",
        },
      ],
    },
    {
      title: "Facturas",
      url: "/dashboard/invoices",
      icon: Receipt,
      items: [
        {
          title: "Ver Todas",
          url: "/dashboard/invoices",
        },
        {
          title: "Nueva Factura",
          url: "/dashboard/invoices/new",
        },
        {
          title: "Pendientes",
          url: "/dashboard/invoices/pending",
        },
        {
          title: "Pagadas",
          url: "/dashboard/invoices/paid",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Acciones Rápidas",
      url: "/dashboard/quick-actions",
      icon: Clock,
    },
    {
      name: "Nueva Cita",
      url: "/dashboard/appointments/new",
      icon: CalendarDays,
    },
    {
      name: "Nuevo Paciente",
      url: "/dashboard/patients/new-patient-profile-display",
      icon: UserPlus,
    },
    {
      name: "Nueva Factura",
      url: "/dashboard/invoices/new",
      icon: FileText,
    },
  ],
}

export function AppSidebar({ 
  user,
  ...props 
}: {
  user?: {
    name: string
    email: string
    avatar?: string
  }
} & React.ComponentProps<typeof Sidebar>) {
  // Usar el usuario pasado como prop o el de ejemplo
  const sidebarUser = user ? {
    ...user,
    avatar: user.avatar || "/placeholder-user.jpg"
  } : data.user;
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
