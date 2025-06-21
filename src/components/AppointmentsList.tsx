import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Appointment, AppointmentStatus } from "@/app/contexts/appointment/appointment.model";
import { formatPhone } from "@/lib/phone";
import { ConsultOtherPhoneButton } from "./ConsultOtherPhoneButton";

const appointmentStatus: Record<AppointmentStatus, string> = {
  waiting_payment: "Pagamento pendente",
  paid: "Pago",
  completed: "Completo",    
  cancelled: "Cancelado",
}

type AppointmentListProps = {
  appointments: Appointment[];
  onPaymentClick: (appointment: Appointment) => void;
}

export function AppointmentsList({ appointments, onPaymentClick }: AppointmentListProps) {  
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

  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-muted-foreground">Nenhum agendamento encontrado.</div>
        <ConsultOtherPhoneButton />
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <h2 className="text-2xl font-bold">Agendamentos</h2>
        <ConsultOtherPhoneButton />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map((appointment: Appointment) => (
          <Card key={appointment.id}>
            <CardHeader>
              <CardTitle className="mb-0">{appointment.clientName}</CardTitle>
            </CardHeader>
            <CardContent className="-mt-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  <strong>Telefone:</strong> {formatPhone(appointment.clientPhone)}
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Data:</strong> {formatDateTime(appointment.date)}
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Status:</strong> {appointmentStatus[appointment.status as AppointmentStatus]}
                </p>
                {appointment.status === 'waiting_payment' && (
                  <div className="mt-4">
                    <Button 
                      onClick={() => onPaymentClick(appointment)}
                      className="w-full"
                    >
                      Realizar Pagamento
                    </Button>
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