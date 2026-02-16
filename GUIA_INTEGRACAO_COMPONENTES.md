# 🔗 Guia de Integração - Componentes Úteis

## 📚 Como Reutilizar os Componentes em Outras Páginas

Todos os 5 componentes foram criados como **componentes reutilizáveis** e podem ser importados em qualquer página do projeto.

---

## 1️⃣ ServiceSearch - Busca e Filtro de Serviços

### Importar:
```javascript
import ServiceSearch from '../components/ServiceSearch';
```

### Usar em uma página:
```javascript
export default function MinhaPagina() {
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  const servicos = [
    { id: 1, name: 'Limpeza Residencial', category: 'residential', price: 150, icon: '🏠', time: '2-3h' },
    { id: 2, name: 'Limpeza Profunda', category: 'specialized', price: 250, icon: '✨', time: '4-5h' },
  ];

  return (
    <ServiceSearch 
      services={servicos}
      onSelect={(servico) => {
        setServicoSelecionado(servico);
        console.log('Serviço selecionado:', servico);
      }}
      maxHeight="500px"
    />
  );
}
```

### Props disponíveis:
```typescript
interface ServiceSearchProps {
  services?: Array<{
    id: number,
    name: string,
    category: string,
    price: number,
    icon: string,
    time: string
  }>;
  onSelect?: (service: any) => void;
  maxHeight?: string; // exemplo: "400px"
}
```

### Caso de uso:
✅ Página de seleção de serviço  
✅ Carrinho de compras  
✅ Admin para adicionar serviços  
✅ Catálogo de serviços  

---

## 2️⃣ DemandIndicator - Indicador de Demanda

### Importar:
```javascript
import DemandIndicator from '../components/DemandIndicator';
```

### Usar em uma página:
```javascript
export default function SeletorHorario() {
  const [dataSelecionada, setDataSelecionada] = useState('2024-02-20');
  const [horarioSelecionado, setHorarioSelecionado] = useState('09:00');

  return (
    <div>
      <input 
        type="date" 
        value={dataSelecionada}
        onChange={(e) => setDataSelecionada(e.target.value)}
      />
      
      <DemandIndicator 
        selectedDate={dataSelecionada}
        onSelectTime={(slot) => {
          setHorarioSelecionado(slot.time);
          console.log('Horário selecionado:', slot);
        }}
      />
      
      <p>Horário escolhido: {horarioSelecionado}</p>
    </div>
  );
}
```

### Props disponíveis:
```typescript
interface DemandIndicatorProps {
  selectedDate?: string; // formato: "2024-02-20"
  onSelectTime?: (slot: {
    time: string,
    demand: 'low' | 'medium' | 'high',
    savings: number,
    badge?: string
  }) => void;
}
```

### Caso de uso:
✅ Página de seleção de data/hora  
✅ Dashboard de agendamentos  
✅ Widget de disponibilidade  
✅ Página de checkout  

---

## 3️⃣ NextBookings - Próximos Agendamentos

### Importar:
```javascript
import NextBookings from '../components/NextBookings';
```

### Usar em uma página:
```javascript
export default function Home() {
  return (
    <div>
      <h1>Bem-vindo!</h1>
      
      <NextBookings 
        limit={5}
        onBookingClick={(booking) => {
          console.log('Agendamento clicado:', booking);
          // Fazer algo com o agendamento
        }}
      />
    </div>
  );
}
```

### Props disponíveis:
```typescript
interface NextBookingsProps {
  limit?: number; // quantos agendamentos mostrar (default: 3)
  onBookingClick?: (booking: Booking) => void;
}
```

### Caso de uso:
✅ Homepage (widget de próximos agendamentos)  
✅ Dashboard (seção de resumo)  
✅ Página de conta do usuário  
✅ Notificações  

---

## 4️⃣ QuickStats - Estatísticas Rápidas

### Importar:
```javascript
import QuickStats from '../components/QuickStats';
```

