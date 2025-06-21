"use client";

import { useState } from "react";
import { mutate } from "swr";
import { createAppointment, CreateAppointmentData, getTimeSlots } from "./appointment.action";


// Hook para criar um novo appointment
export function useCreateAppointment() {
  const [isCreating, setIsCreating] = useState(false);
  const [isGettingTimeSlots, setIsGettingTimeSlots] = useState(false);

  const createAppointmentMutation = async (data: CreateAppointmentData) => {
    setIsCreating(true);
    
    try {
      const appointment = await createAppointment(data);
      
      // Invalida o cache de appointments para forçar uma nova busca
      await mutate("/appointments");
      
      return appointment;
    } catch (error) {
      console.error("Erro ao criar appointment:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const getTimeSlotsMutation = async (date: Date) => {
    setIsGettingTimeSlots(true);
    try {
      // Criar startDate como primeiro intervalo válido após 08:00
      const startDate = new Date(date);
      startDate.setHours(8, 0, 0, 0);
      
      // Se a data atual for hoje, ajustar para o próximo intervalo de 30min
      if (date.toDateString() === new Date().toDateString()) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Se já passou das 21:30, não há horários disponíveis
        if (currentHour > 21 || (currentHour === 21 && currentMinute >= 30)) {
          return [];
        }
        
        // Calcular próximo intervalo de 30min
        let nextSlotHour = currentHour;
        const nextSlotMinute = currentMinute < 30 ? 30 : 0;
        
        if (nextSlotMinute === 0) {
          nextSlotHour += 1;
        }
        
        // Se o próximo horário for antes das 08:00, usar 08:00
        if (nextSlotHour < 8) {
          startDate.setHours(8, 0, 0, 0);
        } else {
          startDate.setHours(nextSlotHour, nextSlotMinute, 0, 0);
        }
      }
      
      // Criar endDate como 21:30 do dia
      const endDate = new Date(date);
      endDate.setHours(21, 30, 0, 0);
      const timeSlots = await getTimeSlots(startDate, endDate);
      return timeSlots;
    } catch (error) {
      console.error("Erro ao buscar horários:", error);
      throw error;
    } finally {
      setIsGettingTimeSlots(false);
    }
  };

  return {
    createAppointment: createAppointmentMutation,
    getTimeSlots: getTimeSlotsMutation,
    isCreating,
    isGettingTimeSlots,
  };
}