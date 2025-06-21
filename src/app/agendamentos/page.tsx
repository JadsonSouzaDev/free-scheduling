import { AppointmentsList } from "@/components/AppointmentsList"
import { PhoneModalWrapper } from "@/components/PhoneModalWrapper"

interface AppointmentsPageProps {
  searchParams: { phone?: string }
}

export default function AppointmentsPage({ searchParams }: AppointmentsPageProps) {
  const phone = searchParams.phone;

  return (
    <main className="flex p-4 flex-col items-center justify-center min-h-screen pb-24">
      {phone ? (
        <AppointmentsList phone={phone} />
      ) : (
        <PhoneModalWrapper />
      )}
    </main>
  )
} 