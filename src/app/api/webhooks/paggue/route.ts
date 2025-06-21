"use server";

import { NextRequest } from "next/server";
import { PixPaymentWebhook } from "@/app/gateways/paggue.gateway";
import { PaymentStatus } from "@/app/contexts/appointment/appointment.model";
import { updatePaymentStatus } from "@/app/contexts/appointment/appointment.action";
import EventEmitter from "events";
import { neon } from "@neondatabase/serverless";


interface PaymentEvent {
  type: 'payment' | 'connected';
  appointmentId?: string;
}

// Criando um EventEmitter global para gerenciar os eventos de pagamento
const paymentEvents = new EventEmitter();

// Endpoint GET para SSE
export async function GET(request: NextRequest) {

  const appointmentId = request.nextUrl.searchParams.get('appointmentId');

  // Paggue webook registration
  if (!appointmentId) {
    return new Response("OK");
  }
  
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  const sql = neon(process.env.DATABASE_URL!);

  const paymentStatus = await sql`
    SELECT status FROM payments WHERE appointment_id = ${appointmentId}
  `;

  // Função para enviar eventos para o cliente
  const sendEvent = async (data: PaymentEvent) => {
    const eventString = `data: ${JSON.stringify(data)}\n\n`;
    await writer.write(encoder.encode(eventString));
  };

  if (paymentStatus.length > 0 && paymentStatus[0].status === "paid") {
    sendEvent({ type: 'payment', appointmentId: appointmentId! });
  }

  // Listener para eventos de pagamento
  const onPayment = (appointmentIdParam: string) => {
    if (appointmentId === appointmentIdParam) {
      sendEvent({ type: 'payment', appointmentId: appointmentIdParam });
    }
  };

  // Registra o listener
  paymentEvents.on('payment.approved', onPayment);

  // Remove o listener quando a conexão for fechada
  request.signal.addEventListener('abort', () => {
    paymentEvents.off('payment.approved', onPayment);
  });

  // Envia um evento inicial para manter a conexão viva
  sendEvent({ type: 'connected' });

  return new Response(stream.readable, { headers });
}

export async function POST(request: NextRequest) {
  const body = await request.json() as PixPaymentWebhook;
  console.log(body);

  // check if the payment is paid
  if (body.status === 1) {
    // update the payment status to paid
    try {
      const payment = await updatePaymentStatus(body.id, PaymentStatus.PAID);
      paymentEvents.emit('payment.approved', payment.appointment_id);
    } catch (error) {
      console.error(error);
    }
  }

  return new Response("OK");
}