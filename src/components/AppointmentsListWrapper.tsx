"use client";
import { useState } from "react";
import { AppointmentStatus, PaymentStatus, PaymentType } from "@/app/contexts/appointment/appointment.model";
import { AppointmentsList } from "./AppointmentsList";
import ModalPayment from "./ModalPayment";
import { useRouter } from "next/navigation";

type SerializedAppointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  date: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  payment: {
    id: string;
    externalId: string;
    amount: number;
    status: PaymentStatus;
    paidAt: string | null;
    qrCode: string;
    type: PaymentType;
    createdAt: string;
    updatedAt: string;
  };
}

type AppointmentsListWrapperProps = {
  appointments: SerializedAppointment[];
}

export function AppointmentsListWrapper({ appointments }: AppointmentsListWrapperProps) {
  const router = useRouter();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{
    phone: string;
    pixCode: string;
    amount: number;
    createdAt: Date;
  } | null>(null);

  const handlePaymentClick = (appointment: SerializedAppointment) => {
    setSelectedPayment({
      phone: appointment.clientPhone,
      pixCode: appointment.payment.qrCode,
      amount: appointment.payment.amount,
      createdAt: new Date(appointment.payment.createdAt),
    });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    setSelectedPayment(null);
    router.refresh();
  };

  // Converte os dados serializados de volta para objetos com Date
  const appointmentsWithDates = appointments.map(appointment => ({
    ...appointment,
    date: new Date(appointment.date),
    createdAt: new Date(appointment.createdAt),
    updatedAt: new Date(appointment.updatedAt),
    payment: {
      ...appointment.payment,
      paidAt: appointment.payment.paidAt ? new Date(appointment.payment.paidAt) : null,
      createdAt: new Date(appointment.payment.createdAt),
      updatedAt: new Date(appointment.payment.updatedAt),
    }
  }));

  return (
    <>
      <AppointmentsList 
        appointments={appointmentsWithDates} 
        onPaymentClick={(appointment) => {
          // Converte de volta para SerializedAppointment
          const serializedAppointment: SerializedAppointment = {
            ...appointment,
            date: appointment.date.toISOString(),
            createdAt: appointment.createdAt.toISOString(),
            updatedAt: appointment.updatedAt.toISOString(),
            payment: {
              ...appointment.payment,
              paidAt: appointment.payment.paidAt?.toISOString() || null,
              createdAt: appointment.payment.createdAt.toISOString(),
              updatedAt: appointment.payment.updatedAt.toISOString(),
            }
          };
          handlePaymentClick(serializedAppointment);
        }}
      />

      {selectedPayment && (
        <ModalPayment
          isOpen={isPaymentModalOpen}
          phone={selectedPayment.phone}
          onClose={handlePaymentModalClose}
          onPaymentSuccess={() => {
            // Lógica quando o pagamento for confirmado
            console.log("Pagamento realizado!");
            handlePaymentModalClose();
          }}
          onPaymentExpired={() => {
            // Lógica quando o pagamento expirar
            console.log("Pagamento expirado!");
            handlePaymentModalClose();
          }}
          paymentData={selectedPayment}
        />
      )}
    </>
  );
} 