import { Navbar } from "@/components/Navbar"

export default function AppointmentsPage() {
  return (
    <main className="flex p-4 flex-col items-center justify-center min-h-screen pb-24">
      <div className="text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Meus Agendamentos</h1>
        <p className="text-gray-600 mb-8">
          Visualize e gerencie seus agendamentos
        </p>
        
        {/* Aqui você pode adicionar a lista de agendamentos */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <p className="text-sm text-gray-500 mb-4">
            Lista de agendamentos será exibida aqui
          </p>
          
          {/* Exemplo de agendamento */}
          <div className="bg-white/5 rounded-lg p-4 mb-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Corte de Cabelo</p>
                <p className="text-sm text-gray-400">15 de Janeiro, 14:00</p>
              </div>
              <span className="bg-green-500/20 text-green-600 px-2 py-1 rounded-full text-xs">
                Confirmado
              </span>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Barba</p>
                <p className="text-sm text-gray-400">20 de Janeiro, 10:30</p>
              </div>
              <span className="bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded-full text-xs">
                Pendente
              </span>
            </div>
          </div>
        </div>
      </div>

      <Navbar />
    </main>
  )
} 