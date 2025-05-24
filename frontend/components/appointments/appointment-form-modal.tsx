"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { appointmentService } from "@/lib/appointmentService"
import { petService } from "@/lib/petService"
import { serviceService } from "@/lib/serviceService"
import { format } from "date-fns"

// Tipos
type Pet = {
  id: number;
  nome: string;
  especie: string;
  raca: string;
  idade: number;
  peso: number;
  clienteId: number;
};

type Service = {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
};

type Appointment = {
  id?: string;
  petId?: number;
  servicoId?: number;
  date?: string;
  time?: string;
  status?: string;
  // Adicionando campos que vêm do backend
  data?: string;
  observacao?: string;
  servicos?: Array<Service>;
  // Campos adicionais para exibição
  petName?: string;
  clientName?: string;
  serviceName?: string;
  servicePrice?: number;
};

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  appointment?: Appointment;
}

export function AppointmentFormModal({ isOpen, onClose, onSave, appointment }: AppointmentFormModalProps) {
  const isEditing = !!appointment?.id

  // Função para extrair a data do formato do backend
  const extractDate = (dateString?: string) => {
    if (!dateString) return ""

    try {
      // Se a string contém espaço, é um timestamp completo
      if (dateString.includes(' ')) {
        const date = new Date(dateString)
        return format(date, "yyyy-MM-dd")
      }
      // Se já é uma data no formato YYYY-MM-DD
      return dateString
    } catch (error) {
      console.error("Erro ao extrair data:", error)
      return ""
    }
  }

  // Função para extrair a hora do formato do backend
  const extractTime = (dateString?: string, timeString?: string) => {
    if (dateString && dateString.includes(' ')) {
      try {
        const date = new Date(dateString)
        return format(date, "HH:mm")
      } catch (error) {
        console.error("Erro ao extrair hora:", error)
        return timeString || ""
      }
    }
    return timeString || ""
  }

  const [formData, setFormData] = useState({
    petId: appointment?.petId ? String(appointment.petId) : "",
    servicoId: appointment?.servicoId ? String(appointment.servicoId) : "",
    date: extractDate(appointment?.date),
    time: extractTime(appointment?.date, appointment?.time),
    observacao: appointment?.observacao || "",
  })

  const [pets, setPets] = useState<Pet[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Buscar pets e serviços quando a modal abrir
  useEffect(() => {
    async function fetchData() {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        // Buscar lista de pets
        const petsData = await petService.list();
        setPets(petsData);

        // Buscar lista de serviços
        const servicesData = await serviceService.list();
        setServices(servicesData);
      } catch (error) {
        console.error("Erro ao buscar dados para o formulário:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [isOpen]);

  // Configuração inicial do formulário
  useEffect(() => {
    // Se estivermos editando, inicializamos com os dados do agendamento
    if (isEditing && appointment) {
      // Determinar o ID do serviço a ser selecionado:
      // 1. Se há serviços associados, use o primeiro
      // 2. Senão, se há um servicoId, use esse
      // 3. Senão, deixe vazio
      let selectedServiceId = "";

      if (appointment.servicos && appointment.servicos.length > 0) {
        // Temos uma lista de serviços associados
        selectedServiceId = String(appointment.servicos[0].id);
        console.log(`FormModal: Usando primeiro serviço da lista: ${selectedServiceId}`);
      } else if (appointment.servicoId) {
        // Temos um ID de serviço diretamente
        selectedServiceId = String(appointment.servicoId);
        console.log(`FormModal: Usando servicoId direto: ${selectedServiceId}`);
      }

      // Extrair data e hora do agendamento
      const extractedDate = extractDate(appointment.data || appointment.date);
      const extractedTime = extractTime(appointment.data || appointment.date, appointment.time);

      setFormData({
        petId: String(appointment.petId || ""),
        servicoId: selectedServiceId,
        date: extractedDate,
        time: extractedTime,
        observacao: appointment.observacao || appointment.observacao || "",
      });

      console.log("FormModal: Dados inicializados para edição:", {
        petId: String(appointment.petId || ""),
        servicoId: selectedServiceId,
        date: extractedDate,
        time: extractedTime,
        hasServicos: appointment.servicos ? appointment.servicos.length : 0
      });
    }
  }, [isEditing, appointment]);

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

    validateField(field, formData[field as keyof typeof formData])
  }

  const validateField = (field: string, value: string) => {
    let error = ""

    switch (field) {
      case "petId":
        if (!value) error = "Pet é obrigatório"
        break
      case "servicoId":
        if (!value) error = "Serviço é obrigatório"
        break
      case "date":
        if (!value) error = "Data é obrigatória"
        break
      case "time":
        if (!value) error = "Horário é obrigatório"
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
    const requiredFields = ["petId", "servicoId", "date", "time"]
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Encontrar o pet e serviço selecionados para detalhes adicionais
    const selectedPet = pets.find(pet => String(pet.id) === formData.petId);
    const selectedService = services.find(service => String(service.id) === formData.servicoId);

    // Preparar a data no formato esperado pelo backend - ISO 8601
    let dateTimeValue;

    // Verificar se precisamos criar um timestamp completo
    if (formData.date && formData.time) {
      // Formatar a data e hora para o backend
      const dateStr = formData.date; // YYYY-MM-DD
      const timeStr = formData.time; // HH:MM
      dateTimeValue = `${dateStr}T${timeStr}:00.000Z`;

      console.log("Data formatada para envio:", dateTimeValue);
    }

    // Construir o objeto de agendamento
    const newAppointment = {
      id: appointment?.id,
      petId: Number(formData.petId),
      data: dateTimeValue, // Usando 'data' como esperado pelo backend
      observacao: formData.observacao, // Mapeando notes para observacao caso o backend use esse campo
      status: appointment?.status || "AGENDADO", // Certificando-se de usar um status válido

      // Preservar os serviços existentes se estivermos editando
      servicos: appointment?.servicos || [],

      // Adicionar dados para exibição na tabela (não enviados ao backend)
      petName: selectedPet?.nome,
      clientName: selectedPet ? `Dono do ${selectedPet.nome}` : "",
      serviceName: selectedService?.nome,
      servicePrice: selectedService?.preco,
    }

    try {
      console.log("Enviando agendamento para o backend:", newAppointment);
      const savedAppointment = await appointmentService.save(newAppointment);

      // Se salvou com sucesso e temos um serviço selecionado, adicionar o serviço ao agendamento
      if (savedAppointment && savedAppointment.id && selectedService) {
        try {
          // Se estamos editando e já temos serviços, verificamos se precisamos adicionar
          let needToAddService = true;

          if (isEditing && appointment?.servicos && appointment.servicos.length > 0) {
            // Verificar se o serviço que estamos tentando adicionar já existe
            const existingService = appointment.servicos.find(s => s.id === Number(formData.servicoId));
            if (existingService) {
              console.log(`Serviço ${selectedService.id} já existe no agendamento, não será adicionado novamente`);
              needToAddService = false;
            }
          }

          if (needToAddService) {
            console.log(`Adicionando serviço ${selectedService.id} ao agendamento ${savedAppointment.id}`);
            await appointmentService.addServico(savedAppointment.id, Number(formData.servicoId));
          }
        } catch (servicoError) {
          console.error("Erro ao adicionar serviço ao agendamento:", servicoError);
          // Mesmo com erro no serviço, continuamos o fluxo pois o agendamento foi criado
        }
      }

      onSave(savedAppointment)
      onClose()
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error)
    }
  }

  // Formatador para exibir nome e detalhes do pet
  const formatPetOption = (pet: Pet) => {
    return `${pet.nome} (${pet.especie} - ${pet.raca})`;
  }

  // Formatador para exibir nome e preço do serviço
  const formatServiceOption = (service: Service) => {
    return `${service.nome} - R$ ${service.preco.toFixed(2)}`;
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">Carregando</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3">Carregando...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="petId" className={errors.petId && touched.petId ? "text-red-500" : ""}>
                Pet*
              </Label>
              <Select
                value={formData.petId}
                onValueChange={(value) => handleChange("petId", value)}
                onOpenChange={() => handleBlur("petId")}
              >
                <SelectTrigger
                  id="petId"
                  className={cn(errors.petId && touched.petId ? "border-red-500 focus-visible:ring-red-500" : "")}
                >
                  <SelectValue placeholder="Selecione um pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={String(pet.id)}>
                      {formatPetOption(pet)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.petId && touched.petId && <p className="text-xs text-red-500">{errors.petId}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="servicoId" className={errors.servicoId && touched.servicoId ? "text-red-500" : ""}>
                Serviço*
              </Label>
              <Select
                value={formData.servicoId}
                onValueChange={(value) => handleChange("servicoId", value)}
                onOpenChange={() => handleBlur("servicoId")}
              >
                <SelectTrigger
                  id="servicoId"
                  className={cn(errors.servicoId && touched.servicoId ? "border-red-500 focus-visible:ring-red-500" : "")}
                >
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={String(service.id)}>
                      {formatServiceOption(service)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.servicoId && touched.servicoId && <p className="text-xs text-red-500">{errors.servicoId}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date" className={errors.date && touched.date ? "text-red-500" : ""}>
                  Data*
                </Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    onBlur={() => handleBlur("date")}
                    placeholder="dd/mm/aaaa"
                    className={cn(errors.date && touched.date ? "border-red-500 focus-visible:ring-red-500" : "")}
                  />
                </div>
                {errors.date && touched.date && <p className="text-xs text-red-500">{errors.date}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time" className={errors.time && touched.time ? "text-red-500" : ""}>
                  Horário*
                </Label>
                <div className="relative">
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                    onBlur={() => handleBlur("time")}
                    placeholder="--:--"
                    className={cn(
                      errors.time && touched.time ? "border-red-500 focus-visible:ring-red-500" : "",
                      "pr-10",
                    )}
                  />
                  <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.time && touched.time && <p className="text-xs text-red-500">{errors.time}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observacao">Observações</Label>
              <Textarea
                id="observacao"
                value={formData.observacao}
                onChange={(e) => handleChange("observacao", e.target.value)}
                placeholder="Informações adicionais sobre o agendamento"
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gray-900 text-white hover:bg-gray-800">
              {isEditing ? "Salvar" : "Agendar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
