import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const clientApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const clientService = {
  async list() {
    const { data } = await clientApi.get('/clientes');
    return data;
  },
  async save(client: any) {
    if (client.id) {
      const { data } = await clientApi.put(`/clientes/${client.id}`, client);
      return data;
    } else {
      const { data } = await clientApi.post('/clientes', client);
      return data;
    }
  },
  async delete(id: string) {
    const { data } = await clientApi.delete(`/clientes/${id}`);
    return data;
  },
  async upload(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await clientApi.post(`/clientes/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
}; 