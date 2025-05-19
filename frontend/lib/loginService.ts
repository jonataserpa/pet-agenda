import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginService = {
  async login(email: string, senha: string) {
    console.log(`LoginService: Enviando requisição de login para ${API_URL}/auth/login`);
    
    // Fazer a requisição de login
    const response = await axios.post(
      `${API_URL}/auth/login`,
      { email, senha },
      { withCredentials: true }
    );
    
    console.log(`LoginService: Login bem-sucedido, status: ${response.status}`);
    
    // Verificar cookies após login (apenas para debug)
    console.log(`LoginService: Cookies após login: ${document.cookie}`);
    
    return response.data;
  },
  
  async logout() {
    console.log(`LoginService: Enviando requisição de logout para ${API_URL}/auth/logout`);
    
    // Fazer a requisição de logout
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    
    console.log(`LoginService: Logout bem-sucedido, status: ${response.status}`);
    
    return response.data;
  }
}; 