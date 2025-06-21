"use client";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimeSlotCarousel } from "@/components/TimeSlotCarousel";
import { ModalForm } from "@/components/ModalForm";
import { ptBR } from "react-day-picker/locale";
import ModalPayment from "./ModalPayment";
import { useCreateAppointment } from "@/app/contexts/appointment/appointment.hooks";

export function MainCalendar() {
  const { getTimeSlots, isGettingTimeSlots } = useCreateAppointment();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [date, setDate] = React.useState<Date | undefined>(today);
  const [month, setMonth] = React.useState<Date | undefined>(today);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    Date | undefined
  >(undefined);
  const [qrCode, setQrCode] = React.useState<string | undefined>(undefined);
  const [phone, setPhone] = React.useState<string | undefined>(undefined);
  const [appointmentId, setAppointmentId] = React.useState<string | undefined>(undefined);
  const [timeSlots, setTimeSlots] = React.useState<Date[]>([]);

  // Buscar timeSlots quando uma data for selecionada
  React.useEffect(() => {
    if (date) {
      const fetchTimeSlots = async () => {
        try {
          const slots = await getTimeSlots(date);
          setTimeSlots(slots);
        } catch (error) {
          console.error("Erro ao buscar horários:", error);
          setTimeSlots([]);
        }
      };
      
      fetchTimeSlots();
    }
  }, [date]);

  const handleSchedule = () => {
    setIsConfirmModalOpen(true);
  };

  const handleModalClose = () => {
    setIsConfirmModalOpen(false);
  };

  const handleFormSubmit = (data: { qrCode: string, phone: string, appointmentId: string }) => {
    setIsPaymentModalOpen(true);
    setPhone(data.phone);
    setQrCode(data.qrCode);
    setAppointmentId(data.appointmentId);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
  };

  const handleSelect = (date: Date) => {
    setDate(date);
    setSelectedDateTime(undefined); // Reset selected time when date changes
  };

  return (
    <>
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader>
          <CardTitle>Agendamento</CardTitle>
          <CardDescription>Encontre uma data e horário</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <div className="flex">
            <Calendar
              required
              locale={ptBR}
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={date}
              className="p-0 m-0"
              onSelect={handleSelect}
              disabled={(date) => {
                return date.getTime() < today.getTime();
              }}
            />
          </div>
          {date && (
            <div className="flex w-full">
              <TimeSlotCarousel 
                onDateTimeSelect={setSelectedDateTime} 
                timeSlots={timeSlots} 
                isLoading={isGettingTimeSlots} 
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-end">
            <Button
              className="w-full"
              onClick={handleSchedule}
              disabled={!selectedDateTime}
            >
              Agendar
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ModalForm
        isOpen={isConfirmModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        selectedDateTime={selectedDateTime}
      />

      <ModalPayment
        isOpen={isPaymentModalOpen}
        phone={phone!}
        onClose={handlePaymentModalClose}
        appointmentId={appointmentId || ""}
        paymentData={{
          pixCode: qrCode || "",
          amount: 10.0,
          createdAt: new Date(),
        }}
      />
    </>
  );
}
