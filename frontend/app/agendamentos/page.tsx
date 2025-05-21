"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Pagination } from "@/components/ui/pagination"
import { AppointmentFormModal } from "@/components/appointments/appointment-form-modal"
import { Plus, Search, Filter, Pencil, Trash, Calendar, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { appointmentService } from "@/lib/appointmentService"
import { petService } from "@/lib/petService"
import { serviceService } from "@/lib/serviceService"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

// Tipos de dados
type Pet = {
  id: number
  nome: string
  especie: string
  raca: string
  idade: number
  peso: number
  clienteId: number
}

type Service = {
  id: number
  nome: string
  preco: number
  descricao: string
}

// Tipo de dados de agendamento
type Appointment = {
  id: string | number
  petId: number
  servicoId?: number
  date?: string
  time?: string
  notes?: string
  status: string
  
  // Campos adicionais do backend
  data?: string
  observacao?: string
  servicos?: Array<{
    id: number
    nome: string
    preco: number
    descricao: string
  }>
  
  // Campos para exibição na tabela
  petName?: string
  clientName?: string
  serviceName?: string
  servicePrice?: number
  phone?: string
  email?: string
}

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [pageLoading, setPageLoading] = useState(true)
  const { toast } = useToast()

  // Buscar dados do backend quando o componente montar
  useEffect(() => {
    async function fetchData() {
      setPageLoading(true)
      try {
        // Buscar pets
        console.log("AgendamentosPage: Buscando pets...")
        const petsData = await petService.list()
        setPets(petsData)
        
        // Buscar serviços
        console.log("AgendamentosPage: Buscando serviços...")
        const servicesData = await serviceService.list()
        setServices(servicesData)
        
        // Buscar agendamentos
        console.log("AgendamentosPage: Buscando agendamentos...")
        const appointmentsData = await appointmentService.list()
        
        console.log("Pets recebidos:", petsData);
        console.log("Serviços recebidos:", servicesData);
        console.log("Agendamentos recebidos:", appointmentsData);
        
        // Processar agendamentos para exibição na tabela
        const enrichedAppointments = appointmentsData.map((appointment: any) => {
          // Agora utilizamos diretamente os dados recebidos da API
          // O pet já vem completo do backend
          const pet = appointment.pet;
          
          // Inicializamos os dados do primeiro serviço (se existir)
          let serviceName = "Sem serviço";
          let servicePrice = undefined;
          let servicoId = undefined;
          
          // Se existem serviços, usamos o primeiro para exibição principal
          if (appointment.servicos && appointment.servicos.length > 0) {
            const primaryService = appointment.servicos[0];
            serviceName = primaryService.nome;
            servicePrice = primaryService.preco;
            servicoId = primaryService.id;
            
            // Se há mais de um serviço, adicionamos indicação na descrição
            if (appointment.servicos.length > 1) {
              serviceName = `${serviceName} +${appointment.servicos.length - 1}`;
            }
            
            console.log(`Serviços para agendamento ${appointment.id}:`, appointment.servicos);
          }
          
          // Usar o campo 'data' como date para compatibilidade com o frontend
          const date = appointment.data || appointment.date;
          
          return {
            ...appointment,
            date: date,
            petName: pet?.nome || "Pet não encontrado",
            clientName: pet ? `Dono do ${pet.nome}` : "Cliente desconhecido",
            serviceName: serviceName,
            servicePrice: servicePrice,
            // Mantemos a lista completa de serviços também
            servicos: appointment.servicos || []
          };
        });
        
        setAppointments(enrichedAppointments)
        console.log("AgendamentosPage: Dados processados:", enrichedAppointments)
      } catch (error) {
        console.error("AgendamentosPage: Erro ao buscar dados:", error)
        toast({ 
          title: "Erro ao carregar dados", 
          description: "Não foi possível obter os dados do servidor.",
          variant: "destructive" 
        })
        setAppointments([])
      } finally {
        setPageLoading(false)
      }
    }
    
    fetchData()
  }, [toast])

  const handleOpenModal = () => {
    setSelectedAppointment(null)
    setIsModalOpen(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAppointment(null)
  }

  const handleSaveAppointment = async (appointment: any) => {
    try {
      console.log("AgendamentosPage: Salvando agendamento:", appointment)
      const savedAppointment = await appointmentService.save(appointment)
      
      // Encontrar pet e serviço para enriquecer os dados salvos
      const pet = pets.find(p => p.id === savedAppointment.petId)
      const service = services.find(s => s.id === savedAppointment.servicoId)
      
      // Enriquecer o agendamento salvo com dados para exibição
      const enrichedAppointment = {
        ...savedAppointment,
        petName: pet?.nome || "Pet não encontrado",
        clientName: `Dono do ${pet?.nome || "Pet"}`,
        serviceName: service?.nome || "Serviço não encontrado",
        servicePrice: service?.preco,
      }
      
      if (selectedAppointment) {
        // Editar agendamento existente
        setAppointments((prev) => prev.map((a) => 
          a.id === enrichedAppointment.id ? enrichedAppointment : a
        ))
        toast({
          title: "Agendamento atualizado",
          description: `Agendamento de ${enrichedAppointment.petName} foi atualizado.`,
        })
      } else {
        // Adicionar novo agendamento
        setAppointments((prev) => [...prev, enrichedAppointment])
        toast({
          title: "Agendamento criado",
          description: `Agendamento de ${enrichedAppointment.petName} foi criado com sucesso.`,
        })
      }
      
      handleCloseModal()
    } catch (error) {
      console.error("AgendamentosPage: Erro ao salvar agendamento:", error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o agendamento no servidor.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAppointment = async (appointmentId: string | number) => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      try {
        console.log(`AgendamentosPage: Excluindo agendamento ${appointmentId}`)
        await appointmentService.delete(String(appointmentId))
        
        // Atualizar estado local após exclusão bem-sucedida
        setAppointments((prev) => prev.filter((a) => a.id !== appointmentId))
        
        toast({
          title: "Agendamento excluído",
          description: "O agendamento foi excluído com sucesso.",
          variant: "destructive",
        })
      } catch (error) {
        console.error(`AgendamentosPage: Erro ao excluir agendamento ${appointmentId}:`, error)
        toast({
          title: "Erro ao excluir agendamento",
          description: "Não foi possível excluir o agendamento no servidor.",
          variant: "destructive",
        })
      }
    }
  }

  // Formatar data para exibição no padrão brasileiro
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-"
    
    try {
      // Verifica se a data contém o formato completo com hora
      if (dateString.includes('T') || dateString.includes(' ')) {
        // Se for o formato ISO '2025-05-08T11:14:47.838Z' ou '2025-05-08 11:14:47.838'
        console.log(`Formatando data: ${dateString}`);
        const date = new Date(dateString);
        console.log(`Data convertida para objeto Date: ${date}`);
        return format(date, "dd/MM/yyyy", { locale: ptBR });
      } else {
        // Se for apenas a data no formato 'YYYY-MM-DD'
        return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
      }
    } catch (error) {
      console.error("Erro ao formatar data:", dateString, error);
      return dateString;
    }
  }

  // Extrair e formatar hora de um timestamp
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "-"
    
    try {
      // Se a string contém 'T' ou espaço, é um timestamp completo
      if (dateString.includes('T') || dateString.includes(' ')) {
        console.log(`Formatando hora: ${dateString}`);
        const date = new Date(dateString);
        console.log(`Hora convertida para objeto Date: ${date}`);
        return format(date, "HH:mm", { locale: ptBR });
      } else if (dateString.includes(':')) {
        // Se já é apenas um horário
        return dateString;
      }
      return "-";
    } catch (error) {
      console.error("Erro ao formatar hora:", dateString, error);
      return "-";
    }
  }

  // Formatar preço para exibição
  const formatPrice = (price?: number) => {
    if (price === undefined) return "-";
    return `R$ ${price.toFixed(2)}`;
  }

  // Filtrar agendamentos com base no termo de pesquisa
  const filteredAppointments = appointments.filter((appointment) => {
    if (!searchTerm.trim()) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      appointment.petName?.toLowerCase().includes(searchLower) ||
      appointment.clientName?.toLowerCase().includes(searchLower) ||
      appointment.serviceName?.toLowerCase().includes(searchLower) ||
      appointment.status?.toLowerCase().includes(searchLower) ||
      formatDate(appointment.date).includes(searchTerm)
    )
  })

  const columns = [
    {
      key: "pet",
      header: "Pet",
      cell: (item: Appointment) => (
        <div className="flex items-center gap-3">
          <div className="font-medium">{item.petName || "-"}</div>
        </div>
      ),
    },
    {
      key: "datetime",
      header: "Data e Hora",
      cell: (item: Appointment) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{formatDate(item.date)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{item.time || (item.date?.includes('T') || item.date?.includes(' ') ? formatTime(item.date) : "-")}</span>
          </div>
        </div>
      ),
    },
    { 
      key: "service", 
      header: "Serviço",
      cell: (item: Appointment) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.serviceName || "-"}</span>
          <span className="text-xs text-muted-foreground">
            {formatPrice(item.servicePrice)}
            {item.servicos && item.servicos.length > 1 && (
              <span className="ml-1 text-xs text-blue-500 cursor-help" title={item.servicos.map(s => `${s.nome} - ${formatPrice(s.preco)}`).join(', ')}>
                (Múltiplos serviços)
              </span>
            )}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item: Appointment) => <StatusBadge status={item.status || "Pendente"} />,
    },
    {
      key: "actions",
      header: "Ações",
      cell: (item: Appointment) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEditAppointment(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteAppointment(item.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  if (pageLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3 text-lg">Carregando agendamentos...</span>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agendamentos</h1>
        <Button className="flex items-center gap-2" onClick={handleOpenModal}>
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar agendamentos..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredAppointments} 
        emptyMessage="Nenhum agendamento encontrado" 
      />

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredAppointments.length} de {appointments.length} agendamentos
        </div>
        <Pagination currentPage={1} totalPages={1} />
      </div>

      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAppointment}
        appointment={selectedAppointment ? {
          ...selectedAppointment,
          id: String(selectedAppointment.id)
        } : undefined}
      />
    </MainLayout>
  )
}
