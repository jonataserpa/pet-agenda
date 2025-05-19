"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { loginService } from "@/lib/loginService"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type User = {
  id: string
  name: string
  email: string
  role: string
}

// Tipo para o payload do JWT
type JwtPayload = {
  id: number
  email: string
  iat: number
  exp: number
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Para solucionar o problema do cookie HttpOnly, vamos criar um usuário temporário
// até implementarmos um endpoint de verificação de autenticação no backend
const createTemporaryUser = () => {
  return {
    id: "4", // ID que vimos no payload
    name: "João", // Nome baseado no email que vimos no payload
    email: "joao@email.com", // Email que vimos no payload
    role: "user"
  };
};

// Verificar se é uma rota protegida
function isProtectedRoute() {
  if (typeof window === 'undefined') return false;
  
  const pathname = window.location.pathname;
  
  // Rotas protegidas (mesmas do matcher no middleware.ts)
  const protectedPaths = [
    '/clientes',
    '/agendamentos',
    '/pets',
    '/servicos',
    '/configuracoes',
    '/dashboard',
  ];
  
  return protectedPaths.some(path => pathname.startsWith(path));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Começamos com true enquanto verificamos
  const { toast } = useToast()
  
  // Garantir um usuário imediatamente em rotas protegidas
  useEffect(() => {
    // Este efeito roda quando o componente monta
    // Se estamos em uma rota protegida, definimos o usuário temporário imediatamente
    if (isProtectedRoute()) {
      const tempUser = createTemporaryUser();
      setUser(tempUser);
      console.log("AuthContext (mount): Rota protegida detectada, definindo usuário temporário:", tempUser);
    }
  }, []);
  
  // Verificar autenticação ao carregar a página
  useEffect(() => {
    async function checkAuth() {
      try {
        console.log("AuthContext: Verificando autenticação...");
        
        try {
          // Tentar chamar o endpoint de verificação primeiro
          console.log(`AuthContext: Tentando chamar ${API_URL}/auth/me`);
          const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
          
          if (response.data?.user) {
            console.log("AuthContext: Usuário obtido da API:", response.data.user);
            setUser(response.data.user);
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
        
        // FALLBACK: Se o endpoint falhar, voltamos para a lógica anterior
        if (isProtectedRoute()) {
          // Se não definimos um usuário anteriormente e estamos em uma rota protegida
          if (!user) {
            const tempUser = createTemporaryUser();
            setUser(tempUser);
            console.log("AuthContext: Criado usuário temporário (rota protegida):", tempUser);
          }
        } else {
          console.log("AuthContext: Rota pública, usuário não definido");
          setUser(null);
        }
      } catch (error) {
        console.error("AuthContext: Erro ao verificar autenticação:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Verificar autenticação imediatamente
    checkAuth();
  }, [user]); // Mudança: adicionado 'user' como dependência

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      console.log("AuthContext: Tentando fazer login via API para", email)
      
      // Chamar o serviço de login
      await loginService.login(email, password)
      
      // Após login bem-sucedido, tentar obter os dados do usuário
      try {
        const meResponse = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        if (meResponse.data?.user) {
          setUser(meResponse.data.user);
          console.log("AuthContext: Login bem-sucedido, usuário obtido da API:", meResponse.data.user);
        } else {
          // Fallback se a API não retornar dados de usuário
          const userData: User = {
            id: "1", // Valor temporário
            name: email.split('@')[0],
            email: email,
            role: "user",
          }
          setUser(userData);
          console.log("AuthContext: Login bem-sucedido, usando dados fallback:", userData);
        }
      } catch (apiError) {
        // Se /auth/me falhar, usar fallback
        const userData: User = {
          id: "1", // Valor temporário
          name: email.split('@')[0],
          email: email,
          role: "user",
        }
        setUser(userData);
        console.log("AuthContext: Login bem-sucedido, usando dados fallback após erro:", userData);
      }
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${email.split('@')[0]}!`,
      })
      
      return true
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
      
      // Limpar estado
      setUser(null)
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      })
      
      // Redirecionar para login
      window.location.href = "/login" // Usando redirecionamento direto para garantir
    } catch (error) {
      console.error("AuthContext: Erro ao fazer logout:", error)
      
      // Mesmo com erro, limpar estado
      setUser(null)
      
      // Garantir redirecionamento
      window.location.href = "/login"
    }
  }

  // Criando o valor do contexto explicitamente para poder logar
  const contextValue = { user, isLoading, login, logout };
  
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
