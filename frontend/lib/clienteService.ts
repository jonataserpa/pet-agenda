import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const clienteApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

export const clienteService = {
  async list() {
    console.log('ClienteService: Buscando lista de clientes do backend');
    try {
      const { data } = await clienteApi.get('/clientes');
      console.log('ClienteService: Clientes recebidos:', data);
      return data;
    } catch (error) {
      console.error('ClienteService: Erro ao buscar clientes:', error);
      throw error;
    }
  },
}; 