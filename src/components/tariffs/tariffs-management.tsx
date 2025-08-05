"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ServiceList } from "./service-list"
import { ServiceForm } from "./service-form"
import { SelectDefaultServiceDialog } from "./select-default-service-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export type Service = {
  id: string
  name: string
  finalPrice: number // PVP que introduce el usuario
  taxType: 'exempt' | 'general' // Exento o IVA 21%
  basePrice: number // Calculado automáticamente
  taxAmount: number // Calculado automáticamente
  isDefault: boolean
}

// Datos de ejemplo para visualizar el desarrollo
const initialServices: Service[] = [
  {
    id: "1",
    name: "Sesión de Terapia Individual",
    finalPrice: 60,
    taxType: "exempt",
    basePrice: 60,
    taxAmount: 0,
    isDefault: true,
  },
  {
    id: "2",
    name: "Sesión de Terapia de Pareja",
    finalPrice: 80,
    taxType: "exempt",
    basePrice: 80,
    taxAmount: 0,
    isDefault: false,
  },
  {
    id: "3",
    name: "Informe Psicológico",
    finalPrice: 150,
    taxType: "general",
    basePrice: 123.97,
    taxAmount: 26.03,
    isDefault: false,
  },
]

export function TariffsManagement() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isSelectDefaultOpen, setIsSelectDefaultOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)

  const handleAddService = () => {
    setEditingService(null)
    setIsFormOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setIsFormOpen(true)
  }

  const handleDeleteService = (serviceId: string) => {
    const serviceToDelete = services.find(s => s.id === serviceId)
    
    // Si el servicio a borrar es el por defecto, mostrar diálogo de selección
    if (serviceToDelete?.isDefault) {
      setServiceToDelete(serviceId)
      setIsSelectDefaultOpen(true)
    } else {
      // Borrar directamente si no es el por defecto
      setServices(services.filter(service => service.id !== serviceId))
    }
  }

  const handleSelectNewDefault = (newDefaultServiceId: string) => {
    if (serviceToDelete) {
      // Actualizar el servicio seleccionado como por defecto y borrar el original
      const updatedServices = services.map(s => ({
        ...s,
        isDefault: s.id === newDefaultServiceId
      })).filter(s => s.id !== serviceToDelete)
      
      setServices(updatedServices)
      setServiceToDelete(null)
    }
  }

  const handleCancelDefaultSelection = () => {
    setServiceToDelete(null)
  }

  const handleSaveService = (service: Omit<Service, 'id'>) => {
    if (editingService) {
      // Actualizar servicio existente
      let updatedServices = services.map(s => 
        s.id === editingService.id 
          ? { ...service, id: editingService.id }
          : service.isDefault ? { ...s, isDefault: false } : s
      )
      
      // Si el servicio editado es por defecto, moverlo al principio
      if (service.isDefault) {
        const defaultService = updatedServices.find(s => s.id === editingService.id)!
        const otherServices = updatedServices.filter(s => s.id !== editingService.id)
        updatedServices = [defaultService, ...otherServices]
      }
      
      setServices(updatedServices)
    } else {
      // Crear nuevo servicio
      const newService: Service = {
        ...service,
        id: Date.now().toString(),
      }
      
      if (service.isDefault) {
        // Si el nuevo servicio es por defecto, quitar el flag de los demás y ponerlo primero
        const updatedServices = services.map(s => ({ ...s, isDefault: false }))
        setServices([newService, ...updatedServices])
      } else {
        setServices([...services, newService])
      }
    }
    setIsFormOpen(false)
    setEditingService(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Servicios y Tarifas
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus servicios y precios de forma inteligente
          </p>
        </div>
        <Button onClick={handleAddService}>
          <Plus className="mr-2 h-4 w-4" />
          Servicio
        </Button>
      </div>

      <ServiceList
        services={services}
        onEdit={handleEditService}
        onDelete={handleDeleteService}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Editar Servicio" : "Nuevo Servicio"}
            </DialogTitle>
          </DialogHeader>
          <ServiceForm
            service={editingService}
            onSave={handleSaveService}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingService(null)
            }}
          />
        </DialogContent>
      </Dialog>

      <SelectDefaultServiceDialog
        open={isSelectDefaultOpen}
        onOpenChange={setIsSelectDefaultOpen}
        services={services.filter(s => s.id !== serviceToDelete)}
        onSelectDefault={handleSelectNewDefault}
        onCancel={handleCancelDefaultSelection}
      />
    </div>
  )
} 