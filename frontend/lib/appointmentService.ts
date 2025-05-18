import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

const appointmentApi = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const appointmentService = {
  async list() {
    const { data } = await appointmentApi.get('/appointments');
    return data;
  },
  async save(appointment: any) {
    if (appointment.id) {
      const { data } = await appointmentApi.put(`/appointments/${appointment.id}`, appointment);
      return data;
    } else {
      const { data } = await appointmentApi.post('/appointments', appointment);
      return data;
    }
  },
  async delete(id: string) {
    const { data } = await appointmentApi.delete(`/appointments/${id}`);
    return data;
  },
  async upload(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await appointmentApi.post(`/appointments/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
}; 