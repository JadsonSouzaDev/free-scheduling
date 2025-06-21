# Navbar Mobile com Glassmorfismo

## Descrição

Este componente cria um navbar mobile moderno com efeito de glassmorfismo que fica posicionado na parte inferior da tela. Ele inclui três opções principais: Agendar, Ver Agendamentos e Contato, com navegação automática entre páginas.

## Características

- **Efeito Glassmorfismo**: Fundo translúcido com blur e bordas suaves
- **Posicionamento**: Fixo na parte inferior da tela
- **Responsivo**: Adaptado para dispositivos móveis
- **Interativo**: Estados ativos e hover com animações suaves
- **Acessível**: Usa componentes do shadcn/ui para melhor acessibilidade
- **Roteamento**: Navegação automática entre páginas usando Next.js Router

## Como Usar

### Importação

```tsx
import { Navbar } from "@/components/Navbar"
```

### Uso Básico

```tsx
export default function MyPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Seu conteúdo aqui */}
      
      <Navbar />
    </div>
  )
}
```

## Rotas

O navbar navega automaticamente para as seguintes rotas:

| Botão | Rota | Descrição |
|-------|------|-----------|
| **Agendar** | `/schedule` | Página para agendar novos serviços |
| **Agendamentos** | `/appointments` | Página para visualizar agendamentos existentes |
| **Contato** | `/contact` | Página com informações de contato |

## Estrutura de Arquivos

```
src/
├── app/
│   ├── page.tsx              # Página inicial (/)
│   ├── schedule/
│   │   └── page.tsx          # Página de agendamento (/schedule)
│   ├── appointments/
│   │   └── page.tsx          # Página de agendamentos (/appointments)
│   └── contact/
│       └── page.tsx          # Página de contato (/contact)
└── components/
    └── Navbar.tsx            # Componente do navbar
```

## Estados Visuais

- **Normal**: Fundo transparente com ícone e texto
- **Hover**: Fundo branco com 20% de opacidade
- **Ativo**: Fundo branco com 20% de opacidade e cor específica do ícone baseada na rota atual

## Estilização

O navbar usa as seguintes classes Tailwind para o efeito glassmorfismo:

- `bg-white/10`: Fundo branco com 10% de opacidade
- `backdrop-blur-xl`: Efeito de blur no fundo
- `border border-white/20`: Borda branca com 20% de opacidade
- `shadow-2xl`: Sombra profunda para profundidade

## Ícones Utilizados

- **Agendar**: Ícone `Plus` do Lucide React
- **Agendamentos**: Ícone `Clock` do Lucide React  
- **Contato**: Ícone `Phone` do Lucide React

## Considerações de Layout

Para evitar que o conteúdo fique escondido atrás do navbar, adicione `pb-24` (padding-bottom) ao container principal da sua página.

## Dependências

- `next/navigation`: Para roteamento (`useRouter`, `usePathname`)
- `lucide-react`: Para os ícones
- `@/components/ui/button`: Componente Button do shadcn/ui
- `@/lib/utils`: Função `cn` para concatenação de classes

## Funcionalidades

- **Navegação Automática**: Usa `router.push()` para navegar entre páginas
- **Estado Ativo**: Detecta automaticamente a página atual usando `usePathname()`
- **Transições Suaves**: Animações CSS para melhor experiência do usuário
- **Responsividade**: Adaptado para diferentes tamanhos de tela 