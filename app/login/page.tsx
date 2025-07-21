"use client"

import { useActionState } from "react"
import type React from "react"
import { signIn } from "@/app/auth/actions"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Google, Apple } from "@/components/icons"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, { success: false, message: "" })
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    console.log("DEBUG: LoginPage montado en el cliente")
  }, [])

  useEffect(() => {
    if (state.message) {
      console.log("DEBUG: Estado de signIn actualizado:", state)
      toast({
        title: state.success ? "Éxito" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
    }
  }, [state])

  useEffect(() => {
    const message = searchParams.get("message")
    if (message) {
      toast({
        title: "Información",
        description: message,
        variant: "default",
      })
    }
  }, [searchParams])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("DEBUG: Formulario de login enviado")

    if (!email || !password) {
      toast({
        title: "Error de validación",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData(event.currentTarget)
    console.log("DEBUG: Llamando a formAction...")
    formAction(formData)
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Columna izquierda (Marca) */}
      <div className="hidden lg:flex lg:w-2/5 bg-black flex-col justify-between p-8 text-white">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Image
            src="/placeholder.svg?height=32&width=32"
            alt="feelrait Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
          feelrait
        </div>
        <div className="flex flex-col items-center justify-center text-center px-8">
          <Avatar className="w-12 h-12 mb-4">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Ana García" />
            <AvatarFallback>AG</AvatarFallback>
          </Avatar>
          <p className="text-3xl font-serif italic mb-4 leading-relaxed">
            {
              "La forma en que esta herramienta ha transformado nuestro proceso de diseño es increíble. Es intuitiva y nos ahorra muchísimo tiempo."
            }
          </p>
          <p className="font-semibold text-lg">Ana García</p>
          <p className="text-secondary-text text-sm">Diseñadora UX Principal en PsicoSoluciones</p>
        </div>
        <div className="text-sm text-center text-secondary-text">
          © {new Date().getFullYear()} feelrait. Todos los derechos reservados.
        </div>
      </div>

      {/* Columna derecha (Formulario de inicio de sesión) */}
      <div className="flex flex-1 lg:w-3/5 bg-white items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-primary-text mb-2 text-center">Iniciar Sesión</h2>
          <p className="text-secondary-text mb-8 text-center">
            Accede para desbloquear contenido personalizado y mantenerte conectado con tu comunidad.
          </p>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-primary-text">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email o nombre de usuario"
                className="border-border-light focus:border-primary-blue focus:ring-0"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-primary-text">
                  Contraseña
                </Label>
                <Link href="/forgot-password" className="text-sm text-primary-blue hover:underline">
                  ¿Has olvidado tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                className="border-border-light focus:border-primary-blue focus:ring-0"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autocomplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-full bg-primary-blue text-white hover:bg-primary-blue/90"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border-light" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-secondary-text">O INICIA SESIÓN CON</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" className="rounded-full border-border-light hover:bg-gray-50 bg-transparent">
              <Github className="h-5 w-5" />
              <span className="sr-only">Iniciar sesión con GitHub</span>
            </Button>
            <Button variant="outline" className="rounded-full border-border-light hover:bg-gray-50 bg-transparent">
              <Google className="h-5 w-5" />
              <span className="sr-only">Iniciar sesión con Google</span>
            </Button>
            <Button variant="outline" className="rounded-full border-border-light hover:bg-gray-50 bg-transparent">
              <Apple className="h-5 w-5" />
              <span className="sr-only">Iniciar sesión con Apple</span>
            </Button>
          </div>

          <div className="mt-8 text-center text-sm text-primary-text">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-primary-blue hover:underline">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
