import { Navbar } from "@/components/Navbar"

export default function SchedulePage() {
  return (
    <main className="flex p-4 flex-col items-center justify-center min-h-screen pb-24">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Agendar Serviço</h1>
        <p className="text-gray-600 mb-8">
          Escolha uma data e horário para agendar seu serviço
        </p>
        
        {/* Aqui você pode adicionar o componente de calendário ou formulário de agendamento */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <p className="text-sm text-gray-500">
            Componente de agendamento será adicionado aqui
          </p>
        </div>
      </div>

      <Navbar />
    </main>
  )
} 