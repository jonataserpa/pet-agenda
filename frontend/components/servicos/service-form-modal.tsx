import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Servico {
  id?: number
  nome: string
  preco: number
  descricao: string
}

interface ServiceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (servico: any) => void
  servico?: Servico
}

export function ServiceFormModal({ isOpen, onClose, onSave, servico }: ServiceFormModalProps) {
  const isEditing = !!servico?.id

  const [formData, setFormData] = useState({
    nome: servico?.nome || "",
    preco: servico?.preco || 0,
    descricao: servico?.descricao || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
      setFormData({
        nome: servico?.nome || "",
        preco: servico?.preco || 0,
        descricao: servico?.descricao || "",
      })
  }, [servico])
  
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
      case "preco":
        if (Number(value) <= 0) error = "Preço deve ser maior que zero"
        break
      case "descricao":
        if (!value) error = "Descrição é obrigatória"
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
    const requiredFields = ["nome", "preco", "descricao"]
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

    const newServico = {
      ...formData,
      id: servico?.id,
    }

    onSave(newServico)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
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
                placeholder="Nome do serviço"
                className={cn(errors.nome && touched.nome ? "border-red-500 focus-visible:ring-red-500" : "")}
              />
              {errors.nome && touched.nome && <p className="text-xs text-red-500">{errors.nome}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="preco" className={errors.preco && touched.preco ? "text-red-500" : ""}>
                Preço*
              </Label>
              <Input
                id="preco"
                type="number"
                value={formData.preco}
                onChange={(e) => handleChange("preco", Number(e.target.value))}
                onBlur={() => handleBlur("preco")}
                placeholder="Preço do serviço"
                className={cn(errors.preco && touched.preco ? "border-red-500 focus-visible:ring-red-500" : "")}
              />
              {errors.preco && touched.preco && <p className="text-xs text-red-500">{errors.preco}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descricao" className={errors.descricao && touched.descricao ? "text-red-500" : ""}>
                Descrição*
              </Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleChange("descricao", e.target.value)}
                onBlur={() => handleBlur("descricao")}
                placeholder="Descrição do serviço"
                className={cn(errors.descricao && touched.descricao ? "border-red-500 focus-visible:ring-red-500" : "")}
              />
              {errors.descricao && touched.descricao && <p className="text-xs text-red-500">{errors.descricao}</p>}
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