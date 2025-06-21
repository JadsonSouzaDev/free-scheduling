import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppointments } from "@/app/contexts/appointment/appointment.action";
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
  phone: string;
}

export async function AppointmentsList({ phone }: AppointmentListProps) {  
  const appointments = await getAppointments(phone);

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

  if (!appointments) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-muted-foreground">Nenhum agendamento encontrado.</div>
        <ConsultOtherPhoneButton />
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Agendamentos</h2>
        <ConsultOtherPhoneButton />
      </div>
      
      <div className="grid gap-4">
        {appointments.map((appointment: Appointment) => (
          <Card key={appointment.id}>
            <CardHeader>
              <CardTitle className="text-lg">{appointment.clientName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Telefone:</strong> {formatPhone(appointment.clientPhone)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Data:</strong> {formatDateTime(appointment.date)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Status:</strong> {appointmentStatus[appointment.status as AppointmentStatus]}
                </p>
                {/* {appointment.payment && (
                  <div className="mt-2 p-2 bg-muted rounded">
                    <p className="text-xs">
                      <strong>Pagamento:</strong> {paymentType[appointment.payment.type as PaymentType]}
                    </p>
                    <p className="text-xs">
                      <strong>Valor:</strong> R$ {appointment.payment.amount}
                    </p>
                  </div>
                )} */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 