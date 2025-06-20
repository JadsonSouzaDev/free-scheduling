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
import { ptBR } from "react-day-picker/locale";

export function MainCalendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [date, setDate] = React.useState<Date | undefined>(today);
  const [month, setMonth] = React.useState<Date | undefined>(today);
  const [time, setTime] = React.useState<string | undefined>(undefined);

  const handleSchedule = () => {
    if (!date || !time) {
      return;
    }
    // Create date object with time
    const dateWithTime = new Date(date);
    dateWithTime.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]), 0, 0);
    console.log(dateWithTime);
  };
  
  return (
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
          <Button className="w-full" onClick={handleSchedule}>Agendar</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
