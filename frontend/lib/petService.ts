import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const petApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const petService = {
  async list() {
    console.log('PetService: Buscando lista de pets do backend');
    try {
      const { data } = await petApi.get('/pets');
      console.log('PetService: Pets recebidos:', data);
      return data;
    } catch (error) {
      console.error('PetService: Erro ao buscar pets:', error);
      throw error;
    }
  },
  
  async getById(id: number) {
    console.log(`PetService: Buscando pet ${id}`);
    try {
      const { data } = await petApi.get(`/pets/${id}`);
      console.log('PetService: Pet recebido:', data);
      return data;
    } catch (error) {
      console.error(`PetService: Erro ao buscar pet ${id}:`, error);
      throw error;
    }
  },
}; 