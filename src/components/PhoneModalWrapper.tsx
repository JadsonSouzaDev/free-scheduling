"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PhoneModal } from "./PhoneModal";

interface PhoneModalWrapperProps {
  phone?: string;
}

export function PhoneModalWrapper({ phone }: PhoneModalWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    
    // Cria novos search params
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("phone", cleanPhone);
    
    // Navega para a mesma página com o parâmetro phone
    router.push(`${pathname}?${newSearchParams.toString()}`);
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