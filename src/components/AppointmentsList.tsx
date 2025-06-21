import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppointments } from "@/app/contexts/appointment/appointment.action";
import { Appointment, AppointmentStatus, PaymentType } from "@/app/contexts/appointment/appointment.model";
import { formatPhone } from "@/lib/phone";

const appointmentStatus: Record<AppointmentStatus, string> = {
  waiting_payment: "Pendente de pagamento",
  paid: "Pago",
  completed: "Completo",    
  cancelled: "Cancelado",
}

const paymentType: Record<PaymentType, string> = {
  pix: "PIX",
  manual: "Manual",
}

export async function AppointmentsList() {  
  const appointments = await getAppointments();

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
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Nenhum appointment encontrado.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Appointments</h2>
        {/* <button
          onClick={() => {}}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Atualizar
        </button> */}
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
                {appointment.payment && (
                  <div className="mt-2 p-2 bg-muted rounded">
                    <p className="text-xs">
                      <strong>Pagamento:</strong> {paymentType[appointment.payment.type as PaymentType]}
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