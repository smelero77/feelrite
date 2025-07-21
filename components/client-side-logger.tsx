"use client"

import { useEffect } from "react"

interface ClientSideLoggerProps {
  componentName: string
}

export function ClientSideLogger({ componentName }: ClientSideLoggerProps) {
  useEffect(() => {
    console.log(`DEBUG: Componente '${componentName}' montado en el cliente.`)
  }, [componentName])
  return null
}
