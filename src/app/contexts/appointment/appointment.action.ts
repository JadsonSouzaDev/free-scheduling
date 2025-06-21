"use server";

import { neon } from "@neondatabase/serverless";
import { PaggueGateway } from "@/app/gateways/paggue.gateway";
import { Appointment, AppointmentData, PaymentData, AppointmentStatus, PaymentStatus, PaymentType } from "./appointment.model";
import { serializePhone } from "@/lib/phone";

const APPOINTMENT_AMOUNT = 10;

export type CreateAppointmentData = {
  client_name: string;
  client_phone: string;
  date: Date;
};

export async function createAppointment(input: CreateAppointmentData) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const [appointmentData] = await sql`
        INSERT INTO appointments (client_name, client_phone, date)
        VALUES (${input.client_name}, ${serializePhone(input.client_phone)}, ${input.date})
        RETURNING *
    ` as [AppointmentData];

  const paggueGateway = PaggueGateway.getInstance();
  const pagguePayment = await paggueGateway.createPayment({
    payer_name: input.client_name,
    amount: APPOINTMENT_AMOUNT,
    external_id: appointmentData.id,
    description: `Pagamento de sinal de agendamento do cliente ${input.client_name}, com o telefone ${input.client_phone} no valor de R$${APPOINTMENT_AMOUNT}`,
  });

  const [paymentData] = await sql`
        INSERT INTO payments (appointment_id, external_id, amount, status, qr_code, type)
        VALUES (${appointmentData.id}, ${pagguePayment.hash}, ${APPOINTMENT_AMOUNT}, 'pending', ${pagguePayment.payment}, 'pix')
        RETURNING *
    ` as [PaymentData];

  const appointment = new Appointment({
    id: appointmentData.id,
    client_name: appointmentData.client_name,
    client_phone: appointmentData.client_phone,
    date: appointmentData.date,
    status: appointmentData.status,
    created_at: appointmentData.created_at,
    updated_at: appointmentData.updated_at,
    payment: {
      id: paymentData.id,
      external_id: pagguePayment.external_id,
      amount: paymentData.amount,
      status: paymentData.status,
      paid_at: paymentData.paid_at,
      qr_code: paymentData.qr_code,
      type: paymentData.type,
      created_at: paymentData.created_at,
      updated_at: paymentData.updated_at,
    },
  });

  return appointment.payment.qrCode;

  // const appointment = new Appointment({
  //   ...appointmentData,
  //   payment: {
  //     ...paymentData,
  //     amount: paymentData.amount / 100,
  //   },
  // });

  // return appointment;
}

export async function getAppointments(phone: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  
  const appointments = await sql`
    SELECT 
      a.id,
      a.client_name,
      a.client_phone,
      a.date,
      a.status,
      a.created_at,
      a.updated_at,
      p.id as payment_id,
      p.external_id,
      p.amount,
      p.status as payment_status,
      p.paid_at,
      p.qr_code,
      p.type,
      p.created_at as payment_created_at,
      p.updated_at as payment_updated_at
    FROM appointments a
    INNER JOIN payments p ON a.id = p.appointment_id
    WHERE a.client_phone = ${'+55' + phone}
    ORDER BY a.created_at DESC
  `;

  const formattedAppointments = appointments.map((row: Record<string, unknown>) => {
    return new Appointment({
      id: row.id as string,
      client_name: row.client_name as string,
      client_phone: row.client_phone as string,
      date: row.date as Date,
      status: row.status as AppointmentStatus,
      created_at: row.created_at as Date,
      updated_at: row.updated_at as Date,
      payment: {
        id: row.payment_id as string,
        external_id: row.external_id as string,
        amount: row.amount as number,
        status: row.payment_status as PaymentStatus,
        paid_at: row.paid_at as Date | null,
        qr_code: row.qr_code as string,
        type: row.type as PaymentType,
        created_at: row.payment_created_at as Date,
        updated_at: row.payment_updated_at as Date,
      },
    });
  });

  return formattedAppointments;
}
