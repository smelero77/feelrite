"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, Save } from "lucide-react"
import { useRouter } from "next/navigation"

interface MobileNavProps {
  title: string
  onSave?: () => void
  showBack?: boolean
}

export default function MobileNav({ title, onSave, showBack = true }: MobileNavProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-2">
        {showBack && (
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      {onSave && (
        <Button size="sm" onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Guardar
        </Button>
      )}
    </div>
  )
} 