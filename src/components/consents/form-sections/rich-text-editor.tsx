"use client"

import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface TextFormat {
  bold: boolean
  italic: boolean
  underline: boolean
  list: boolean
  listOrdered: boolean
  align: 'left' | 'center' | 'right'
}

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  format: TextFormat
  onFormatChange: (format: TextFormat) => void
  placeholder?: string
  className?: string
  rows?: number
}

export interface RichTextEditorRef {
  applyFormat: (command: string, value?: string) => void
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(({ 
  value, 
  onChange, 
  format, 
  onFormatChange, 
  placeholder, 
  className,
  rows = 8 
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [internalValue, setInternalValue] = useState(value)

  // Sincronizar el valor interno con el valor externo
  useEffect(() => {
    if (editorRef.current && value !== internalValue) {
      // Guardar la posición del cursor
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)
      const cursorPosition = range?.startOffset || 0
      
      // Actualizar el contenido
      editorRef.current.innerHTML = value
      setInternalValue(value)
      
      // Restaurar la posición del cursor al final
      if (selection && editorRef.current) {
        const newRange = document.createRange()
        const textNode = editorRef.current.firstChild || editorRef.current
        newRange.setStart(textNode, Math.min(cursorPosition, textNode.textContent?.length || 0))
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    }
  }, [value])

  // Exponer la función de aplicación de formato
  useImperativeHandle(ref, () => ({
    applyFormat: (command: string, value?: string) => {
      if (editorRef.current) {
        editorRef.current.focus()
        
        // Si no hay selección, seleccionar todo el contenido
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0) {
          const range = document.createRange()
          range.selectNodeContents(editorRef.current)
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
        
        // Aplicar el comando
        const success = document.execCommand(command, false, value)
        
        if (success) {
          // Actualizar el estado de formato basado en el comando ejecutado
          const newFormat = { ...format }
          
          switch (command) {
            case 'bold':
              newFormat.bold = !newFormat.bold
              break
            case 'italic':
              newFormat.italic = !newFormat.italic
              break
            case 'underline':
              newFormat.underline = !newFormat.underline
              break
            case 'insertUnorderedList':
              newFormat.list = !newFormat.list
              newFormat.listOrdered = false
              break
            case 'insertOrderedList':
              newFormat.listOrdered = !newFormat.listOrdered
              newFormat.list = false
              break
            case 'justifyLeft':
              newFormat.align = 'left'
              break
            case 'justifyCenter':
              newFormat.align = 'center'
              break
            case 'justifyRight':
              newFormat.align = 'right'
              break
          }
          
          onFormatChange(newFormat)
          
          // Actualizar el valor interno
          if (editorRef.current) {
            const newValue = editorRef.current.innerHTML
            setInternalValue(newValue)
            onChange(newValue)
          }
        }
      }
    }
  }))

  // Manejar cambios en el contenido
  const handleInput = () => {
    if (editorRef.current) {
      const newValue = editorRef.current.innerHTML
      setInternalValue(newValue)
      onChange(newValue)
    }
  }

  // Manejar foco
  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  // Manejar clic para posicionar el cursor al final si no hay contenido
  const handleClick = () => {
    if (editorRef.current && !editorRef.current.textContent?.trim()) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false) // false = al final
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }

  return (
    <div
      ref={editorRef}
      contentEditable
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      className={cn(
        "min-h-[200px] p-3 border rounded-md bg-background text-sm",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "prose prose-sm max-w-none",
        isFocused ? "ring-2 ring-ring ring-offset-2" : "",
        "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none",
        className
      )}
      style={{ 
        minHeight: `${rows * 1.5}rem`,
        textAlign: format.align
      }}
      data-placeholder={placeholder}
    />
  )
})

RichTextEditor.displayName = "RichTextEditor" 