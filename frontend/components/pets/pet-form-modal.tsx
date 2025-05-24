"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { clienteService } from "@/lib/clienteService"
import { Cliente } from "@/lib/clienteService"

interface Pet {
  id?: number
  nome: string
  especie: string
  raca: string
  idade: number
  peso: number
  clienteId: number
}

interface PetFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (pet: any) => void
  pet?: Pet
}

export function PetFormModal({ isOpen, onClose, onSave, pet }: PetFormModalProps) {
  const isEditing = !!pet?.id

  const [formData, setFormData] = useState({
    nome: pet?.nome || "",
    especie: pet?.especie || "",
    raca: pet?.raca || "",
    idade: pet?.idade || 0,
    peso: pet?.peso || 0,
    clienteId: pet?.clienteId || 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const [clientes, setClientes] = useState<Cliente[]>([])

  // Fetch clients when the modal opens
  useEffect(() => {
    async function fetchClientes() {
      if (!isOpen) return;

      try {
        const clientesData = await clienteService.list();
        setClientes(clientesData);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    }

    fetchClientes();
  }, [isOpen]);

  useEffect(() => {
      setFormData({
        nome: pet?.nome || "",
        especie: pet?.especie || "",
        raca: pet?.raca || "",
        idade: pet?.idade || 0,
        peso: pet?.peso || 0,
        clienteId: pet?.clienteId || 0,
      });
  }, [pet]);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpar erro quando o campo é alterado
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }))

    validateField(field, formData[field as keyof typeof formData])
  }

  const validateField = (field: string, value: string | number) => {
    let error = ""

    switch (field) {
      case "nome":
        if (!value) error = "Nome é obrigatório"
        break
      case "especie":
        if (!value) error = "Espécie é obrigatória"
        break
      case "raca":
        if (!value) error = "Raça é obrigatória"
        break
      case "idade":
        if (Number(value) <= 0) error = "Idade deve ser maior que zero"
        break
      case "peso":
        if (Number(value) <= 0) error = "Peso deve ser maior que zero"
        break
      default:
        break
    }

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }))
      return false
    }

    return true
  }

  const validateForm = () => {
    const requiredFields = ["nome", "especie", "raca", "idade", "peso"]
    let isValid = true

    // Marcar todos os campos obrigatórios como tocados
    const allTouched = requiredFields.reduce(
      (acc, key) => {
        acc[key] = true
        return acc
      },
      {} as Record<string, boolean>,
    )

    setTouched((prev) => ({ ...prev, ...allTouched }))

    // Validar cada campo obrigatório
    requiredFields.forEach((field) => {
      if (!validateField(field, formData[field as keyof typeof formData])) {
        isValid = false
      }
    })

    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const newPet = {
      ...formData,
      id: pet?.id,
    }

    onSave(newPet)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Pet" : "Novo Pet"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome" className={errors.nome && touched.nome ? "text-red-500" : ""}>
                Nome*
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                onBlur={() => handleBlur("nome")}
                placeholder="Nome do pet"
                className={cn(errors.nome && touched.nome ? "border-red-500 focus-visible:ring-red-500" : "")}
              />
              {errors.nome && touched.nome && <p className="text-xs text-red-500">{errors.nome}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="especie" className={errors.especie && touched.especie ? "text-red-500" : ""}>
                Espécie*
              </Label>
              <Input
                id="especie"
                value={formData.especie}
                onChange={(e) => handleChange("especie", e.target.value)}
                onBlur={() => handleBlur("especie")}
                placeholder="Espécie do pet"
                className={cn(errors.especie && touched.especie ? "border-red-500 focus-visible:ring-red-500" : "")}
              />
              {errors.especie && touched.especie && <p className="text-xs text-red-500">{errors.especie}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="raca" className={errors.raca && touched.raca ? "text-red-500" : ""}>
                Raça*
              </Label>
              <Input
                id="raca"
                value={formData.raca}
                onChange={(e) => handleChange("raca", e.target.value)}
                onBlur={() => handleBlur("raca")}
                placeholder="Raça do pet"
                className={cn(errors.raca && touched.raca ? "border-red-500 focus-visible:ring-red-500" : "")}
              />
              {errors.raca && touched.raca && <p className="text-xs text-red-500">{errors.raca}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="idade" className={errors.idade && touched.idade ? "text-red-500" : ""}>
                Idade*
              </Label>
              <Input
                id="idade"
                type="number"
                value={formData.idade}
                onChange={(e) => handleChange("idade", Number(e.target.value))}
                onBlur={() => handleBlur("idade")}
                placeholder="Idade do pet"
                className={cn(errors.idade && touched.idade ? "border-red-500 focus-visible:ring-red-500" : "")}
              />
              {errors.idade && touched.idade && <p className="text-xs text-red-500">{errors.idade}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="peso" className={errors.peso && touched.peso ? "text-red-500" : ""}>
                Peso*
              </Label>
              <Input
                id="peso"
                type="number"
                value={formData.peso}
                onChange={(e) => handleChange("peso", Number(e.target.value))}
                onBlur={() => handleBlur("peso")}
                placeholder="Peso do pet"
                className={cn(errors.peso && touched.peso ? "border-red-500 focus-visible:ring-red-500" : "")}
              />
              {errors.peso && touched.peso && <p className="text-xs text-red-500">{errors.peso}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="clienteId" className={errors.clienteId && touched.clienteId ? "text-red-500" : ""}>
                Cliente*
              </Label>
              <Select
                value={String(formData.clienteId)}
                onValueChange={(value) => handleChange("clienteId", Number(value))}
                onOpenChange={() => handleBlur("clienteId")}
              >
                <SelectTrigger
                  id="clienteId"
                  className={cn(errors.clienteId && touched.clienteId ? "border-red-500 focus-visible:ring-red-500" : "")}
                >
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={String(cliente.id)}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clienteId && touched.clienteId && <p className="text-xs text-red-500">{errors.clienteId}</p>}
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gray-900 text-white hover:bg-gray-800">
              {isEditing ? "Salvar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 