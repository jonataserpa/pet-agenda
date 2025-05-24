"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { clientService } from "@/lib/clientService"

interface ClientFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (client: any) => void
  client?: {
    id?: string
    nome: string
    email: string
    telefone: string
    status: string
    pets?: []
    observacao?: string
    avatar?: string
  }
}

export function ClientFormModal({ isOpen, onClose, onSave, client }: ClientFormModalProps) {
  const isEditing = !!client?.id

  const [formData, setFormData] = useState({
    nome: client?.nome || "",
    email: client?.email || "",
    telefone: client?.telefone || "",
    status: client?.status || "Ativo",
    pets: [],
    observacao: client?.observacao || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setFormData({
      nome: client?.nome || "",
      email: client?.email || "",
      telefone: client?.telefone || "",
      status: client?.status || "Ativo",
      pets: client?.pets || [],
      observacao: client?.observacao || "",
    })
  }, [client])

  const handleChange = (field: string, value: string) => {
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

    const value = formData[field as keyof typeof formData]
    if (typeof value === 'string') {
      validateField(field, value)
    }
  }

  const validateField = (field: string, value: string | never[]) => {
    let error = ""

    // Convert value to string if it's an array
    const stringValue = Array.isArray(value) ? value.join('') : value;

    switch (field) {
      case "nome":
        if (!stringValue.trim()) error = "Nome é obrigatório"
        break
      case "email":
        if (!stringValue.trim()) {
          error = "Email é obrigatório"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)) {
          error = "Email inválido"
        }
        break
      case "telefone":
        if (!stringValue.trim()) error = "Telefone é obrigatório"
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
    const requiredFields = ["nome", "email", "telefone"]
    let isValid = true

    // Marcar todos os campos obrigatórios como tocados
    const allTouched = requiredFields.reduce(
      (acc, key) => {
        acc[key] = true
        return acc
      },
      {} as Record<string, boolean>,
    )

    setTouched(allTouched)

    // Validar cada campo obrigatório
    requiredFields.forEach((field) => {
      if (!validateField(field, formData[field as keyof typeof formData])) {
        isValid = false
      }
    })

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const newClient = {
      ...formData,
      id: client?.id || undefined,
      // avatar: client?.avatar || "/placeholder.svg",
    }

    try {
      const savedClient = await clientService.save(newClient)
      onSave(savedClient)
      onClose()
    } catch (error) {
      // TODO: adicionar tratamento de erro
      console.error(error)
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "")

    // Aplica a formatação
    if (numbers.length <= 2) {
      return `(${numbers}`
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value)
    handleChange("telefone", formattedValue)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Cliente" : "Cadastro de Cliente"}</DialogTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
          </Button>
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
                className={cn(errors.nome && touched.nome ? "border-red-500 focus-visible:ring-red-500" : "")}
                required
              />
              {errors.nome && touched.nome && <p className="text-xs text-red-500">{errors.nome}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className={errors.email && touched.email ? "text-red-500" : ""}>
                Email*
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={cn(errors.email && touched.email ? "border-red-500 focus-visible:ring-red-500" : "")}
                required
              />
              {errors.email && touched.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="telefone" className={errors.telefone && touched.telefone ? "text-red-500" : ""}>
                Telefone*
              </Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={handlePhoneChange}
                onBlur={() => handleBlur("telefone")}
                placeholder="(00) 00000-0000"
                className={cn(errors.telefone && touched.telefone ? "border-red-500 focus-visible:ring-red-500" : "")}
                required
              />
              {errors.telefone && touched.telefone && <p className="text-xs text-red-500">{errors.telefone}</p>}
            </div>

            {/* <div className="grid gap-2">
              <Label htmlFor="petName" className={errors.petName && touched.petName ? "text-red-500" : ""}>
                Nome do Pet*
              </Label>
              <Input
                id="petName"
                value={formData.petName}
                onChange={(e) => handleChange("petName", e.target.value)}
                onBlur={() => handleBlur("petName")}
                className={cn(errors.petName && touched.petName ? "border-red-500 focus-visible:ring-red-500" : "")}
                required
              />
              {errors.petName && touched.petName && <p className="text-xs text-red-500">{errors.petName}</p>}
            </div> */}

            <div className="grid gap-2">
              <Label htmlFor="status">Status*</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)} required>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observacao">Observações</Label>
              <Textarea
                id="observacao"
                value={formData.observacao}
                onChange={(e) => handleChange("observacao", e.target.value)}
                placeholder="Informações adicionais sobre o cliente ou pet"
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
