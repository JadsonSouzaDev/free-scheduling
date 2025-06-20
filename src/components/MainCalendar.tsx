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

  const handleFormSubmit = (data: { name: string; phone: string }) => {
    console.log("Dados do agendamento:", {
      ...data,
      dateTime: selectedDateTime,
    });
    setIsPaymentModalOpen(true);
    // Aqui você pode adicionar a lógica para salvar o agendamento
    // Por exemplo, fazer uma chamada para uma API
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Agendamento</CardTitle>
          <CardDescription>Encontre uma data e horário</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-3 items-center">
          <Calendar
            locale={ptBR}
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={date}
            onSelect={setDate}
            className="bg-transparent p-0 w-full"
            disabled={(date) => {
              return date.getTime() < today.getTime();
            }}
          />
          <div className="space-y-3">
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
          qrCodeImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhIAAAISAQAAAACxRhsSAAAE30lEQVR4nO2dUY7bOAyGP64N5NEB5gBzFPsGPdKiR+oN7KPkAAXs1RBoST2/H8xHJDl09Td1qV6r7ctuq1VqtdsHjSPrm4ddA75nknRQJejVqZqqFLU2fK1oMpDK25uo2vsFlDHuQ+wnlA3wE4Av4/EME7kOvG9TB3cMZ4zNPAcCnk28ZcVz+NvH8PX2Muv53FQvDWhXr3Z+hrL+G1C/g0HVPUJ0D+WHwRg+zV2ABwE+CvxQOYpPxn2MP8EOFEzLzNOey8DbU8r78/V4BvdQk9uP1rK1x0i5PEGLT7YUy2e8owqYp/7vZzKuoJuMdBFqpHVPkZCG3v6qbHj1EMN8BGzrG2/dEydvsZ5Tf5fgqb9Xr+idb5XPNUzDUmpqvmhuUoEmqWcMopY5n+m60W9yyWSR2AvzTEUn6uK10NSPu8bprRGoLdr4eLVFzNqkNU2clE8xS2b6hxuJKP6uDqivU2DKO6h8z1NWkLqPVzYJp2k5p64M1fFgfpRRYMu6Rt3a0uubad1yO/m4FqJ+9EFmPB6yRM1pTVmwGh9EVPaSn7UWyPtx1VKZrK2pLryvfElb93oev9uEp3qau+K5C77bOPR7nnRQEkvJHwUuyzQqLP6+2BtOphAazHYN3EuyQrzvGQWx2dI+y0qGnVb0p39GQbQ8uf3db2Ut5hF9yMi5a31kkOEZ5+0+0zkghwTfFx5wP1CGPxBftDQcq4AnG/zlv68Mi0F6QuyeZbPBXr3ewZoCuO2Zc/FhZxO2Q/WTye19zXQ7mUL5v9Kf9eV47A9cKn+48eFwS4i7VQX3goaehY3nfeZUzQ4mDIt+q6WzF3eFVRY+GR4gQJHz+vFyfql3FDXctuMTJXRraOegFQxY0wS/C92Y9nLKSCfXtM3K6E08q6svFSmtl7db+wQccD7R8NSv4O9ZBVaRpSh5ftrL1ZSvU3p8mM1tbc4Zbd8ef9G7/T3pZtcz1ReCl9qzOPMKi46+Gu5YYF7/N9G75HOgbsPSUp9zFJV2a7fbU1B0ImKc64WhnRG76R1HyLx1yMXwe+GM3wlRb3hWjUL9ZLjWPGJzYFLwUMsFO9V43UYQ3/FJlhA2PtUt3U7WOLUwbNRvRzVwqF7oWuGTVaD+hluD0u9RYuZ72zPKw6P38y+8kNm7Fz7VYYCv5FHYK+aB2ykHbX7S7YvcIY09Q3N4XG+kdS/k3VwPUHviE5lH1vSkFxe4U0ZkFYwHUlxH5HkZ1uNNiEX/D6VqzvvuArMgYPul7jlqVK0DvhxX8T/UkPc/qZ8rLifAfwe+KyGLfZTJqme5u9m2uqPMdvV/3z2O7+Vz6F+T/IbUv+zAzmZh9zwAAAABJRU5ErkJggg==", // sua imagem base64
          pixCode:
            "00020126580014br.gov.bcb.pix0136a629532e-7693-4849-afd8-6c2b8c8c8c8c5204000053039865802BR5913Minha Empresa6008Brasilia62070503***6304E2CA",
          amount: 10.0,
          createdAt: new Date(),
        }}
      />
    </>
  );
}
