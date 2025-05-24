"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Pagination } from "@/components/ui/pagination"
import { PetFormModal } from "@/components/pets/pet-form-modal"
import { Plus, Search, Filter, Pencil, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { petService } from "@/lib/petService"

// Tipo de dados do pet
interface Pet {
  id: number
  nome: string
  especie: string
  raca: string
  idade: number
  peso: number
  clienteId: number
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [pageLoading, setPageLoading] = useState(true)
  const { toast } = useToast()

  // Buscar dados do backend quando o componente montar
  useEffect(() => {
    async function fetchData() {
      setPageLoading(true)
      try {
        console.log("PetsPage: Buscando pets...")
        const petsData = await petService.list()
        setPets(petsData)
        console.log("Pets recebidos:", petsData)
      } catch (error) {
        console.error("PetsPage: Erro ao buscar dados:", error)
        toast({ 
          title: "Erro ao carregar dados", 
          description: "Não foi possível obter os dados do servidor.",
          variant: "destructive" 
        })
        setPets([])
      } finally {
        setPageLoading(false)
      }
    }
    
    fetchData()
  }, [toast])

  const handleOpenModal = () => {
    setSelectedPet(null)
    setIsModalOpen(true)
  }

  const handleEditPet = (pet: any) => {
    setSelectedPet(pet)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPet(null)
  }

  const handleSavePet = (pet: Pet) => {
    console.log("PetsPage: Salvando pet:", pet)
    petService.save(pet)
      .then(savedPet => {
        if (selectedPet) {
          // Editar pet existente
          setPets((prev) => prev.map((p) => 
            p.id === savedPet.id ? savedPet : p
          ))
          toast({
            title: "Pet atualizado",
            description: `Pet ${savedPet.nome} foi atualizado.`,
          })
        } else {
          // Adicionar novo pet
          setPets((prev) => [...prev, savedPet])
          toast({
            title: "Pet criado",
            description: `Pet ${savedPet.nome} foi criado com sucesso.`,
          })
        }
        
        handleCloseModal()
      })
      .catch(error => {
        console.error("PetsPage: Erro ao salvar pet:", error)
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar o pet no servidor.",
          variant: "destructive",
        })
      })
  }

  const handleDeletePet = async (petId: number) => {
    if (confirm("Tem certeza que deseja excluir este pet?")) {
      try {
        console.log(`PetsPage: Excluindo pet ${petId}`)
        await petService.delete(petId)
        
        // Atualizar estado local após exclusão bem-sucedida
        setPets((prev) => prev.filter((p) => p.id !== petId))
        
        toast({
          title: "Pet excluído",
          description: "O pet foi excluído com sucesso.",
          variant: "destructive",
        })
      } catch (error) {
        console.error(`PetsPage: Erro ao excluir pet ${petId}:`, error)
        toast({
          title: "Erro ao excluir pet",
          description: "Não foi possível excluir o pet no servidor.",
          variant: "destructive",
        })
      }
    }
  }

  // Filtrar pets com base no termo de pesquisa
  const filteredPets = pets.filter((pet) => {
    if (!searchTerm.trim()) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      pet.nome.toLowerCase().includes(searchLower) ||
      pet.especie.toLowerCase().includes(searchLower) ||
      pet.raca.toLowerCase().includes(searchLower)
    )
  })

  const columns = [
    {
      key: "nome",
      header: "Nome",
      cell: (item: Pet) => (
        <div className="flex items-center gap-3">
          <div className="font-medium">{item.nome}</div>
        </div>
      ),
    },
    {
      key: "especie",
      header: "Espécie",
      cell: (item: Pet) => <div>{item.especie}</div>,
    },
    {
      key: "raca",
      header: "Raça",
      cell: (item: Pet) => <div>{item.raca}</div>,
    },
    {
      key: "idade",
      header: "Idade",
      cell: (item: Pet) => <div>{item.idade} anos</div>,
    },
    {
      key: "peso",
      header: "Peso",
      cell: (item: Pet) => <div>{item.peso} kg</div>,
    },
    {
      key: "actions",
      header: "Ações",
      cell: (item: Pet) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEditPet(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeletePet(item.id)}>
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
          <span className="ml-3 text-lg">Carregando pets...</span>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pets</h1>
        <Button className="flex items-center gap-2" onClick={handleOpenModal}>
          <Plus className="h-4 w-4" />
          Novo Pet
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar pets..."
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
        data={filteredPets} 
        emptyMessage="Nenhum pet encontrado" 
      />

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredPets.length} de {pets.length} pets
        </div>
        <Pagination currentPage={1} totalPages={1} />
      </div>

      <PetFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePet}
        pet={selectedPet ? {
          ...selectedPet,
          id: selectedPet.id ? Number(selectedPet.id) : 0,
        } : undefined}
      />
    </MainLayout>
  )
} 