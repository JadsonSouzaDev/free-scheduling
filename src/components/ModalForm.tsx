"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAppointment } from "@/app/contexts/appointment/appointment.hooks";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { qrCode: string, phone: string, appointmentId: string }) => void;
  selectedDateTime?: Date;
}

export function ModalForm({ isOpen, onClose, onSubmit, selectedDateTime }: ModalFormProps) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const { createAppointment, isCreating } = useCreateAppointment();

  const formatPhone = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "");
    
    // Aplica a máscara (99) 99999-9999
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || phone.replace(/\D/g, "").length !== 11 || !selectedDateTime) {
      return;
    }
    
    try {
      // Chama a action do servidor via SWR
      const {qrCode, appointmentId} = await createAppointment({
        client_name: name.trim(),
        client_phone: phone,
        date: selectedDateTime,
      });

      // Chama o callback do componente pai
      onSubmit({ qrCode, phone: phone.replace(/\D/g, ""), appointmentId });
      
      // Limpa os campos após o envio
      setName("");
      setPhone("");
      onClose();
    } catch (error) {
      console.error("Erro ao criar appointment:", error);
      // Aqui você pode adicionar um toast ou notificação de erro
    }
  };

  const handleCancel = () => {
    setName("");
    setPhone("");
    onClose();
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-start">Confirmar Agendamento</DialogTitle>
          
          {selectedDateTime && (
            <div className="mt-2 p-3 bg-muted rounded-md">
              <span className="text-sm font-medium">Data e horário selecionado:</span>
              <br />
              <span className="text-xs text-muted-foreground">
                {formatDateTime(selectedDateTime)}
              </span>
            </div>
          )}
          <DialogDescription className="text-[11px]">
            Preencha seus dados e realize o pagamento via PIX para confirmar o agendamento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 my-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              className="text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome completo"
              required
              disabled={isCreating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              className="text-sm"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(99) 99999-9999"
              required
              maxLength={15}
              disabled={isCreating}
            />
          </div>
          <DialogFooter className="flex justify-end mt-6">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isCreating}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!name.trim() || phone.replace(/\D/g, "").length !== 11 || isCreating}
            >
              {isCreating ? "Criando..." : "Confirmar Agendamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 