import { Pet } from './Pet';

export enum StatusCliente {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  pets?: Pet[];
  status?: StatusCliente;
  observacao?: string;
}

export interface ClienteComPets extends Cliente {
  pets: Pet[];
} 