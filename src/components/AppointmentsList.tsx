"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge} from "@/components/ui/badge";
import {
  Appointment,
  AppointmentStatus,
} from "@/app/contexts/appointment/appointment.model";
import { formatPhone } from "@/lib/phone";
import { ConsultOtherPhoneButton } from "./ConsultOtherPhoneButton";
import { DateFilter } from "./DateFilter";
import {
  payManually,
  completeAppointment,
  deleteAppointment,
} from "@/app/contexts/appointment/appointment.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CancelAppointmentModal } from "./CancelAppointmentModal";
import { useState } from "react";

const appointmentStatus: Record<AppointmentStatus, string> = {
  waiting_payment: "Pagamento pendente",
  paid: "Pago",
  completed: "Completo",
  cancelled: "Cancelado",
};

const appointmentStatusBadge: Record<AppointmentStatus, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  waiting_payment: "default",
  paid: "default",
  completed: "default",
  cancelled: "destructive",
};

type AppointmentListProps = {
  appointments: Appointment[];
  onPaymentClick: (appointment: Appointment) => void;
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
  isAdmin: boolean;
};

export function AppointmentsList({
  appointments,
  onPaymentClick,
  selectedDate,
  onDateChange,
  isAdmin,
}: AppointmentListProps) {
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handlePayManually = async (appointmentId: string) => {
    try {
      await payManually(appointmentId);
      toast.success("Pagamento realizado com sucesso!");
      router.refresh();
    } catch {
      toast.error("Erro ao realizar pagamento manual");
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      await completeAppointment(appointmentId);
      toast.success("Agendamento marcado como completo!");
      router.refresh();
    } catch {
      toast.error("Erro ao completar agendamento");
    }
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      await deleteAppointment(selectedAppointment.id);
      toast.success("Agendamento cancelado!");
      router.refresh();
    } catch {
      toast.error("Erro ao cancelar agendamento");
    } finally {
      setSelectedAppointment(null);
      setIsCancelModalOpen(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Agendamentos</h2>
        <div className="flex items-center gap-4">
          {/* <ConsultOtherPhoneButton /> */}
          <DateFilter selectedDate={selectedDate} onDateChange={onDateChange} />
        </div>
      </div>

      {!appointments || appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="text-muted-foreground">
            Nenhum agendamento encontrado.
          </div>
          <ConsultOtherPhoneButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((appointment: Appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle className="mb-0">{appointment.clientName}</CardTitle>
              </CardHeader>
              <CardContent className="-mt-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>Telefone:</strong>{" "}
                    {formatPhone(appointment.clientPhone)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Data:</strong> {formatDateTime(appointment.date)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <strong>Status:</strong>{" "}
                    <Badge variant={appointmentStatusBadge[appointment.status as AppointmentStatus] || "default"}>
                      {appointmentStatus[appointment.status as AppointmentStatus]}
                    </Badge>
                  </p>

                  {/* Botões de ação */}
                  <div className="mt-4 space-y-2">
                    {!isAdmin && appointment.status === "waiting_payment" && (
                      <Button
                        onClick={() => onPaymentClick(appointment)}
                        className="w-full"
                      >
                        Realizar Pagamento
                      </Button>
                    )}

                    {/* Botões de admin */}
                    {isAdmin && appointment.status === "waiting_payment" && (
                      <Button
                        onClick={() => handlePayManually(appointment.id)}
                        variant="outline"
                        className="w-full"
                      >
                        Pagar Manualmente
                      </Button>
                    )}

                    {isAdmin && appointment.status === "paid" && (
                      <Button
                        onClick={() =>
                          handleCompleteAppointment(appointment.id)
                        }
                        variant="default"
                        className="w-full"
                      >
                        Completar Agendamento
                      </Button>
                    )}

                    {isAdmin && appointment.status !== "completed" && (
                      <Button
                        onClick={() =>
                          handleCancelAppointment(appointment)
                        }
                        variant="destructive"
                        className="w-full"
                      >
                        Cancelar Agendamento
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isCancelModalOpen && selectedAppointment && (
        <CancelAppointmentModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          appointment={selectedAppointment}
          onConfirm={handleConfirmCancelAppointment}
        />
      )}
    </div>
  );
}
