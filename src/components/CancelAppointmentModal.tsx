"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/app/contexts/appointment/appointment.model";
import { formatPhone } from "@/lib/phone";

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function CancelAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onConfirm,
  isLoading = false,
}: CancelAppointmentModalProps) {
  if (!appointment) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Cancelar Agendamento
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Cliente:</strong> {appointment.clientName}
            </p>
            <p className="text-sm">
              <strong>Telefone:</strong> {formatPhone(appointment.clientPhone)}
            </p>
            <p className="text-sm">
              <strong>Data e Hora:</strong> {formatDateTime(appointment.date)}
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Manter Agendamento
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Cancelando..." : "Confirmar Cancelamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 