"use server";

import { neon } from "@neondatabase/serverless";
import { AsaasGateway } from "@/app/gateways/asaas.gateway";
import {
  Appointment,
  AppointmentData,
  PaymentData,
  AppointmentStatus,
  PaymentStatus,
  PaymentType,
} from "./appointment.model";
import { serializePhone } from "@/lib/phone";

const APPOINTMENT_AMOUNT = 10;

export type CreateAppointmentData = {
  client_name: string;
  client_phone: string;
  date: Date;
};

export async function createAppointment(input: CreateAppointmentData) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const [appointmentData] = (await sql`
        INSERT INTO appointments (client_name, client_phone, date)
        VALUES (${input.client_name}, ${serializePhone(input.client_phone)}, ${
    input.date
  })
        RETURNING *
    `) as [AppointmentData];

  const asaasGateway = AsaasGateway.getInstance();
  const asaasPayment = await asaasGateway.createPayment({
    amount: APPOINTMENT_AMOUNT,
    external_id: appointmentData.id,
    description: `Pagamento de sinal de agendamento do cliente ${input.client_name}, com o telefone ${input.client_phone} no valor de R$${APPOINTMENT_AMOUNT}`,
  });

  if (!asaasPayment?.id || !asaasPayment?.payload) {
    await sql`
      DELETE FROM appointments
      WHERE id = ${appointmentData.id}
    `;

    throw new Error("Erro ao criar pagamento");
  }

  const [paymentData] = (await sql`
        INSERT INTO payments (appointment_id, external_id, amount, status, qr_code, type)
        VALUES (${appointmentData.id}, ${asaasPayment.id}, ${APPOINTMENT_AMOUNT}, 'pending', ${asaasPayment.payload}, 'pix')
        RETURNING *
    `) as [PaymentData];

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
      external_id: asaasPayment.id,
      amount: paymentData.amount,
      status: paymentData.status,
      paid_at: paymentData.paid_at,
      qr_code: paymentData.qr_code,
      type: paymentData.type,
      created_at: paymentData.created_at,
      updated_at: paymentData.updated_at,
      appointment_id: paymentData.appointment_id,
    },
  });

  return { qrCode: appointment.payment.qrCode, appointmentId: appointment.id };

  // const appointment = new Appointment({
  //   ...appointmentData,
  //   payment: {
  //     ...paymentData,
  //     amount: paymentData.amount / 100,
  //   },
  // });

  // return appointment;
}

export async function deleteExpiredAppointments() {
  const sql = neon(`${process.env.DATABASE_URL}`);

  await sql`
    DELETE FROM payments
    WHERE appointment_id IN (
      SELECT id FROM appointments
      WHERE status = 'waiting_payment' AND created_at < NOW() - INTERVAL '5 minutes'
    )
  `;

  await sql`
    DELETE FROM appointments
    WHERE status = 'waiting_payment' AND created_at < NOW() - INTERVAL '5 minutes'
  `;
}

export async function getAppointments(phone: string, dateFilter?: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);

  await deleteExpiredAppointments();

  // Se dateFilter for fornecido, converte para Date e cria filtros de data
  let startOfDay: Date | undefined;
  let endOfDay: Date | undefined;
  
  if (dateFilter) {
    // Cria a data no timezone local para evitar problemas de UTC
    const [year, month, day] = dateFilter.split('-').map(Number);
    startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    endOfDay = new Date(year, month - 1, day + 1, 0, 0, 0, 0);
  }

  const appointments =
    phone === "admin"
      ? await sql`
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
    WHERE 1=1 ${startOfDay && endOfDay ? sql`AND a.date >= ${startOfDay} AND a.date < ${endOfDay}` : sql``}
    ORDER BY a.date ASC
  `
      : await sql`
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
    WHERE a.client_phone = ${"+55" + phone} ${startOfDay && endOfDay ? sql`AND a.date >= ${startOfDay} AND a.date < ${endOfDay}` : sql``}
    ORDER BY a.date ASC
  `;

  const formattedAppointments = appointments.map(
    (row: Record<string, unknown>) => {
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
          appointment_id: row.appointment_id as string,
        },
      });
    }
  );

  return formattedAppointments;
}

export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus
) {
  const sql = neon(`${process.env.DATABASE_URL}`);

  const [paymentData] = (await sql`
    SELECT * FROM payments
    WHERE external_id = ${paymentId}
  `) as [PaymentData];

  if (!paymentData) {
    throw new Error("Payment not found");
  }

  // update the payment status to paid
  await sql`
    UPDATE payments
    SET status = ${status}, paid_at = NOW()
    WHERE external_id = ${paymentId}
  `;

  // update the appointment status to paid
  await sql`
    UPDATE appointments
    SET status = 'paid' 
    WHERE id = ${paymentData.appointment_id}
  `;

  return paymentData;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
) {
  const sql = neon(`${process.env.DATABASE_URL}`);

  await sql`
    UPDATE appointments
    SET status = ${status}
    WHERE id = ${appointmentId}
  `;
}

export async function payManually(appointmentId: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);

  // Atualiza o status do pagamento para paid
  await sql`
    UPDATE payments
    SET status = 'paid', paid_at = NOW(), type = 'manual'
    WHERE appointment_id = ${appointmentId}
  `;

  // Atualiza o status do agendamento para paid
  await sql`
    UPDATE appointments
    SET status = 'paid'
    WHERE id = ${appointmentId}
  `;
}

export async function completeAppointment(appointmentId: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);

  // Atualiza o status do agendamento para completed
  await sql`
    UPDATE appointments
    SET status = 'completed'
    WHERE id = ${appointmentId}
  `;
}

export async function getTimeSlots(start: Date, end: Date): Promise<Date[]> {
  await deleteExpiredAppointments();
  
  const sql = neon(`${process.env.DATABASE_URL}`);

  const timeSlots = await sql`
   SELECT 
    to_char(slot, 'HH24:MI') AS time,
    COUNT(a.id) = 0 AS available
  FROM generate_series(
    ${start.toISOString()}, 
    ${end.toISOString()}, 
    interval '30 minutes'
  ) AS slot
  LEFT JOIN appointments a
    ON a.date >= slot AND a.date < slot + interval '30 minutes'
  GROUP BY slot
  ORDER BY slot;
  ` as { time: string, available: boolean }[];
  

  return timeSlots.filter((slot) => slot.available).map((slot) => {
    const [hours, minutes] = slot.time.split(':');
    
    // Criar a data em UTC para evitar problemas de timezone
    const date = new Date(Date.UTC(
      start.getUTCFullYear(),
      start.getUTCMonth(),
      start.getUTCDate(),
      parseInt(hours),
      parseInt(minutes),
      0,
      0
    ));
    
    return date;
  });
}

export async function deleteAppointment(appointmentId: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);

  await sql`
    DELETE FROM payments
    WHERE appointment_id = ${appointmentId}
  `;

  await sql`
    DELETE FROM appointments
    WHERE id = ${appointmentId}
  `;
}
