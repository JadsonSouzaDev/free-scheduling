"use client";

import * as React from "react";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TimeSlotCarouselProps = {
  onTimeSelect: (time: string) => void;
}

export function TimeSlotCarousel({ onTimeSelect }: TimeSlotCarouselProps) {
  // Gerar horários das 08h às 22h com intervalos de 30 minutos
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 22;

    for (let hour = startHour; hour <= endHour; hour++) {
      // Adicionar horário com minutos :00
      slots.push(`${hour.toString().padStart(2, "0")}:00`);

      // Adicionar horário com minutos :30 (exceto para o último horário)
      if (hour < endHour) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();
  
  // Inicializar com o primeiro horário já selecionado
  const [selectedTime, setSelectedTime] = React.useState<string>(timeSlots[0]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    onTimeSelect(selectedTime);
  }, [selectedTime, onTimeSelect]);

  const nextTime = () => {
    const newIndex = (currentIndex + 1) % timeSlots.length;
    setCurrentIndex(newIndex);
    setSelectedTime(timeSlots[newIndex]); // Seleciona automaticamente
  };

  const prevTime = () => {
    const newIndex = (currentIndex - 1 + timeSlots.length) % timeSlots.length;
    setCurrentIndex(newIndex);
    setSelectedTime(timeSlots[newIndex]); // Seleciona automaticamente
  };

  const selectTime = (time: string) => {
    setSelectedTime(time);
    setCurrentIndex(timeSlots.indexOf(time));
  };

  // Função para navegar para um período específico
  const navigateToPeriod = (period: 'manha' | 'tarde' | 'noite') => {
    let targetIndex = 0;
    
    switch (period) {
      case 'manha':
        // Primeiro horário entre 08:00 e 11:30
        targetIndex = timeSlots.findIndex(time => {
          const hour = parseInt(time.split(':')[0]);
          return hour >= 8 && hour <= 11;
        });
        break;
      case 'tarde':
        // Primeiro horário entre 12:00 e 17:30
        targetIndex = timeSlots.findIndex(time => {
          const hour = parseInt(time.split(':')[0]);
          return hour >= 12 && hour <= 17;
        });
        break;
      case 'noite':
        // Primeiro horário entre 18:00 e 22:00
        targetIndex = timeSlots.findIndex(time => {
          const hour = parseInt(time.split(':')[0]);
          return hour >= 18 && hour <= 22;
        });
        break;
    }
    
    // Se não encontrar, usar o primeiro horário disponível
    if (targetIndex === -1) {
      targetIndex = 0;
    }
    
    setCurrentIndex(targetIndex);
    setSelectedTime(timeSlots[targetIndex]); // Seleciona automaticamente
  };

  return (
    <div className="w-full">
      {/* Horário selecionado */}
      {selectedTime && (
        <div className="mb-4">
          {/* <p className="text-sm text-muted-foreground">Horário selecionado: {selectedTime}</p> */}
          {/* <p className="text-xl font-bold text-primary">{selectedTime}</p> */}
        </div>
      )}

      {/* Carrossel compacto */}
      <div className="flex items-center justify-between gap-2">
        {/* Botão Anterior */}
        <Button
          variant="outline"
          size="icon"
          onClick={prevTime}
          className="h-8 w-8 shrink-0"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>

        {/* Horário atual */}
        <div className="flex-1 text-center">
          <Button
            variant={
              selectedTime === timeSlots[currentIndex] ? "default" : "outline"
            }
            size="sm"
            onClick={() => selectTime(timeSlots[currentIndex])}
            className="min-w-[100px] font-medium"
          >
            {timeSlots[currentIndex]}
          </Button>
        </div>

        {/* Botão Próximo */}
        <Button
          variant="outline"
          size="icon"
          onClick={nextTime}
          className="h-8 w-8 shrink-0"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Indicadores de posição compactos */}
      <div className="flex justify-center mt-3 gap-1">
        {timeSlots.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              index === currentIndex ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Navegação rápida por período */}
      <div className="mt-4 grid grid-cols-3 justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPeriod('manha')}
          className="text-xs"
        >
          Manhã
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPeriod('tarde')}
          className="text-xs"
        >
          Tarde
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPeriod('noite')}
          className="text-xs"
        >
          Noite
        </Button>
      </div>
    </div>
  );
}
