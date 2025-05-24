import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const appointmentApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função auxiliar para limpar dados antes de enviar ao backend
const prepareAppointmentData = (appointment: any) => {
  // Cria uma cópia do objeto para não modificar o original
  const cleanAppointment = { ...appointment };
  
  // Remove campos que são apenas para exibição na UI
  delete cleanAppointment.petName;
  delete cleanAppointment.clientName;
  delete cleanAppointment.serviceName;
  delete cleanAppointment.servicePrice;
  delete cleanAppointment.phone;
  delete cleanAppointment.email;
  delete cleanAppointment.service; // campo antigo se existir
  
  // O backend espera 'data' e não 'date'
  if (cleanAppointment.date && !cleanAppointment.data) {
    cleanAppointment.data = cleanAppointment.date;
    delete cleanAppointment.date;
  }
  
  // O backend não deve receber os objetos complexos
  if (cleanAppointment.pet) {
    cleanAppointment.petId = cleanAppointment.pet.id;
    delete cleanAppointment.pet;
  }
  
  if (cleanAppointment.servicos) {
    delete cleanAppointment.servicos;
  }
  
  // Retorna o objeto limpo
  return cleanAppointment;
};

export const appointmentService = {
  async list() {
    console.log('AppointmentService: Buscando lista de agendamentos do backend');
    try {
      const { data } = await appointmentApi.get('/agendamentos');
      console.log('AppointmentService: Agendamentos recebidos com estrutura completa:', data);
      
      // Verificar se temos o serviço completo nos dados recebidos
      if (data.length > 0) {
        console.log('AppointmentService: Estrutura do primeiro agendamento:', {
          id: data[0].id,
          data: data[0].data,
          pet: data[0].pet ? `Pet: ${data[0].pet.nome}` : 'Sem pet',
          servicos: data[0].servicos ? 
            `${data[0].servicos.length} serviços encontrados. Primeiro: ${data[0].servicos[0]?.nome || 'N/A'}` : 
            'Sem serviços'
        });
      }
      
      return data;
    } catch (error) {
      console.error('AppointmentService: Erro ao buscar agendamentos:', error);
      throw error;
    }
  },
  
  async getById(id: string) {
    console.log(`AppointmentService: Buscando agendamento ${id}`);
    try {
      const { data } = await appointmentApi.get(`/agendamentos/${id}`);
      console.log('AppointmentService: Agendamento recebido:', data);
      return data;
    } catch (error) {
      console.error(`AppointmentService: Erro ao buscar agendamento ${id}:`, error);
      throw error;
    }
  },
  
  async save(appointment: any) {
    try {
      // Preparar os dados removendo campos desnecessários
      const cleanAppointment = prepareAppointmentData(appointment);
      
      if (cleanAppointment.id) {
        console.log(`AppointmentService: Atualizando agendamento ${cleanAppointment.id}`);
        const { data } = await appointmentApi.put(`/agendamentos/${cleanAppointment.id}`, cleanAppointment);
        console.log('AppointmentService: Agendamento atualizado:', data);
        return data;
      } else {
        console.log('AppointmentService: Criando novo agendamento');
        const { data } = await appointmentApi.post('/agendamentos', cleanAppointment);
        console.log('AppointmentService: Agendamento criado:', data);
        return data;
      }
    } catch (error) {
      console.error('AppointmentService: Erro ao salvar agendamento:', error);
      throw error;
    }
  },
  
  async delete(id: string) {
    console.log(`AppointmentService: Excluindo agendamento ${id}`);
    try {
      const { data } = await appointmentApi.delete(`/agendamentos/${id}`);
      console.log('AppointmentService: Agendamento excluído');
      return data;
    } catch (error) {
      console.error(`AppointmentService: Erro ao excluir agendamento ${id}:`, error);
      throw error;
    }
  },

  async addServico(agendamentoId: string | number, servicoId: number) {
    console.log(`AppointmentService: Adicionando serviço ${servicoId} ao agendamento ${agendamentoId}`);
    try {
      const { data } = await appointmentApi.post(`/agendamentos/${agendamentoId}/servicos`, { servicoId });
      console.log('AppointmentService: Serviço adicionado ao agendamento');
      return data;
    } catch (error) {
      console.error(`AppointmentService: Erro ao adicionar serviço ao agendamento:`, error);
      throw error;
    }
  },

  async removeServico(agendamentoId: string | number, servicoId: number) {
    console.log(`AppointmentService: Removendo serviço ${servicoId} do agendamento ${agendamentoId}`);
    try {
      const { data } = await appointmentApi.delete(`/agendamentos/${agendamentoId}/servicos/${servicoId}`);
      console.log('AppointmentService: Serviço removido do agendamento');
      return data;
    } catch (error) {
      console.error(`AppointmentService: Erro ao remover serviço do agendamento:`, error);
      throw error;
    }
  },

  async upload(id: string, file: File) {
    console.log(`AppointmentService: Enviando arquivo para agendamento ${id}`);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const { data } = await appointmentApi.post(`/agendamentos/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('AppointmentService: Arquivo enviado com sucesso');
      return data;
    } catch (error) {
      console.error(`AppointmentService: Erro ao enviar arquivo:`, error);
      throw error;
    }
  },

  async getDashboardData() {
    console.log('AppointmentService: Buscando dados do dashboard do backend');
    try {
      const { data } = await appointmentApi.get('/dashboard');
      console.log('AppointmentService: Dados do dashboard recebidos:', data);
      return data;
    } catch (error) {
      console.error('AppointmentService: Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  },
}; 