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
import QRCode from "qrcode";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ModalPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: () => void;
  onPaymentExpired?: () => void;
  appointmentId: string;
  phone: string;
  paymentData: {
    pixCode: string;
    amount: number;
    createdAt: Date;
  };
}

export function ModalPayment({
  isOpen,
  onClose,
  appointmentId,
  phone,
  onPaymentExpired,
  paymentData,
}: ModalPaymentProps) {
  const leftSeconds = Math.max(
    0,
    Math.floor(
      (new Date(paymentData.createdAt.getTime() + 5 * 60 * 1000).getTime() -
        new Date().getTime()) /
        1000
    )
  );
  const [copied, setCopied] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(leftSeconds); // 5 minutos em segundos
  const [progress, setProgress] = React.useState(100);
  const [qrCodeBase64, setQrCodeBase64] = React.useState<string>("");
  const router = useRouter();
  // Função para gerar o QR Code em base64
  const generateQRCode = async (pixCode: string) => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(pixCode, {
        width: 128,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeBase64(qrCodeDataURL);
    } catch (err) {
      console.error("Erro ao gerar QR Code:", err);
    }
  };

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

  // Reset do timer quando o modal abre e gera o QR Code
  React.useEffect(() => {
    if (isOpen) {
      generateQRCode(paymentData.pixCode);
    }
  }, [isOpen, paymentData.pixCode]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função para verificar se o pagamento foi realizado
  React.useEffect(() => {
    if (!appointmentId) return;

    const startTime = Date.now();
    const TIMEOUT = 5 * 60 * 1000; // 5 minutos em milissegundos
    let eventSource: EventSource | null = null;

    const createEventSource = () => {
      // Se já existe uma conexão, feche-a
      if (eventSource) {
        eventSource.close();
      }

      // Verifica se já passou do timeout
      if (Date.now() - startTime >= TIMEOUT) {
        console.log("Timeout atingido após 5 minutos");
        return;
      }

      // Cria nova conexão
      eventSource = new EventSource(
        `/api/webhooks/paggue?appointmentId=${appointmentId}`
      );

      eventSource.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "payment" && data.appointmentId === appointmentId) {
          let formattedPhone = phone.replace(/\D/g, "");
          formattedPhone = formattedPhone.replace(/^55/, "");
          toast.success("Pagamento realizado com sucesso!");
          router.push(`/agendamentos?phone=${formattedPhone}`);
          onClose();
          if (eventSource) {
            eventSource.close();
          }
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        if (eventSource) {
          eventSource.close();
        }

        // Tenta reconectar após 1 segundo se ainda estiver dentro do timeout
        if (Date.now() - startTime < TIMEOUT) {
          setTimeout(createEventSource, 1000);
        }
      };
    };

    // Inicia a primeira conexão
    createEventSource();

    // Cleanup function
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [appointmentId, onClose, phone, router]);

  const handleOnClose = () => {
    let formattedPhone = phone.replace(/\D/g, "");
    formattedPhone = formattedPhone.replace(/^55/, "");
    toast.error("Pagamento ainda não realizado!");
    router.push(`/agendamentos?phone=${formattedPhone}`);
    setQrCodeBase64("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnClose}>
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
                  {qrCodeBase64 && (
                    <Image
                      src={qrCodeBase64}
                      alt="QR Code PIX"
                      className="w-32 h-32 object-contain"
                      width={128}
                      height={128}
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Escaneie o QR Code com seu app de pagamentos
                </p>
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
