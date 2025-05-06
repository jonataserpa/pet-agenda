import { ClienteService } from '../../services/ClienteService';
import { ClienteRepository } from '../../repositories/ClienteRepository';

// Mock do repositório ClienteRepository
jest.mock('../../repositories/ClienteRepository');

describe('ClienteService', () => {
  let clienteService: ClienteService;
  let mockClienteRepository: jest.Mocked<ClienteRepository>;

  const mockCliente = {
    id: 1,
    nome: 'Cliente Teste',
    email: 'cliente@teste.com',
    telefone: '(11) 99999-9999'
  };

  const mockClienteInvalido = {
    nome: '',
    email: 'email-invalido',
    telefone: ''
  };

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();

    // Inicializar com o mock
    mockClienteRepository = new ClienteRepository() as jest.Mocked<ClienteRepository>;
    clienteService = new ClienteService();
  });

  describe('create', () => {
    it('deve criar um cliente com sucesso', async () => {
      // Configurar mocks
      mockClienteRepository.findByEmail.mockResolvedValue(null);
      mockClienteRepository.create.mockResolvedValue(mockCliente);
      jest.spyOn(ClienteRepository.prototype, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(ClienteRepository.prototype, 'create').mockResolvedValue(mockCliente);

      // Executar o método
      const result = await clienteService.create(mockCliente);

      // Verificar resultados
      expect(result).toEqual(mockCliente);
      expect(ClienteRepository.prototype.findByEmail).toHaveBeenCalledWith(mockCliente.email);
      expect(ClienteRepository.prototype.create).toHaveBeenCalledWith(mockCliente);
    });

    it('deve falhar ao criar um cliente com e-mail já existente', async () => {
      // Configurar mocks
      jest.spyOn(ClienteRepository.prototype, 'findByEmail').mockResolvedValue(mockCliente);

      // Executar e verificar erro
      await expect(clienteService.create(mockCliente))
        .rejects
        .toThrow('Já existe um cliente com este e-mail');

      expect(ClienteRepository.prototype.findByEmail).toHaveBeenCalledWith(mockCliente.email);
    });

    it('deve falhar ao criar um cliente com campos inválidos', async () => {
      // Configurar mocks
      jest.spyOn(ClienteRepository.prototype, 'findByEmail').mockResolvedValue(null);

      // Executar e verificar erro
      await expect(clienteService.create(mockClienteInvalido))
        .rejects
        .toThrow('Nome, e-mail e telefone são campos obrigatórios');
    });

    it('deve falhar ao criar um cliente com e-mail inválido', async () => {
      // Configurar mocks
      jest.spyOn(ClienteRepository.prototype, 'findByEmail').mockResolvedValue(null);

      const clienteComEmailInvalido = {
        ...mockCliente,
        email: 'email-invalido'
      };

      // Executar e verificar erro
      await expect(clienteService.create(clienteComEmailInvalido))
        .rejects
        .toThrow('Formato de e-mail inválido');
    });
  });

  describe('findById', () => {
    it('deve retornar um cliente existente', async () => {
      // Configurar mocks
      jest.spyOn(ClienteRepository.prototype, 'findById').mockResolvedValue(mockCliente);

      // Executar o método
      const result = await clienteService.findById(1);

      // Verificar resultados
      expect(result).toEqual(mockCliente);
      expect(ClienteRepository.prototype.findById).toHaveBeenCalledWith(1);
    });

    it('deve retornar null para um cliente inexistente', async () => {
      // Configurar mocks
      jest.spyOn(ClienteRepository.prototype, 'findById').mockResolvedValue(null);

      // Executar o método
      const result = await clienteService.findById(999);

      // Verificar resultados
      expect(result).toBeNull();
      expect(ClienteRepository.prototype.findById).toHaveBeenCalledWith(999);
    });
  });

  // Adicione mais testes para os outros métodos como update, delete, findAll, etc.
}); 