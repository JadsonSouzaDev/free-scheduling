"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Check, Clock } from "lucide-react";
import Image from "next/image";

interface ModalPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
  onPaymentExpired?: () => void;
  paymentData: {
    qrCodeImage: string; // base64 da imagem do QR Code
    pixCode: string;
    amount: number;
    createdAt: Date;
  };
}

export function ModalPayment({
  isOpen,
  onClose,
  onPaymentExpired,
  paymentData,
}: ModalPaymentProps) {
  const [copied, setCopied] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(300); // 5 minutos em segundos
  const [progress, setProgress] = React.useState(100);

  // Função para copiar o código PIX
  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(paymentData.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar código PIX:", err);
    }
  };

  // Função para formatar o tempo restante
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes <= 0 && remainingSeconds <= 0) {
      return "Expirado";
    }

    if (minutes < 1) {
      return `${remainingSeconds}s`;
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Efeito para controlar o timer regressivo
  React.useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onPaymentExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onPaymentExpired]);

  // Efeito para atualizar a barra de progresso
  React.useEffect(() => {
    const percentage = (timeLeft / 300) * 100;
    setProgress(percentage);
  }, [timeLeft]);

  // Reset do timer quando o modal abre
  React.useEffect(() => {
    if (isOpen) {
      setTimeLeft(300);
      setProgress(100);
    }
  }, [isOpen]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-start">Pagamento via PIX</DialogTitle>
          <DialogDescription className="text-[11px]">
            Escaneie o QR Code ou copie o código PIX para realizar o pagamento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Valor do pagamento */}
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(paymentData.amount)}
            </div>
            {/* <p className="text-sm text-muted-foreground">Valor a pagar</p> */}
          </div>

          {/* Timer e barra de progresso */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className="font-medium">
                Tempo restante: {formatTime(timeLeft)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* <p className="text-xs text-center text-muted-foreground">
              O pagamento expira em {formatTime(timeLeft)}
            </p> */}
          </div>

          {/* QR Code */}
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg inline-block">
                  <Image
                    src={paymentData.qrCodeImage}
                    alt="QR Code PIX"
                    className="w-32 h-32 object-contain"
                    width={128}
                    height={128}
                  />
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  Escaneie o QR Code com seu app de pagamentos
                </p> */}
              </div>
            </CardContent>
          </Card>

          {/* Código PIX copiável */}
          <div className="space-y-2">
            <div className="flex gap-2 mt-6">
              <Button
                type="button"
                onClick={copyPixCode}
                className="shrink-0 w-full"
              >
                {copied ? (
                  <div className="flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="">Código copiado!</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Copy className="h-4 w-4" />
                    <span className="">Clique para copiar o código PIX</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ModalPayment;
