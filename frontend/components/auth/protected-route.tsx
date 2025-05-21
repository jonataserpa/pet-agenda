"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

// Lista de páginas que não precisam de autenticação
const publicPages = ['/login']

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { usuario, isLoading } = useAuth()
  const router = useRouter()
  
  // Este efeito é executado após a renderização, não durante
  useEffect(() => {
    // Obtém o pathname da URL atual
    const pathname = window.location.pathname
    
    // Verifica se a página atual não é pública e o usuário não está autenticado
    const isPublicPage = publicPages.includes(pathname)
    
    if (!isLoading && !usuario && !isPublicPage) {
      console.log(`ProtectedRoute: Redirecionando de ${pathname} para /login (não autenticado)`)
      router.push('/login')
    }
  }, [usuario, isLoading, router])

  // Mostramos um indicador de carregamento enquanto verificamos a autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Renderizar o conteúdo normalmente - o redirecionamento acontece no useEffect
  return <>{children}</>
}