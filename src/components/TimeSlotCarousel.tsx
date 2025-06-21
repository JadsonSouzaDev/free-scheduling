"use client";

import * as React from "react";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TimeSlotCarouselProps = {
  onDateTimeSelect: (date: Date) => void;
  timeSlots: Date[];
  isLoading: boolean;
}

export function TimeSlotCarousel({ onDateTimeSelect, timeSlots, isLoading }: TimeSlotCarouselProps) {
  
  const [selecteDateTime, setSelectedDateTime] = React.useState<Date | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  // Atualizar quando timeSlots mudar
  useEffect(() => {
    if (timeSlots.length > 0) {
      setSelectedDateTime(timeSlots[0]);
      setCurrentIndex(0);
    } else {
      setSelectedDateTime(undefined);
      setCurrentIndex(0);
    }
  }, [timeSlots]);

  useEffect(() => {
    if (selecteDateTime) {
      onDateTimeSelect(selecteDateTime);
    }
  }, [selecteDateTime, onDateTimeSelect]);

  if (isLoading) {
    return <div className="text-center text-sm text-muted-foreground">Carregando horários disponíveis...</div>;
  }

  if (timeSlots.length === 0) {
    return <div className="text-center text-sm text-muted-foreground">Nenhum horário disponível para esta data</div>;
  }

  const nextTime = () => {
    const newIndex = (currentIndex + 1) % timeSlots.length;
    setCurrentIndex(newIndex);
    setSelectedDateTime(timeSlots[newIndex]); // Seleciona automaticamente
  };

  const prevTime = () => {
    const newIndex = (currentIndex - 1 + timeSlots.length) % timeSlots.length;
    setCurrentIndex(newIndex);
    setSelectedDateTime(timeSlots[newIndex]); // Seleciona automaticamente
  };

  const selectDateTime = (date: Date) => {
    setSelectedDateTime(date);
    setCurrentIndex(timeSlots.indexOf(date));
  };

  // Função para verificar se existem slots em um período específico
  const hasSlotsInPeriod = (period: 'manha' | 'tarde' | 'noite') => {
    switch (period) {
      case 'manha':
        return timeSlots.some(time => {
          const hour = time.getHours();
          return hour >= 8 && hour <= 11;
        });
      case 'tarde':
        return timeSlots.some(time => {
          const hour = time.getHours();
          return hour >= 12 && hour <= 17;
        });
      case 'noite':
        return timeSlots.some(time => {
          const hour = time.getHours();
          return hour >= 18 && hour <= 22;
        });
      default:
        return false;
    }
  };

  // Função para navegar para um período específico
  const navigateToPeriod = (period: 'manha' | 'tarde' | 'noite') => {
    let targetIndex = 0;
    
    switch (period) {
      case 'manha':
        // Primeiro horário entre 08:00 e 11:30
        targetIndex = timeSlots.findIndex(time => {
          const hour = time.getHours();
          return hour >= 8 && hour <= 11;
        });
        break;
      case 'tarde':
        // Primeiro horário entre 12:00 e 17:30
        targetIndex = timeSlots.findIndex(time => {
          const hour = time.getHours();
          return hour >= 12 && hour <= 17;
        });
        break;
      case 'noite':
        // Primeiro horário entre 18:00 e 22:00
        targetIndex = timeSlots.findIndex(time => {
          const hour = time.getHours();
          return hour >= 18 && hour <= 22;
        });
        break;
    }
    
    // Se não encontrar, usar o primeiro horário disponível
    if (targetIndex === -1) {
      targetIndex = 0;
    }
    
    setCurrentIndex(targetIndex);
    setSelectedDateTime(timeSlots[targetIndex]); // Seleciona automaticamente
  };

  return (
    <div className="w-full">
      {/* Horário selecionado */}
      {selecteDateTime && (
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
              selecteDateTime === timeSlots[currentIndex] ? "default" : "outline"
            }
            size="sm"
            onClick={() => selectDateTime(timeSlots[currentIndex])}
            className="min-w-[100px] font-medium"
          >
            {timeSlots[currentIndex].toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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
          disabled={!hasSlotsInPeriod('manha')}
          className="text-xs"
        >
          Manhã
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPeriod('tarde')}
          disabled={!hasSlotsInPeriod('tarde')}
          className="text-xs"
        >
          Tarde
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPeriod('noite')}
          disabled={!hasSlotsInPeriod('noite')}
          className="text-xs"
        >
          Noite
        </Button>
      </div>
    </div>
  );
}
