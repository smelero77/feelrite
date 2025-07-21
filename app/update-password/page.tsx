"use client"

import { useActionState } from "react"
import type React from "react"
import { updatePassword } from "@/app/auth/actions"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"

export default function UpdatePasswordPage() {
  const [state, formAction, isPending] = useActionState(updatePassword, { success: false, message: "" })
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Éxito" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
    }
  }, [state])

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {}

    // Validación de contraseña
    if (!password) {
      newErrors.password = "La nueva contraseña es requerida."
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres."
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "La contraseña debe contener al menos una mayúscula."
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "La contraseña debe contener al menos una minúscula."
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "La contraseña debe contener al menos un número."
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = "La contraseña debe contener al menos un carácter especial."
    }

    // Validación de confirmación de contraseña
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu nueva contraseña."
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (validateForm()) {
      const formData = new FormData(event.currentTarget)
      formAction(formData)
    } else {
      toast({
        title: "Error de validación",
        description: "Por favor, corrige los errores en el formulario.",
        variant: "destructive",
      })
    }
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

      {/* Columna derecha (Formulario de actualización de contraseña) */}
      <div className="flex flex-1 lg:w-3/5 bg-white items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-primary-text mb-2 text-center">Establecer Nueva Contraseña</h2>
          <p className="text-secondary-text mb-8 text-center">Introduce tu nueva contraseña.</p>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-primary-text">
                Nueva Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                className={`border-border-light focus:border-primary-blue focus:ring-0 ${errors.password ? "border-red-500" : ""}`}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrors((prev) => ({ ...prev, password: undefined }))
                }}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password" className="text-primary-text">
                Confirmar Nueva Contraseña
              </Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                className={`border-border-light focus:border-primary-blue focus:ring-0 ${errors.confirmPassword ? "border-red-500" : ""}`}
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                }}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            <Button
              type="submit"
              className="w-full rounded-full bg-primary-blue text-white hover:bg-primary-blue/90"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Actualizando...
                </>
              ) : (
                "Actualizar Contraseña"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
