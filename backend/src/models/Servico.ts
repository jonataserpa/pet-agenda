import { Agendamento } from './Agendamento';

export interface Servico {
  id?: number;
  nome: string;
  preco: number;
  descricao: string;
  agendamentos?: Agendamento[];
}

export interface ServicoComAgendamentos extends Servico {
  agendamentos: Agendamento[];
} 