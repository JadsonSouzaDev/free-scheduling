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

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phone: string) => void;
}

export function PhoneModal({ isOpen, onClose, onSubmit }: PhoneModalProps) {
  const [phone, setPhone] = React.useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.replace(/\D/g, "").length !== 11) {
      return;
    }
    
    onSubmit(phone);
    setPhone("");
  };

  const handleCancel = () => {
    setPhone("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-start">Consultar Agendamentos</DialogTitle>
          <DialogDescription className="text-sm">
            Digite seu número de telefone para visualizar seus agendamentos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 my-6">
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
              autoFocus
            />
          </div>
          <DialogFooter className="flex justify-end mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={phone.replace(/\D/g, "").length !== 11}
            >
              Consultar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 