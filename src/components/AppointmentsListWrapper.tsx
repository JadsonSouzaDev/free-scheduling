"use client";
import { useState } from "react";
import { AppointmentStatus, PaymentStatus, PaymentType } from "@/app/contexts/appointment/appointment.model";
import { AppointmentsList } from "./AppointmentsList";
import ModalPayment from "./ModalPayment";
import { useRouter, useSearchParams } from "next/navigation";

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
  isAdmin: boolean;
}

export function AppointmentsListWrapper({ appointments, isAdmin }: AppointmentsListWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{
    appointmentId: string;
    phone: string;
    pixCode: string;
    amount: number;
    createdAt: Date;
  } | null>(null);

  // Obtém a data atual do searchParams
  const currentDate = searchParams.get('date');

  // Converte a data do searchParams para Date sem problemas de timezone
  const getSelectedDate = () => {
    if (!currentDate) return undefined;
    
    // Parse da string YYYY-MM-DD para criar Date no timezone local
    const [year, month, day] = currentDate.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const handleDateChange = (date: Date | undefined) => {
    const params = new URLSearchParams(searchParams);
    
    if (date) {
      // Usa a data local sem conversão de timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      params.set('date', dateString);
    } else {
      params.delete('date');
    }
    
    router.push(`/agendamentos?${params.toString()}`);
  };

  const handlePaymentClick = (appointment: SerializedAppointment) => {
    setSelectedPayment({
      appointmentId: appointment.id,
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
        selectedDate={getSelectedDate()}
        onDateChange={handleDateChange}
        isAdmin={isAdmin}
      />

      {selectedPayment && (
        <ModalPayment
          appointmentId={selectedPayment.appointmentId}
          isOpen={isPaymentModalOpen}
          phone={selectedPayment.phone}
          onClose={handlePaymentModalClose}
          paymentData={selectedPayment}
        />
      )}
    </>
  );
} 