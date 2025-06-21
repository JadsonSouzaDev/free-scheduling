"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Clock, Phone, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-2 py-4">
      {/* Container com efeito glassmorfismo */}
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">

          {/* Conteúdo do navbar */}
          <div className="grid grid-cols-3 py-1">
            {/* Botão Agendar */}
            <Link href="/" className="cursor-pointer">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "flex flex-col items-center justify-center h-12 w-full rounded-xl transition-all  duration-300 hover:bg-white/20",
                  pathname === "/" && "bg-white/20 text-blue-600"
                )}
              >
                <Plus className="h-6 w-6" />
                <span className="text-xs font-medium">Agendar</span>
              </Button>
            </Link>

            {/* Botão Meus Agendamentos */}
            <Link href="/agendamentos">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "flex flex-col items-center justify-center h-12 w-full rounded-xl transition-all duration-300 hover:bg-white/20",
                pathname === "/agendamentos" && "bg-white/20 text-green-600"
              )}
              >
              <Clock className="h-6 w-6" />
              <span className="text-xs font-medium">Agendamentos</span>
            </Button>
              </Link>

            {/* Botão Contato */}
            <Link href="/contato">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "flex flex-col items-center justify-center h-12 w-full rounded-xl transition-all duration-300 hover:bg-white/20",
                pathname === "/contato" && "bg-white/20 text-purple-600"
              )}
              >
              <Phone className="h-6 w-6" />
              <span className="text-xs font-medium">Contato</span>
            </Button>
              </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
