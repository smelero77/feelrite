import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner" // Importar Toaster de sonner
import { NavigationDebugger } from "@/components/navigation-debugger" // Importar el debugger

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "feelrait",
  description: "Plataforma de gestión para psicólogos",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-right" /> {/* Añadir el componente Toaster */}
          <NavigationDebugger /> {/* Añadir el debugger de navegación */}
        </ThemeProvider>
      </body>
    </html>
  )
}
