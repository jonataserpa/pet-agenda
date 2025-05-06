import { Cliente } from './Cliente';
import { Agendamento } from './Agendamento';

export interface Pet {
  id?: number;
  nome: string;
  especie: string;
  raca: string;
  idade: number;
  peso: number;
  clienteId: number;
  cliente?: Cliente;
  agendamentos?: Agendamento[];
}

export interface PetComDono extends Pet {
  cliente: Cliente;
}

export interface PetComAgendamentos extends Pet {
  agendamentos: Agendamento[];
} 