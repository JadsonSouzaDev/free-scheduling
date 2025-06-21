"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PhoneModal } from "./PhoneModal";

interface PhoneModalWrapperProps {
  phone?: string;
}

export function PhoneModalWrapper({ phone }: PhoneModalWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Se não há telefone na URL, abre o modal
    if (!phone) {
      setIsModalOpen(true);
    } else {
      // Se há telefone, fecha o modal
      setIsModalOpen(false);
    }
  }, [phone]);

  const handlePhoneSubmit = (phoneNumber: string) => {
    // Remove caracteres especiais para usar na URL
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    
    // Navega para a mesma página com o parâmetro phone
    const url = new URL(window.location.href);
    url.searchParams.set("phone", cleanPhone);
    router.push(url.pathname + url.search);
  };

  const handleModalClose = () => {
    // Se o usuário fechar o modal sem fornecer telefone, redireciona para home
    // Mas só se não houver telefone na URL
    if (!phone) {
      router.push("/");
    }
  };

  return (
    <PhoneModal
      isOpen={isModalOpen}
      onClose={handleModalClose}
      onSubmit={handlePhoneSubmit}
    />
  );
} 