"use client"

import * as React from "react"
import {
  Heart,
  Brain,
  Calendar,
  BarChart3,
  Settings2,
  User,
  BookOpen,
  Target,
  Moon,
  Sun,
  Users,
  Receipt,
  FileText,
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

// Datos personalizados para FeelRite
const data = {
  user: {
    name: "Usuario",
    email: "usuario@feelrite.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "FeelRite Personal",
      logo: Heart,
      plan: "Gratuito",
    },
    {
      name: "FeelRite Pro",
      logo: Brain,
      plan: "Premium",
    },
    {
      name: "FeelRite Family",
      logo: User,
      plan: "Familiar",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Resumen",
          url: "/",
        },
        {
          title: "Progreso",
          url: "/progress",
        },
        {
          title: "Metas",
          url: "/goals",
        },
      ],
    },
                     {
           title: "Pacientes",
           url: "/patients",
           icon: Users,
         },
    {
      title: "Facturación",
      url: "/billing",
      icon: Receipt,
      items: [
        {
          title: "Facturas",
          url: "/billing/invoices",
        },
        {
          title: "Gastos",
          url: "/billing/expenses",
        },
      ],
    },
    {
      title: "Calendario",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Recursos",
      url: "/resources",
      icon: BookOpen,
      items: [
        {
          title: "Artículos",
          url: "/resources/articles",
        },
        {
          title: "Videos",
          url: "/resources/videos",
        },
        {
          title: "Podcasts",
          url: "/resources/podcasts",
        },
      ],
    },
    {
      title: "Configuración",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Perfil",
          url: "/settings/profile",
        },
        {
          title: "Notificaciones",
          url: "/settings/notifications",
        },
        {
          title: "Privacidad",
          url: "/settings/privacy",
        },
        {
          title: "Consentimientos",
          url: "/settings/consents",
        },
        {
          title: "Tarifas",
          url: "/settings/tariffs",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Metas Personales",
      url: "/goals/personal",
      icon: Target,
    },
    {
      name: "Hábitos Saludables",
      url: "/habits",
      icon: Sun,
    },
    {
      name: "Sueño",
      url: "/sleep",
      icon: Moon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
