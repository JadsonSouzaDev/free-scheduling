import { AppointmentsListWrapper } from "@/components/AppointmentsListWrapper"
import { PhoneModalWrapper } from "@/components/PhoneModalWrapper"
import { getAppointments } from "@/app/contexts/appointment/appointment.action"

interface AppointmentsPageProps {
  searchParams: Promise<{ phone?: string; date?: string }>
}

export default async function AppointmentsPage({ searchParams }: AppointmentsPageProps) {
  const { phone, date } = await searchParams;
  const isAdmin = phone === 'admin';

  if (!phone) {
    return (
      <PhoneModalWrapper />
    )
  }

  const appointments = await getAppointments(phone, date);

  // Serializa os dados para objetos planos
  const serializedAppointments = appointments?.map(appointment => ({
    id: appointment.id,
    clientName: appointment.clientName,
    clientPhone: appointment.clientPhone,
    date: appointment.date.toISOString(),
    status: appointment.status,
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString(),
    payment: {
      id: appointment.payment.id,
      externalId: appointment.payment.externalId,
      amount: appointment.payment.amount,
      status: appointment.payment.status,
      paidAt: appointment.payment.paidAt?.toISOString() || null,
      qrCode: appointment.payment.qrCode,
      type: appointment.payment.type,
      createdAt: appointment.payment.createdAt.toISOString(),
      updatedAt: appointment.payment.updatedAt.toISOString(),
    }
  })) || [];

  return (   
      <AppointmentsListWrapper appointments={serializedAppointments} isAdmin={isAdmin} />
   
  )
} 