### Usar em uma página:
```javascript
export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Seu Dashboard</h1>
      
      <QuickStats />
    </div>
  );
}
```

### Props disponíveis:
```typescript
interface QuickStatsProps {
  // Nenhuma prop obrigatória, pega dados do mock ou localStorage
}
```

### Customização (opcional):
```javascript
// Se quiser passar dados customizados, modifique o componente:
// Dentro de QuickStats.jsx, altere:
const mockStats = {
  totalBookings: 12,
  totalSpent: 1450,
  averageRating: 4.8,
  // ... outros dados
};
```

### Caso de uso:
✅ Dashboard principal  
✅ Página de perfil do usuário  
✅ Página inicial (para usuários logados)  
✅ Email de resumo trimestral  

---

## 5️⃣ BookingHistory - Histórico de Agendamentos

### Importar:
```javascript
import BookingHistory from '../components/BookingHistory';
```

### Usar em uma página:
```javascript
export default function Historico() {
  return (
    <div>
      <h1>Meu Histórico</h1>
      
      <BookingHistory limit={20} />
    </div>
  );
}
```

### Props disponíveis:
```typescript
interface BookingHistoryProps {
  limit?: number; // quantidade de registros a mostrar (default: 10)
}
```

### Caso de uso:
✅ Dashboard (tab de histórico)  
✅ Página dedicada de histórico  
✅ Relatório do usuário  
✅ Análise de padrões de uso  

---

## 🎨 Integração com Componentes Existentes

### Com DynamicPricingDisplay (já existe):
```javascript
import ServiceSearch from '../components/ServiceSearch';
import DynamicPricingDisplay from '../components/DynamicPricingDisplay';

export default function Checkout() {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <div>
      <ServiceSearch onSelect={setSelectedService} />
      
      {selectedService && selectedDate && (
        <DynamicPricingDisplay 
          basePrice={selectedService.price}
          serviceId={selectedService.id}
          date={selectedDate}
        />
      )}
    </div>
  );
}
```

### Com CrossSellingRecommendations (já existe):
```javascript
import NextBookings from '../components/NextBookings';
import CrossSellingRecommendations from '../components/CrossSellingRecommendations';

export default function Dashboard() {
  const [lastService, setLastService] = useState(null);

  return (
    <div>
      <NextBookings onBookingClick={(b) => setLastService(b)} />
      
      {lastService && (
        <CrossSellingRecommendations 
          primaryServiceId={lastService.serviceId}
        />
      )}
    </div>
  );
}
```

---

## 📦 Estrutura de Pastas

```
frontend/
├── src/
│   ├── components/
│   │   ├── ServiceSearch.jsx ✨ NOVO
│   │   ├── ServiceSearch.module.css ✨ NOVO
│   │   ├── DemandIndicator.jsx ✨ NOVO
│   │   ├── DemandIndicator.module.css ✨ NOVO
│   │   ├── NextBookings.jsx ✨ NOVO
│   │   ├── NextBookings.module.css ✨ NOVO
│   │   ├── QuickStats.jsx ✨ NOVO
│   │   ├── QuickStats.module.css ✨ NOVO
│   │   ├── BookingHistory.jsx ✨ NOVO
│   │   ├── BookingHistory.module.css ✨ NOVO
│   │   ├── DynamicPricingDisplay.jsx (existente)
│   │   ├── CrossSellingRecommendations.jsx (existente)
│   │   └── ...outros
│   ├── pages/
│   │   ├── agendar-novo.jsx ✨ NOVO
│   │   ├── dashboard-novo.jsx ✨ NOVO
│   │   ├── agendar.jsx (será substituído)
│   │   ├── dashboard.jsx (será substituído)
│   │   └── ...outros
│   └── ...
```

---

## 🔄 Fluxo de Dados Recomendado

