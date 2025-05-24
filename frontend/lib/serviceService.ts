import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const serviceApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const serviceService = {
  async list() {
    console.log('ServiceService: Buscando lista de serviços do backend');
    try {
      const { data } = await serviceApi.get('/servicos');
      console.log('ServiceService: Serviços recebidos:', data);
      return data;
    } catch (error) {
      console.error('ServiceService: Erro ao buscar serviços:', error);
      throw error;
    }
  },
  
  async getById(id: number) {
    console.log(`ServiceService: Buscando serviço ${id}`);
    try {
      const { data } = await serviceApi.get(`/servicos/${id}`);
      console.log('ServiceService: Serviço recebido:', data);
      return data;
    } catch (error) {
      console.error(`ServiceService: Erro ao buscar serviço ${id}:`, error);
      throw error;
    }
  },

  async save(servico: any) {
    console.log('ServiceService: Salvando serviço', servico);
    try {
      if (servico.id) {
        const { data } = await serviceApi.put(`/servicos/${servico.id}`, servico);
        console.log('ServiceService: Serviço atualizado:', data);
        return data;
      } else {
        const { data } = await serviceApi.post('/servicos', servico);
        console.log('ServiceService: Serviço criado:', data);
        return data;
      }
    } catch (error) {
      console.error('ServiceService: Erro ao salvar serviço:', error);
      throw error;
    }
  },

  async delete(id: number) {
    console.log(`ServiceService: Excluindo serviço ${id}`);
    try {
      const { data } = await serviceApi.delete(`/servicos/${id}`);
      console.log('ServiceService: Serviço excluído');
      return data;
    } catch (error) {
      console.error(`ServiceService: Erro ao excluir serviço ${id}:`, error);
      throw error;
    }
  }
}; 