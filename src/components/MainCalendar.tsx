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

export function MainCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [date, setDate] = React.useState<Date | undefined>(today);
  const [month, setMonth] = React.useState<Date | undefined>(today);
  const [time, setTime] = React.useState<string | undefined>(undefined);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    Date | undefined
  >(undefined);
  const [qrCode, setQrCode] = React.useState<string | undefined>(undefined);

  const handleSchedule = () => {
    if (!date || !time) {
      return;
    }
    // Create date object with time
    const dateWithTime = new Date(date);
    dateWithTime.setHours(
      parseInt(time.split(":")[0]),
      parseInt(time.split(":")[1]),
      0,
      0
    );
    setSelectedDateTime(dateWithTime);
    setIsConfirmModalOpen(true);
  };

  const handleModalClose = () => {
    setIsConfirmModalOpen(false);
  };

  const handleFormSubmit = (data: { qrCode: string }) => {
    setIsPaymentModalOpen(true);
    setQrCode(data.qrCode);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
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
              locale={ptBR}
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={date}
              className="p-0 m-0"
              onSelect={setDate}
              disabled={(date) => {
                return date.getTime() < today.getTime();
              }}
            />
          </div>
          <div className="flex w-full">
            <TimeSlotCarousel onTimeSelect={setTime} />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-end">
            <Button
              className="w-full"
              onClick={handleSchedule}
              disabled={!date || !time}
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
        onClose={handlePaymentModalClose}
        onPaymentSuccess={() => {
          // Lógica quando o pagamento for confirmado
          console.log("Pagamento realizado!");
        }}
        onPaymentExpired={() => {
          // Lógica quando o pagamento expirar
          console.log("Pagamento expirado!");
        }}
        paymentData={{
          pixCode: qrCode || "",
          amount: 10.0,
          createdAt: new Date(),
        }}
      />
    </>
  );
}
