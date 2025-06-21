# Integração SWR com Server Actions

Este projeto utiliza o SWR para gerenciar o estado e as chamadas de API, integrando com as Server Actions do Next.js.

## Configuração

### 1. Provider SWR

O SWR está configurado no arquivo `src/app/providers.tsx` e é aplicado globalmente no `layout.tsx`:

```tsx
// src/app/providers.tsx
<SWRConfig
  value={{
    fetcher: (url: string) => fetch(url).then((res) => res.json()),
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  }}
>
  {children}
</SWRConfig>
```

### 2. Server Actions

As actions estão localizadas em `src/app/contexts/appointment/appointment.action.ts`:

#### createAppointment

Action para criar novos appointments:

```tsx
export async function createAppointment(input: CreateAppointmentData) {
  // Lógica para criar appointment no banco
  // Integração com gateway de pagamento
  // Retorna o appointment criado
}
```

#### getAppointments

Action para buscar appointments:

```tsx
export async function getAppointments() {
  // Busca appointments do banco de dados
  // Retorna array de appointments formatados
}
```

### 3. Hooks Personalizados

Os hooks estão localizados em `src/app/contexts/appointment/appointment.hooks.ts`:

#### useCreateAppointment

Hook para criar novos appointments:

```tsx
const { createAppointment, isCreating } = useCreateAppointment();

const handleSubmit = async () => {
  try {
    const appointment = await createAppointment({
      client_name: "João Silva",
      client_phone: "(11) 99999-9999",
      date: new Date(),
    });
    console.log("Appointment criado:", appointment);
  } catch (error) {
    console.error("Erro:", error);
  }
};
```

#### useAppointments

Hook para buscar appointments usando Server Actions:

```tsx
const { appointments, isLoading, error, mutate } = useAppointments();
```

## Uso no ModalForm

O `ModalForm.tsx` foi atualizado para usar o SWR com Server Actions:

```tsx
import { useCreateAppointment } from "@/app/contexts/appointment/appointment.hooks";

export function ModalForm({ isOpen, onClose, onSubmit, selectedDateTime }) {
  const { createAppointment, isCreating } = useCreateAppointment();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const appointment = await createAppointment({
        client_name: name.trim(),
        client_phone: phone,
        date: selectedDateTime,
      });
      
      onSubmit({ name: name.trim(), phone });
      onClose();
    } catch (error) {
      console.error("Erro ao criar appointment:", error);
    }
  };
  
  return (
    // ... JSX com estado de loading
    <Button disabled={isCreating}>
      {isCreating ? "Criando..." : "Confirmar Agendamento"}
    </Button>
  );
}
```

## Vantagens da Abordagem

1. **Server Actions**: Execução no servidor com melhor performance e segurança
2. **Estado de Loading**: Gerenciamento automático do estado de carregamento
3. **Cache Inteligente**: Cache automático e invalidação quando necessário
4. **Revalidação**: Revalidação automática em reconexão
5. **Retry**: Tentativas automáticas em caso de erro
6. **Type Safety**: Tipagem completa com TypeScript

## Estrutura dos Arquivos

```
src/app/contexts/appointment/
├── appointment.action.ts    # Server Actions
├── appointment.hooks.ts     # Hooks do SWR
└── appointment.model.ts     # Modelos e tipos

src/components/
├── ModalForm.tsx           # Formulário usando SWR
└── AppointmentsList.tsx    # Lista usando SWR

src/app/
├── providers.tsx           # Configuração do SWR
└── layout.tsx             # Provider aplicado globalmente
```

## Próximos Passos

Para completar a integração, você pode:

1. Implementar toast notifications para feedback do usuário
2. Adicionar validação de formulário mais robusta
3. Implementar atualizações otimistas para melhor UX
4. Adicionar filtros e paginação na lista de appointments 