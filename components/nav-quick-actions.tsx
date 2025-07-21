"use client"

import {
  Calendar,
  FileText,
  MoreHorizontal,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function NavQuickActions({
  actions,
}: {
  actions: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[state=collapsed]:hidden">
      <SidebarGroupLabel>Acciones Rápidas</SidebarGroupLabel>
      <SidebarMenu>
        {actions.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon 
                  className="group-data-[state=collapsed]:size-4"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--letter-spacing)'
                  }}
                />
                <span className="group-data-[state=collapsed]:hidden" style={{
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: 'var(--letter-spacing)'
                }}>
                  {item.name}
                </span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">Más opciones</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
                style={{
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: 'var(--letter-spacing)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)'
                }}
              >
                <DropdownMenuItem
                  style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--letter-spacing)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Plus 
                    className="text-muted-foreground" 
                    style={{
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: 'var(--letter-spacing)'
                    }}
                  />
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--letter-spacing)'
                  }}>
                    Crear Nuevo
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--letter-spacing)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FileText 
                    className="text-muted-foreground" 
                    style={{
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: 'var(--letter-spacing)'
                    }}
                  />
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--letter-spacing)'
                  }}>
                    Ver Detalles
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator 
                  style={{
                    backgroundColor: 'var(--border)',
                    margin: 'var(--spacing) 0'
                  }}
                />
                <DropdownMenuItem
                  style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--letter-spacing)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Calendar 
                    className="text-muted-foreground" 
                    style={{
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: 'var(--letter-spacing)'
                    }}
                  />
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--letter-spacing)'
                  }}>
                    Programar
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal 
              className="text-sidebar-foreground/70 group-data-[state=collapsed]:size-4" 
              style={{
                fontFamily: 'var(--font-sans)',
                letterSpacing: 'var(--letter-spacing)'
              }}
            />
            <span className="group-data-[state=collapsed]:hidden" style={{
              fontFamily: 'var(--font-sans)',
              letterSpacing: 'var(--letter-spacing)'
            }}>
              Más herramientas
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
} 