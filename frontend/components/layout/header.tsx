"use client"

import Link from "next/link"
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"

interface HeaderProps {
  title?: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { usuario, logout } = useAuth()
  
  // Log para depuração
  console.log("Header: Estado do usuário:", usuario);
  
  // Log adicional para entender quando o componente é renderizado
  useEffect(() => {
    console.log("Header: Componente montado, usuário:", usuario);
    // Ver o que está chegando no contexto
    console.log("Header: Valor de usuario?", usuario ? "sim" : "não");
    if (usuario) {
      console.log("Header: Detalhes do usuário:", {
        id: usuario.id,
        nome: usuario.nome ? `"${usuario.nome}"` : "undefined/null",
        email: usuario.email
      });
      
      // Log adicional para depurar o problema com o nome
      console.log("Header: Tipo do nome:", typeof usuario.nome);
      console.log("Header: Nome é string vazia?", usuario.nome === "");
      console.log("Header: Nome tem comprimento:", usuario.nome?.length || 0);
      
      if (usuario.nome) {
        try {
          const iniciais = usuario.nome
            .split(' ')
            .map(word => word[0])
            .join('');
          console.log("Header: Iniciais calculadas:", iniciais);
        } catch (error) {
          console.error("Header: Erro ao calcular iniciais:", error);
        }
      }
    }
  }, [usuario]);

  // Renderização condicional explícita para debug
  const renderUserMenu = usuario !== null;
  console.log("Header: Vai renderizar menu do usuário?", renderUserMenu);
  
  // Log fora dos fragmentos JSX para evitar erros
  if (renderUserMenu) {
    console.log("Header: Renderizando menu do usuário");
    console.log("Header: Nome do usuário para exibição:", usuario?.nome || "Sem nome");
  } else {
    console.log("Header: Renderizando botão de login");
  }

  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    if (!name) return 'U';
    
    try {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
    } catch (error) {
      console.error("Header: Erro ao gerar iniciais:", error);
      return 'U';
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-bold">
          Pet Agenda
        </Link>
        {title && (
          <span className="text-muted-foreground">
            {title}
            {subtitle && ` | ${subtitle}`}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <button className="p-2 rounded-full hover:bg-accent">
          <Bell className="h-5 w-5" />
        </button>

        {/* Adicionando verificação extra para debug */}
        {renderUserMenu ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full hover:bg-accent p-1 pr-2 outline-none">
              <Avatar>
                <AvatarImage src={`https://ui-avatars.com/api/?uppercase=false&name=${encodeURIComponent(usuario?.nome || '')}`} alt={usuario?.nome || 'Usuário'} />
                <AvatarFallback>
                  {getInitials(usuario?.nome || '')}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{usuario?.nome || 'Usuário'}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{usuario?.email}</span>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">
              <User className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        )}
      </div>
    </header>
  )
}
