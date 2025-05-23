import { Pet } from './Pet';
import { Servico } from './Servico';

export interface Agendamento {
  id?: number;
  data: Date;
  status: string;
  petId: number;
  pet?: Pet;
  servicos?: Servico[];
  observacao?: string;
}

export interface AgendamentoComPet extends Agendamento {
  pet: Pet;
}

export interface AgendamentoComServicos extends Agendamento {
  servicos: Servico[];
}

export interface AgendamentoCompleto extends Agendamento {
  pet: Pet;
  servicos: Servico[];
} 