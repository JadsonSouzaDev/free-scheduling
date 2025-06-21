"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { createAppointment, getAppointments, CreateAppointmentData } from "./appointment.action";
import { Appointment } from "./appointment.model";

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

// Hook para buscar appointments usando a action
export function useAppointments() {
  const { data, error, isLoading, mutate } = useSWR<Appointment[]>(
    "/appointments",
    async () => {
      return await getAppointments();
    }
  );

  return {
    appointments: data || [],
    isLoading,
    error,
    mutate,
  };
} 