import { Pet } from './Pet';

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  pets?: Pet[];
}

export interface ClienteComPets extends Cliente {
  pets: Pet[];
} 