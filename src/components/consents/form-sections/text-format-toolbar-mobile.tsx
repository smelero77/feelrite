"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered
} from "lucide-react"

interface TextFormat {
  bold: boolean
  italic: boolean
  underline: boolean
  list: boolean
  listOrdered: boolean
  align: 'left' | 'center' | 'right'
}

interface TextFormatToolbarMobileProps {
  format: TextFormat
  onFormatChange: (format: TextFormat) => void
  onApplyFormat?: (command: string, value?: string) => void
  className?: string
}

export function TextFormatToolbarMobile({ format, onFormatChange, onApplyFormat, className }: TextFormatToolbarMobileProps) {
  const toggleFormat = (key: keyof TextFormat) => {
    onFormatChange({
      ...format,
      [key]: !format[key]
    })
  }

  const handleFormatClick = (command: string) => {
    // Si tenemos la función de aplicación de formato, la usamos
    if (onApplyFormat) {
      onApplyFormat(command)
    } else {
      // Fallback al comportamiento anterior
      switch (command) {
        case 'bold':
          toggleFormat('bold')
          break
        case 'italic':
          toggleFormat('italic')
          break
        case 'underline':
          toggleFormat('underline')
          break
        case 'insertUnorderedList':
          toggleFormat('list')
          break
        case 'insertOrderedList':
          toggleFormat('listOrdered')
          break
      }
    }
  }

  return (
    <div className={`flex items-center gap-1 p-2 border rounded-lg bg-muted/30 overflow-x-auto ${className}`}>
      {/* Formato básico */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant={format.bold ? "default" : "ghost"}
          size="sm"
          onClick={() => handleFormatClick('bold')}
          className="h-8 w-8 p-0"
          title="Negrita"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={format.italic ? "default" : "ghost"}
          size="sm"
          onClick={() => handleFormatClick('italic')}
          className="h-8 w-8 p-0"
          title="Cursiva"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={format.underline ? "default" : "ghost"}
          size="sm"
          onClick={() => handleFormatClick('underline')}
          className="h-8 w-8 p-0"
          title="Subrayado"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* Listas */}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant={format.list ? "default" : "ghost"}
          size="sm"
          onClick={() => handleFormatClick('insertUnorderedList')}
          className="h-8 w-8 p-0"
          title="Lista con viñetas"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={format.listOrdered ? "default" : "ghost"}
          size="sm"
          onClick={() => handleFormatClick('insertOrderedList')}
          className="h-8 w-8 p-0"
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 