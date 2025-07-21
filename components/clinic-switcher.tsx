"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Building2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function ClinicSwitcher({
  clinics,
}: {
  clinics: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeClinic, setActiveClinic] = React.useState(clinics[0])

  if (!activeClinic) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div 
                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground group-data-[state=collapsed]:size-10"
                style={{
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--sidebar-primary)',
                  color: 'var(--sidebar-primary-foreground)',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: 'var(--letter-spacing)',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <activeClinic.logo 
                  className="size-4 group-data-[state=collapsed]:size-5" 
                  style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--letter-spacing)'
                  }}
                />
              </div>
              <div 
                className="grid flex-1 text-left text-sm leading-tight group-data-[state=collapsed]:hidden"
                style={{
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: 'var(--letter-spacing)'
                }}
              >
                <span 
                  className="truncate font-semibold"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--letter-spacing)',
                    fontWeight: '600'
                  }}
                >
                  {activeClinic.name}
                </span>
                <span 
                  className="truncate text-xs"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--letter-spacing)'
                  }}
                >
                  {activeClinic.plan}
                </span>
              </div>
              <ChevronsUpDown 
                className="ml-auto group-data-[state=collapsed]:hidden" 
                style={{
                  marginLeft: 'auto',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: 'var(--letter-spacing)',
                  transition: 'all 0.2s ease'
                }}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
            style={{
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-sans)',
              letterSpacing: 'var(--letter-spacing)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)'
            }}
          >
            <DropdownMenuLabel 
              className="text-xs text-muted-foreground"
              style={{
                fontFamily: 'var(--font-sans)',
                letterSpacing: 'var(--letter-spacing)',
                color: 'var(--muted-foreground)'
              }}
            >
              Consultorios
            </DropdownMenuLabel>
            {clinics.map((clinic, index) => (
              <DropdownMenuItem
                key={clinic.name}
                onClick={() => setActiveClinic(clinic)}
                className="gap-2 p-2"
                style={{
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: 'var(--letter-spacing)',
                  transition: 'all 0.2s ease',
                  gap: 'calc(var(--spacing) * 2)',
                  padding: 'var(--spacing)'
                }}
              >
                <div 
                  className="flex size-6 items-center justify-center rounded-sm border"
                  style={{
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--letter-spacing)'
                  }}
                >
                  <clinic.logo 
                    className="size-4 shrink-0" 
                    style={{
                      fontFamily: 'var(--font-sans)',
                      letterSpacing: 'var(--letter-spacing)'
                    }}
                  />
                </div>
                <span style={{
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: 'var(--letter-spacing)'
                }}>
                  {clinic.name}
                </span>
                <DropdownMenuShortcut
                  style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--tracking-widest)',
                    color: 'var(--muted-foreground)'
                  }}
                >
                  ⌘{index + 1}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator 
              style={{
                backgroundColor: 'var(--border)',
                margin: 'var(--spacing) 0'
              }}
            />
            <DropdownMenuItem 
              className="gap-2 p-2"
              style={{
                fontFamily: 'var(--font-sans)',
                letterSpacing: 'var(--letter-spacing)',
                transition: 'all 0.2s ease',
                gap: 'calc(var(--spacing) * 2)',
                padding: 'var(--spacing)'
              }}
            >
              <div 
                className="flex size-6 items-center justify-center rounded-md border bg-background"
                style={{
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: 'var(--letter-spacing)'
                }}
              >
                <Plus 
                  className="size-4" 
                  style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: 'var(--letter-spacing)'
                  }}
                />
              </div>
              <div 
                className="font-medium text-muted-foreground"
                style={{
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: 'var(--letter-spacing)',
                  color: 'var(--muted-foreground)'
                }}
              >
                Agregar consultorio
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
} 