import { Navbar } from "@/components/Navbar"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <main className="flex p-4 flex-col items-center justify-center min-h-screen pb-24">
      <div className="text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Contato</h1>
        <p className="text-gray-600 mb-8">
          Entre em contato conosco
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 space-y-4">
          {/* Telefone */}
          <div className="flex items-center justify-center gap-3">
            <Phone className="h-5 w-5 text-blue-500" />
            <div className="text-left">
              <p className="font-medium">Telefone</p>
              <p className="text-sm text-gray-400">(11) 99999-9999</p>
            </div>
          </div>
          
          {/* Email */}
          <div className="flex items-center justify-center gap-3">
            <Mail className="h-5 w-5 text-green-500" />
            <div className="text-left">
              <p className="font-medium">Email</p>
              <p className="text-sm text-gray-400">contato@barbearia.com</p>
            </div>
          </div>
          
          {/* Endereço */}
          <div className="flex items-center justify-center gap-3">
            <MapPin className="h-5 w-5 text-red-500" />
            <div className="text-left">
              <p className="font-medium">Endereço</p>
              <p className="text-sm text-gray-400">Rua das Flores, 123 - Centro</p>
            </div>
          </div>
          
          {/* Horário de Funcionamento */}
          <div className="flex items-center justify-center gap-3">
            <Clock className="h-5 w-5 text-purple-500" />
            <div className="text-left">
              <p className="font-medium">Horário</p>
              <p className="text-sm text-gray-400">Seg-Sáb: 9h às 18h</p>
            </div>
          </div>
        </div>
        
        {/* Botão de WhatsApp */}
        <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Abrir WhatsApp
        </button>
      </div>

      <Navbar />
    </main>
  )
} 