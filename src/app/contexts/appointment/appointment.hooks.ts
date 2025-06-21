"use client";

import { useState } from "react";
import { mutate } from "swr";
import { createAppointment, CreateAppointmentData } from "./appointment.action";


// Hook para criar um novo appointment
export function useCreateAppointment() {
  const [isCreating, setIsCreating] = useState(false);

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

  return {
    createAppointment: createAppointmentMutation,
    isCreating,
  };
}