"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export function ConsultOtherPhoneButton() {
  const router = useRouter();
  const handleClick = () => {
    router.push('/agendamentos');
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleClick}
    >
      Mudar telefone
    </Button>
  );
} 