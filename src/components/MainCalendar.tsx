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

export function MainCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [date, setDate] = React.useState<Date | undefined>(today);
  const [month, setMonth] = React.useState<Date | undefined>(today);
  const [time, setTime] = React.useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(undefined);

  const handleSchedule = () => {
    if (!date || !time) {
      return;
    }
    // Create date object with time
    const dateWithTime = new Date(date);
    dateWithTime.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]), 0, 0);
    setSelectedDateTime(dateWithTime);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDateTime(undefined);
  };

  const handleFormSubmit = (data: { name: string; phone: string }) => {
    console.log("Dados do agendamento:", {
      ...data,
      dateTime: selectedDateTime
    });
    // Aqui você pode adicionar a lógica para salvar o agendamento
    // Por exemplo, fazer uma chamada para uma API
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
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        selectedDateTime={selectedDateTime}
      />
    </>
  );
}
