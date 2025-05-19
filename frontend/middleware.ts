import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Log para depuração - todos os cookies
  console.log(`Middleware: Rota acessada: ${pathname}`);
  console.log(`Middleware: Cookies disponíveis:`, req.cookies.getAll().map(c => c.name));
  
  const tokenCookie = req.cookies.get('token');
  
  // Log para depuração - cookie de token
  if (tokenCookie) {
    console.log(`Middleware: Cookie token encontrado. Cookie name=${tokenCookie.name}`);
    console.log(`Middleware: Cookie token primeiros 20 caracteres: ${tokenCookie.value.substring(0, 20)}...`);
  } else {
    console.log(`Middleware: Cookie token NÃO encontrado.`);
  }
  
  const token = tokenCookie?.value;

  // Rotas públicas que não precisam de token
  const publicPaths = ['/login', '/cadastro', '/api/auth/login', '/api/auth/logout'];
  if (publicPaths.some(path => pathname.startsWith(path)) || pathname === '/') { // Adicionei '/' como pública
    console.log(`Middleware: Rota pública (${pathname}), permitindo acesso.`);
    return NextResponse.next();
  }
  
  // Permitir acesso a assets estáticos e outras rotas de API que não sejam de autenticação
  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/'))) {
     console.log(`Middleware: Rota de recurso (${pathname}), permitindo acesso.`);
     return NextResponse.next();
  }


  if (!token) {
    console.log(`Middleware: Sem token, redirecionando para /login (rota: ${pathname})`);
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirectedFrom', pathname); // Opcional: para redirecionar de volta após login
    return NextResponse.redirect(loginUrl);
  }

  if (!JWT_SECRET) {
    console.error('Middleware: JWT_SECRET não definido nas variáveis de ambiente.');
    // Em produção, você pode querer redirecionar para uma página de erro ou login
    // Por enquanto, para desenvolvimento, pode permitir acesso ou logar erro.
    // Para segurança, vamos redirecionar para login se o secret não estiver lá.
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decodedToken = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    console.log(`Middleware: Token válido para ${pathname}. Payload:`, decodedToken.payload);
    return NextResponse.next();
  } catch (error) {
    console.log(`Middleware: Token inválido ou expirado, redirecionando para /login (rota: ${pathname}, erro: ${error})`);
    // Limpar cookie inválido
    const loginUrl = new URL('/login', req.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set('token', '', { maxAge: -1, path: '/' }); // Limpa o cookie
    return response;
  }
}

export const config = {
  // Defina aqui as rotas que DEVEM ser protegidas pelo middleware.
  // O middleware vai rodar ANTES de tentar acessar essas rotas.
  // Exclua rotas públicas, API routes de login/logout, assets.
  matcher: [
    // Lista explícita de rotas protegidas
    '/clientes/:path*',
    '/agendamentos/:path*',
    '/pets/:path*',
    '/servicos/:path*',
    '/configuracoes/:path*',
    '/dashboard/:path*',
    
    // Expressão regex para proteger outras rotas (exceto as públicas)
    // Comente esta linha se preferir usar apenas a lista explícita acima
    '/((?!api/auth/|_next/static|_next/image|favicon.ico|login|cadastro).*)',
  ],
};