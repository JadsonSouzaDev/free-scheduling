"use client";

import { useAppointments } from "@/app/contexts/appointment/appointment.hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AppointmentsList() {
  const { appointments, isLoading, error, mutate } = useAppointments();

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">
          Erro ao carregar appointments: {error.message}
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Nenhum appointment encontrado.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Appointments</h2>
        <button
          onClick={() => mutate()}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Atualizar
        </button>
      </div>
      
      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardHeader>
              <CardTitle className="text-lg">{appointment.clientName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Telefone:</strong> {appointment.clientPhone}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Data:</strong> {formatDateTime(appointment.date)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Status:</strong> {appointment.status}
                </p>
                {appointment.payment && (
                  <div className="mt-2 p-2 bg-muted rounded">
                    <p className="text-xs">
                      <strong>Pagamento:</strong> {appointment.payment.status}
                    </p>
                    <p className="text-xs">
                      <strong>Valor:</strong> R$ {appointment.payment.amount}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 