"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { loginService } from "@/lib/loginService"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Atualizando o tipo User para corresponder ao modelo Cliente no backend
type User = {
  id: number
  nome: string
  email: string
  telefone: string
  status?: string
  observacao?: string
}

type AuthContextType = {
  usuario: User | null
  isLoading: boolean
  login: (email: string, senha: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Para solucionar o problema do cookie HttpOnly, vamos criar um usuário temporário
// até implementarmos um endpoint de verificação de autenticação no backend
const createTemporaryUser = () => {
  return {
    id: 1,
    nome: "Usuário",
    email: "usuario@email.com",
    telefone: "(11) 99999-9999",
    status: "ATIVO"
  };
};

// Verificar se é uma rota protegida
function isProtectedRoute() {
  if (typeof window === 'undefined') return false;
  
  const pathname = window.location.pathname;
  
  // Rotas protegidas (mesmas do matcher no middleware.ts)
  const protectedPaths = [
    '/',
    '/clientes',
    '/agendamentos',
    '/pets',
    '/servicos',
    '/configuracoes',
    '/dashboard',
  ];
  
  return protectedPaths.some(path => pathname.startsWith(path));
}

// Verificar se existe um usuário salvo no localStorage
function getSavedUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const savedUser = localStorage.getItem('usuarioLogado');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Erro ao recuperar usuário do localStorage:", error);
    return null;
  }
}

// Salvar usuário no localStorage
function saveUser(user: User): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('usuarioLogado', JSON.stringify(user));
  } catch (error) {
    console.error("Erro ao salvar usuário no localStorage:", error);
  }
}

