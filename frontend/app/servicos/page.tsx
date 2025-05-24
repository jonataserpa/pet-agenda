"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { ServiceFormModal } from "@/components/servicos/service-form-modal"
import { Plus, Search, Filter, Pencil, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { serviceService } from "@/lib/serviceService"

// Tipo de dados do serviço
interface Servico {
  id: number
  nome: string
  preco: number
  descricao: string
}

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [pageLoading, setPageLoading] = useState(true)
  const { toast } = useToast()

  // Buscar dados do backend quando o componente montar
  useEffect(() => {
    async function fetchData() {
      setPageLoading(true)
      try {
        console.log("ServicosPage: Buscando serviços...")
        const servicosData = await serviceService.list()
        setServicos(servicosData)
        console.log("Serviços recebidos:", servicosData)
      } catch (error) {
        console.error("ServicosPage: Erro ao buscar dados:", error)
        toast({ 
          title: "Erro ao carregar dados", 
          description: "Não foi possível obter os dados do servidor.",
          variant: "destructive" 
        })
        setServicos([])
      } finally {
        setPageLoading(false)
      }
    }
    
    fetchData()
  }, [toast])

  const handleOpenModal = () => {
    setSelectedServico(null)
    setIsModalOpen(true)
  }

  const handleEditServico = (servico: Servico) => {
    setSelectedServico(servico)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedServico(null)
  }

  const handleSaveServico = async (servico: Servico) => {
    try {
      console.log("ServicosPage: Salvando serviço:", servico)
      const savedServico = await serviceService.save(servico)
      
      if (selectedServico) {
        // Editar serviço existente
        setServicos((prev) => prev.map((s) => 
          s.id === savedServico.id ? savedServico : s
        ))
        toast({
          title: "Serviço atualizado",
          description: `Serviço ${savedServico.nome} foi atualizado.`,
        })
      } else {
        // Adicionar novo serviço
        setServicos((prev) => [...prev, savedServico])
        toast({
          title: "Serviço criado",
          description: `Serviço ${savedServico.nome} foi criado com sucesso.`,
        })
      }
      
      handleCloseModal()
    } catch (error) {
      console.error("ServicosPage: Erro ao salvar serviço:", error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o serviço no servidor.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteServico = async (servicoId: number) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      try {
        console.log(`ServicosPage: Excluindo serviço ${servicoId}`)
        await serviceService.delete(servicoId)
        
        // Atualizar estado local após exclusão bem-sucedida
        setServicos((prev) => prev.filter((s) => s.id !== servicoId))
        
        toast({
          title: "Serviço excluído",
          description: "O serviço foi excluído com sucesso.",
          variant: "destructive",
        })
      } catch (error) {
        console.error(`ServicosPage: Erro ao excluir serviço ${servicoId}:`, error)
        toast({
          title: "Erro ao excluir serviço",
          description: "Não foi possível excluir o serviço no servidor.",
          variant: "destructive",
        })
      }
    }
  }

  // Filtrar serviços com base no termo de pesquisa
  const filteredServicos = servicos.filter((servico) => {
    if (!searchTerm.trim()) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      servico.nome.toLowerCase().includes(searchLower) ||
      servico.descricao.toLowerCase().includes(searchLower)
    )
  })

  const columns = [
    {
      key: "nome",
      header: "Nome",
      cell: (item: Servico) => (
        <div className="flex items-center gap-3">
          <div className="font-medium">{item.nome}</div>
        </div>
      ),
    },
    {
      key: "preco",
      header: "Preço",
      cell: (item: Servico) => <div>R$ {item.preco.toFixed(2)}</div>,
    },
    {
      key: "descricao",
      header: "Descrição",
      cell: (item: Servico) => <div>{item.descricao}</div>,
    },
    {
      key: "actions",
      header: "Ações",
      cell: (item: Servico) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEditServico(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteServico(item.id)}>
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
          <span className="ml-3 text-lg">Carregando serviços...</span>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Serviços</h1>
        <Button className="flex items-center gap-2" onClick={handleOpenModal}>
          <Plus className="h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar serviços..."
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
        data={filteredServicos} 
        emptyMessage="Nenhum serviço encontrado" 
      />

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredServicos.length} de {servicos.length} serviços
        </div>
        <Pagination currentPage={1} totalPages={1} />
      </div>

      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveServico}
        servico={isModalOpen && selectedServico ? {
          ...selectedServico,
          id: selectedServico.id ? Number(selectedServico.id) : 0,
        } : undefined}
      />
    </MainLayout>
  )
} 