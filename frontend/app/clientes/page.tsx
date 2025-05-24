"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Pagination } from "@/components/ui/pagination"
import { ClientFormModal } from "@/components/clients/client-form-modal"
import { Plus, Search, Filter, Pencil, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { clientService } from "@/lib/clientService"
import { useRouter } from "next/navigation"
import axios from 'axios'

export default function ClientesPage() {
  const [clients, setClients] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [pageLoading, setPageLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // O middleware já garantiu a autenticação. Agora só buscamos os dados.
    async function fetchClients() {
      setPageLoading(true)
      try {
        const data = await clientService.list()
        setClients(data)
      } catch (error) {
        // Tratar erro ao buscar clientes
        console.error("Erro ao buscar clientes:", error)
        toast({ title: "Erro ao carregar clientes", variant: "destructive" })
      } finally {
        setPageLoading(false)
      }
    }
    fetchClients()
  }, [toast])

  if (pageLoading) {
    return <div>Carregando dados dos clientes...</div>
  }

  const handleOpenModal = () => {
    setSelectedClient(null)
    setIsModalOpen(true)
  }

  const handleEditClient = (client: any) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedClient(null)
  }

  const handleSaveClient = (client: any) => {
    if (selectedClient) {
      // Editar cliente existente
      setClients((prevClients) => prevClients.map((c) => (c.id === client.id ? client : c)))
      toast({
        title: "Cliente atualizado",
        description: `${client.name} foi atualizado com sucesso.`,
      })
    } else {
      // Adicionar novo cliente
      setClients((prevClients) => [...prevClients, client])
      toast({
        title: "Cliente cadastrado",
        description: `${client.name} foi adicionado com sucesso.`,
      })
    }

    // Fechar a modal após salvar
    handleCloseModal()
  }

  const handleDeleteClient = async (clientId: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await clientService.delete(clientId)
        setClients((prevClients) => prevClients.filter((c) => c.id !== clientId))
        toast({
          title: "Cliente excluído",
          description: "O cliente foi excluído com sucesso.",
          variant: "destructive",
        })
      } catch (error) {
        toast({
          title: "Erro ao excluir cliente",
          description: "Não foi possível excluir o cliente.",
          variant: "destructive",
        })
      }
    }
  }

  // Filtrar clientes com base no termo de pesquisa
  const filteredClients = clients.filter((client) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      client?.nome.toLowerCase().includes(searchLower) ||
      client?.email.toLowerCase().includes(searchLower) ||
      client?.telefone.includes(searchTerm)
    )
  })

  const columns = [
    {
      key: "name",
      header: "Nome",
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
            <img src={`https://ui-avatars.com/api/?uppercase=false&name=${encodeURIComponent(item.nome)}`} alt={item.nome} />
          </div>
          <div>
            <p className="font-medium">{item.nome}</p>
            <p className="text-xs text-muted-foreground">ID: {item.id}</p>
          </div>
        </div>
      ),
    },
    { key: "email", header: "Email" },
    { key: "telefone", header: "Telefone" },
    {
      key: "status",
      header: "Status",
      cell: (item: any) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Ações",
      cell: (item: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEditClient(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteClient(item.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cadastro de Clientes</h1>
        <Button className="flex items-center gap-2" onClick={handleOpenModal}>
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
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

      <DataTable columns={columns} data={filteredClients} emptyMessage="Nenhum cliente encontrado" />

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredClients.length} de {clients.length} clientes
        </div>
        <Pagination currentPage={1} totalPages={1} />
      </div>

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveClient}
        client={selectedClient}
      />
    </MainLayout>
  )
}