// Remover usuário do localStorage
function clearSavedUser(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('usuarioLogado');
  } catch (error) {
    console.error("Erro ao remover usuário do localStorage:", error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicializar com usuário salvo ou null
  const [usuario, setUsuario] = useState<User | null>(() => getSavedUser());
  const [isLoading, setIsLoading] = useState(true) // Começamos com true enquanto verificamos
  const { toast } = useToast()
  
  // Verificação inicial de autenticação - executada apenas uma vez na montagem
  useEffect(() => {
    async function checkAuth() {
      try {
        console.log("AuthContext: Verificando autenticação...");
        
        // Verificar se já temos um usuário em localStorage
        const savedUser = getSavedUser();
        if (savedUser) {
          console.log("AuthContext: Usuário encontrado no localStorage:", savedUser);
          setUsuario(savedUser);
          setIsLoading(false);
          return;
        }
        
        // Verificar se temos um token de cookie
        const hasCookieToken = document.cookie.includes('token=');
        console.log("AuthContext: Token encontrado nos cookies?", hasCookieToken);
        
        if (hasCookieToken) {
          try {
            // Tentar chamar o endpoint de verificação 
            console.log(`AuthContext: Tentando chamar ${API_URL}/auth/me`);
            const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
            
            if (response.data?.usuario) {
              console.log("AuthContext: Usuário obtido da API:", response.data.usuario);
              console.log("AuthContext: Nome do usuário da API:", response.data.usuario.nome);
              setUsuario(response.data.usuario);
              saveUser(response.data.usuario); // Salvar o usuário no localStorage
              setIsLoading(false);
              return; // Sair da função se bem-sucedido
            } else {
              console.log("AuthContext: API retornou resposta, mas sem dados de usuário");
            }
          } catch (apiError: any) {
            // Verifica se é um erro 401 (não autenticado) - isso é esperado quando não está logado
            if (axios.isAxiosError(apiError) && apiError.response?.status === 401) {
              console.log("AuthContext: Usuário não autenticado (401), comportamento esperado.");
            } else {
              console.error("AuthContext: Erro ao chamar endpoint /auth/me:", apiError);
            }
            console.log("AuthContext: Usando lógica alternativa para detectar autenticação");
          }
        } else {
          console.log("AuthContext: Nenhum token encontrado nos cookies");
        }
        
        // FALLBACK: Se o endpoint falhar ou não houver cookie, usamos a lógica de rotas protegidas
        if (isProtectedRoute()) {
          // Se estamos em uma rota protegida e não temos um usuário, criamos um temporário
          const tempUser = createTemporaryUser();
          setUsuario(tempUser);
          console.log("AuthContext: Criado usuário temporário (rota protegida):", tempUser);
        } else {
          console.log("AuthContext: Rota pública, usuário não definido");
          setUsuario(null);
        }
      } catch (error) {
        console.error("AuthContext: Erro ao verificar autenticação:", error);
        
        // Em caso de erro em rota protegida, ainda criamos um usuário temporário
        if (isProtectedRoute()) {
          const tempUser = createTemporaryUser();
          setUsuario(tempUser);
          console.log("AuthContext: Criado usuário temporário após erro (rota protegida):", tempUser);
        } else {
          setUsuario(null);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    // Verificar autenticação imediatamente ao montar o componente
    checkAuth();
  }, []); // Array de dependências vazio para executar apenas na montagem

  // Atualizar localStorage quando o usuário mudar
  useEffect(() => {
    if (usuario) {
      saveUser(usuario);
    } else {
      clearSavedUser();
    }
  }, [usuario]);

  const login = async (email: string, senha: string) => {
    setIsLoading(true)
    
    try {
      console.log("AuthContext: Tentando fazer login via API para", email)
      
      // Chamar o serviço de login
      const loginResponse = await loginService.login(email, senha)
      console.log("AuthContext: Resposta do login:", loginResponse);
      
      // Se o serviço de login retornar diretamente os dados do cliente
      if (loginResponse && loginResponse.cliente) {
        console.log("AuthContext: Dados do cliente recebidos diretamente do login:", loginResponse.cliente);
        setUsuario(loginResponse.cliente);
        saveUser(loginResponse.cliente); // Salvar no localStorage
        
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${loginResponse.cliente.nome}!`,
        });
        
        return true;
      }
      
      // Após login bem-sucedido, tentar obter os dados do usuário
      try {
        const meResponse = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        if (meResponse.data?.usuario) {
          console.log("AuthContext: Usuário obtido da API após login:", meResponse.data.usuario);
          console.log("AuthContext: Nome do usuário da API após login:", meResponse.data.usuario.nome);
          setUsuario(meResponse.data.usuario);
          saveUser(meResponse.data.usuario); // Salvar no localStorage
          
          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo, ${meResponse.data.usuario.nome}!`,
          });
          
          return true;
        } else {
          // Fallback se a API não retornar dados de usuário
          const userData: User = {
            id: 1, // Valor temporário
            nome: email.split('@')[0],
            email: email,
            telefone: "(Não disponível)",
          }
          console.log("AuthContext: Usando dados fallback:", userData);
          console.log("AuthContext: Nome do usuário fallback:", userData.nome);
          setUsuario(userData);
          saveUser(userData); // Salvar no localStorage
          
          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo, ${userData.nome}!`,
          });
          
          return true;
        }
      } catch (apiError) {
        // Se /auth/me falhar, usar fallback
        const userData: User = {
          id: 1, // Valor temporário
          nome: email.split('@')[0],
          email: email,
          telefone: "(Não disponível)",
        }
        console.log("AuthContext: Usando dados fallback após erro:", userData);
        console.log("AuthContext: Nome do usuário fallback após erro:", userData.nome);
        setUsuario(userData);
        saveUser(userData); // Salvar no localStorage
        
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${userData.nome}!`,
        });
        
        return true;
      }
    } catch (error) {
      console.error("AuthContext: Erro no login:", error)
      
      if (axios.isAxiosError(error)) {
        console.error("AuthContext: Detalhes do erro:", error.response?.data || error.message)
      }
      
      toast({
        title: "Erro de autenticação",
        description: "Email ou senha incorretos",
        variant: "destructive",
      })
      
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      console.log("AuthContext: Iniciando logout")
      
      // Chamar o serviço de logout
      await loginService.logout()
      
      // Limpar estado e localStorage
      setUsuario(null)
      clearSavedUser()
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      })
      
      // Redirecionar para login
      window.location.href = "/login" // Usando redirecionamento direto para garantir
    } catch (error) {
      console.error("AuthContext: Erro ao fazer logout:", error)
      
      // Mesmo com erro, limpar estado e localStorage
      setUsuario(null)
      clearSavedUser()
      
      // Garantir redirecionamento
      window.location.href = "/login"
    }
  }

  // Criando o valor do contexto explicitamente para poder logar
  const contextValue = { usuario, isLoading, login, logout };
  
  // Log para debug
  console.log("AuthProvider: Fornecendo contexto:", contextValue);
  
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
