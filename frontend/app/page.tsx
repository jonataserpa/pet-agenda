"use client"

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout"
import { StatCard } from "@/components/ui/stat-card"
import { StatusBadge } from "@/components/ui/status-badge"
import { TrendingUp, Users, Calendar, AlertTriangle } from "lucide-react"
import { appointmentService } from "@/lib/appointmentService";
import { petService } from "@/lib/petService";
import { serviceService } from "@/lib/serviceService";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Define types for appointments
interface RecentAppointment {
  id: string;
  clientName: string;
  value: string;
  avatar?: string;
  data: string;
}

interface UpcomingAppointment {
  clientName: string;
  data: string;
  status: string;
  petName: string;
}

export default function Dashboard() {
  const [appointmentsToday, setAppointmentsToday] = useState(0);
  const [newClients, setNewClients] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalPets, setTotalPets] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch dashboard data from the backend
        const dashboardData = await appointmentService.getDashboardData();
        console.log('dashboardData:: ', dashboardData);
        setAppointmentsToday(dashboardData.totalDinheiroHoje);
        setNewClients(dashboardData.totalNovosClientes);
        setTotalAppointments(dashboardData.totalAgendamentos);
        setTotalPets(dashboardData.totalPets);
        setRecentAppointments(dashboardData.ultimosAgendamentos);
        setUpcomingAppointments(dashboardData.proximosAgendamentos);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Agendamentos Hoje" value={`R$ ${appointmentsToday}`} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Novos Clientes" value={newClients} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Agendamentos" value={totalAppointments} icon={<Calendar className="h-5 w-5" />} />
        <StatCard title="Pets Cadastrados" value={totalPets} icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Últimos Agendamentos</h2>
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?uppercase=false&name=${encodeURIComponent(appointment.clientName)}`} alt={appointment.clientName} />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.clientName}</p>
                    <p className="text-sm text-muted-foreground">Agendamento #{appointment.id}</p>
                  </div>
                </div>
                <p className="font-medium">{format(new Date(appointment.data), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Próximos Agendamentos</h2>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.clientName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.petName}</p>
                  </div>
                </div>
                {/* <StatusBadge status={appointment.status} /> */}
                <p className="font-medium">{format(new Date(appointment.data), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
