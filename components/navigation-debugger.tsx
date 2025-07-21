"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function NavigationDebugger() {
  const pathname = usePathname()

  useEffect(() => {
    console.log(`DEBUG: Navegación a ${pathname} completada`)
  }, [pathname])

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log(`DEBUG: Saliendo de ${pathname}`)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [pathname])

  return null
}
