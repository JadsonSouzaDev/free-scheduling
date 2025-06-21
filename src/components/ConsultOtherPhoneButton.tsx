"use client";
import { Button } from "@/components/ui/button";

export function ConsultOtherPhoneButton() {
  const handleClick = () => {
    window.location.href = '/agendamentos';
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleClick}
    >
      Consultar outro telefone
    </Button>
  );
} 