### Fluxo de Agendamento (completo):
```
1. ServiceSearch
   ↓ (serviço selecionado)
2. DemandIndicator + input date/time
   ↓ (data e horário selecionados)
3. DynamicPricingDisplay
   ↓ (preço calculado)
4. CrossSellingRecommendations
   ↓ (serviços complementares)
5. Checkout / Confirmação
```

### Fluxo de Dashboard (completo):
```
1. QuickStats (visão geral)
   ↓
2. NextBookings (próximos)
   ↓
3. BookingHistory (histórico)
   ↓
4. Ações relacionadas
```

---

## 🧪 Exemplo Completo: Página de Serviços

```javascript
import React, { useState } from 'react';
import ServiceSearch from '../components/ServiceSearch';
import DemandIndicator from '../components/DemandIndicator';
import DynamicPricingDisplay from '../components/DynamicPricingDisplay';

export default function ServicosCompletos() {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold">Nossos Serviços</h1>

      {/* Passo 1: Selecionar Serviço */}
      <div className="bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">📋 Escolha um Serviço</h2>
        <ServiceSearch 
          onSelect={(service) => {
            setSelectedService(service);
            // Reset outros valores
            setSelectedDate('');
            setSelectedTime('09:00');
          }}
        />
      </div>

      {/* Passo 2: Selecionar Data/Hora */}
      {selectedService && (
        <div className="bg-green-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">
            ✅ {selectedService.name} - Escolha a Data
          </h2>
          
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-3 border rounded-lg mb-6"
          />

          {selectedDate && (
            <DemandIndicator 
              selectedDate={selectedDate}
              onSelectTime={(slot) => setSelectedTime(slot.time)}
            />
          )}
        </div>
      )}

      {/* Passo 3: Ver Preço */}
      {selectedService && selectedDate && selectedTime && (
        <div className="bg-yellow-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">💰 Preço Inteligente</h2>
          <DynamicPricingDisplay 
            basePrice={selectedService.price}
            serviceId={selectedService.id}
            date={selectedDate}
            time={selectedTime}
          />
        </div>
      )}

      {/* Resumo e Botão de Ação */}
      {selectedService && selectedDate && selectedTime && (
        <div className="bg-purple-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">📋 Resumo</h2>
          <div className="space-y-2">
            <p><strong>Serviço:</strong> {selectedService.name}</p>
            <p><strong>Data:</strong> {selectedDate}</p>
            <p><strong>Horário:</strong> {selectedTime}</p>
            <p><strong>Preço:</strong> R$ {selectedService.price}</p>
          </div>
          
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
            ✅ Confirmar Agendamento
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 💡 Boas Práticas

### ✅ Faça:
- Passe props específicas para cada componente
- Use callbacks para comunicação pai-filho
- Mantenha componentes sem estado quando possível
- Importa módulos CSS corretamente

### ❌ Evite:
- Modificar estado diretamente (use setState)
- Importar múltiplas vezes o mesmo componente
- Deixar console.logs em produção
- Ignorar props obrigatórias

---

## 🐛 Troubleshooting

### Problema: Componente não aparece
```javascript
// ❌ Errado
import ServiceSearch from './ServiceSearch';

// ✅ Correto
import ServiceSearch from '../components/ServiceSearch';
```

### Problema: CSS not loading
```javascript
// ❌ Errado
import styles from './ServiceSearch.css';

// ✅ Correto
import styles from './ServiceSearch.module.css';
```

### Problema: Callback não funciona
```javascript
// ❌ Errado
<ServiceSearch onSelect={handleSelect()} />

// ✅ Correto
<ServiceSearch onSelect={handleSelect} />
```

---

## 📚 Recursos Adicionais

- IMPLEMENTACAO_COMPONENTES_UTEIS.md - Documentação completa
- CHECKLIST_COMPONENTES_UTEIS.md - Checklist de implementação
- Código dos componentes - Dentro de cada arquivo JSX

---

**Status: ✅ Pronto para integração**

*Componentes criados em: 2024*  
*Última atualização: 2024*
