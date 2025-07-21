"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useActionState } from "react"
import { updateUserProfile } from "@/app/auth/actions"
import { getUserProfile } from "@/app/dashboard/actions" // Importar la acción para obtener el perfil

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string | null>(null)
  const [username, setUsername] = useState<string>("")
  const [website, setWebsite] = useState<string>("")
  const [state, formAction, isPending] = useActionState(updateUserProfile, { success: false, message: "" })

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      const result = await getUserProfile() // Llamar a la acción de servidor
      if (result.success && result.data) {
        setEmail(result.data.email || null)
        setUsername(result.data.username || "")
        setWebsite(result.data.website || "")
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo cargar el perfil.",
          variant: "destructive",
        })
      }
      setLoading(false)
    }

    loadProfile()
  }, [])

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Éxito" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
    }
  }, [state])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append("username", username)
    formData.append("website", website)
    formAction(formData)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
        <span className="ml-2 text-primary-text">Cargando perfil...</span>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-text">Mi Perfil</h1>

      <Card className="bg-white border border-border-light shadow-sm max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary-text">Información del Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-primary-text">
                Email
              </Label>
              <Input id="email" type="email" value={email || ""} disabled className="bg-gray-100 cursor-not-allowed" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-primary-text">
                Nombre de Usuario
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-border-light focus:border-primary-blue focus:ring-0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website" className="text-primary-text">
                Sitio Web
              </Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://tu-sitio.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="border-border-light focus:border-primary-blue focus:ring-0"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-full bg-primary-blue text-white hover:bg-primary-blue/90"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
