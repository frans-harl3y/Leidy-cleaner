# 🎯 GUIA DE INTEGRAÇÃO - 5 SMART FEATURES

## ⚡ Quick Start - Próximos Passos

### Status Atual
✅ **Todos os arquivos criados e prontos para uso**
- 5 Services Backend (1400+ linhas de código)
- 1 Controller integrado (SmartFeaturesController)
- 1 Route configurada (smartFeaturesRoutes)
- 3 Componentes React (DynamicPricing, CrossSelling, AvailableStaff)
- 1 Admin Dashboard (SmartAnalyticsDashboard)

### Timeline
- **Hoje (2h)**: Testes & validação
- **Amanhã (2h)**: Integração nas páginas existentes
- **Dia 3 (2h)**: Deploy em staging
- **Dia 4+**: Push em produção

---

## 📌 Integration Guide

### PASSO 1: Testar Endpoints Backend

Abra Postman/curl e teste cada endpoint:

#### 1.1 Feature #1: Smart Availability
```bash
curl -X GET "http://localhost:3001/api/smart/staff/available?date=2026-02-14&time=10:00&serviceId=1"
```

**Esperado**: Array de staff com scores

#### 1.2 Feature #2: Dynamic Pricing
```bash
curl -X POST "http://localhost:3001/api/smart/pricing/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": 1,
    "date": "2026-02-14",
    "time": "10:00",
    "duration": 2,
    "userId": 1
  }'
```

**Esperado**: Objeto com pricing breakdown e savings

#### 1.3 Feature #3: Cross-Selling
```bash
curl -X GET "http://localhost:3001/api/smart/recommendations?userId=1&limit=5"
```

**Esperado**: Array de serviços recomendados

#### 1.4 Feature #5: Auto-Allocate
```bash
curl -X GET "http://localhost:3001/api/smart/auto-allocate?serviceId=1&date=2026-02-14&time=10:00"
```

**Esperado**: Staff alocado com scores

#### 1.5 Feature #4: Analytics (Admin)
```bash
curl -X GET "http://localhost:3001/api/smart/analytics/dashboard?daysBack=30" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Esperado**: Dashboard metrics

---

### PASSO 2: Integrar Componentes no Frontend

#### 2.1 Atualizar página de Agendamento (agendar.jsx)

Adicione no topo do arquivo:
```jsx
import DynamicPricingDisplay from '../components/DynamicPricingDisplay';
import CrossSellingRecommendations from '../components/CrossSellingRecommendations';
import AvailableStaffWidget from '../components/AvailableStaffWidget'; // Já importado
```

No componente, após selecionar data/hora/serviço, adicione:

**Após seção de seleção de staff:**
```jsx
{/* Smart Availability Widget - Feature #1 */}
{selectedDate && selectedTime && selectedServices.length > 0 && (
  <AvailableStaffWidget
    date={selectedDate}
    time={selectedTime}
    serviceId={selectedServices[0].id}
    onSelectStaff={(staff) => setSelectedStaff(staff)}
    autoScroll={true}
  />
)}

{/* Dynamic Pricing Display - Feature #2 */}
{selectedDate && selectedTime && selectedServices.length > 0 && (
  <DynamicPricingDisplay
    serviceId={selectedServices[0].id}
    date={selectedDate}
    time={selectedTime}
    duration={2}
    userId={currentUser?.id}
    onPricingUpdate={(pricing) => {
      setFinalPrice(pricing.final_price);
    }}
  />
)}

{/* Cross-Selling Recommendations - Feature #3 */}
{selectedServices.length > 0 && (
  <CrossSellingRecommendations
    userId={currentUser?.id}
    currentServiceId={selectedServices[0].id}
    onAddToCart={(service) => {
      handleServiceToggle(service.id);
      toast.success(`${service.name} adicionado!`);
    }}
    limit={5}
  />
)}
```

#### 2.2 Criar página Admin Analytics

**Arquivo novo**: `frontend/src/pages/admin/analytics.jsx`

```jsx
import React from 'react';
import { useRouter } from 'next/router';
import SmartAnalyticsDashboard from '../../pages/SmartAnalyticsDashboard';
import AdminLayout from '../../components/Layout/AdminLayout';

export default function AnalyticsPage() {
  const router = useRouter();

  // Verificar se é admin
  // const { user } = useAuth();
  // if (user?.role !== 'admin') router.push('/login');

  return (
    <AdminLayout>
      <SmartAnalyticsDashboard />
    </AdminLayout>
  );
}
```

**Adicione link no menu admin:**
```jsx
<Link href="/admin/analytics">
  📊 Analytics
</Link>
```

#### 2.3 Staff Dashboard (Opcional)

Para staff ver seu próprio performance:

**Arquivo**: `frontend/src/pages/staff/performance.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { apiCall } from '../config/api';

export default function StaffPerformance() {
  const [cancellationReport, setCancellationReport] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await apiCall('/api/smart/staff-optimization/cancellation-report');
      setCancellationReport(res.data);
    };
    fetch();
  }, []);

  return (
    <div>
      <h1>My Performance</h1>
      {cancellationReport && (
        <pre>{JSON.stringify(cancellationReport, null, 2)}</pre>
      )}
    </div>
  );
}
```

---

### PASSO 3: Estutura de Componentes Final

```
frontend/src/
├── pages/
│   ├── agendar.jsx ..................... (EDIT - adicionar componentes 1-3)
│   ├── admin/
│   │   └── analytics.jsx ............... (NEW - Feature #4)
│   ├── staff/
│   │   └── performance.jsx ............. (NEW - Feature #5)
│   └── SmartAnalyticsDashboard.jsx ..... (NEW - Feature #4 main)
│
└── components/
    ├── AvailableStaffWidget.jsx ........ (EXISTING - aprimorador)
    ├── AvailableStaffWidget.module.css . (EXISTING)
    ├── DynamicPricingDisplay.jsx ........ (NEW - Feature #2)
    ├── DynamicPricingDisplay.module.css  (NEW - Feature #2)
    ├── CrossSellingRecommendations.jsx  (NEW - Feature #3)
    └── CrossSellingRecommendations.module.css (NEW - Feature #3)
```

---

### PASSO 4: Validação no Navegador

#### Teste por Feature:

**✓ Feature #1: Smart Availability**
- [ ] Ir para agendar.jsx
- [ ] Selecionar data/hora/serviço
- [ ] Ver cards de staff com scores
- [ ] Clicar em um staff e confirmar seleção

**✓ Feature #2: Dynamic Pricing**
- [ ] Verificar preço atualiza ao mudar hora
- [ ] Clicar em "Ver detalhes"
- [ ] Ver breakdown completo
- [ ] Comparar horários diferentes (rush vs. off-peak)

**✓ Feature #3: Cross-Selling**
- [ ] Verificar serviços recomendados aparecem
- [ ] Clicar na aba "Pacotes Especiais"
- [ ] Adicionar pacote ao carrinho
- [ ] Verificar preço com desconto bundle

**✓ Feature #4: Analytics**
- [ ] Login como admin
- [ ] Ir para /admin/analytics
- [ ] Ver KPIs: Revenue, Bookings, Customers, Staff
- [ ] Clicar em tabs: Overview, Staff, Churn, Forecast
- [ ] Selecionar diferentes períodos

**✓ Feature #5: Staff Auto-Allocation**
- [ ] Backend: Auto-allocate retorna staff com score
- [ ] Criar agendamento sem selecionar staff
- [ ] Sistema atribui melhor staff automaticamente

---

### PASSO 5: Banco de Dados (Validação)

**Nenhuma migração necessária!** Todos os queries usam tabelas existentes:
- `users` (existing)
- `bookings` (existing)
- `services` (existing)
- `payments` (existing - para revenue calc)

Teste rápido:
```sql
-- Verify booking history exists
SELECT COUNT(*) FROM bookings;

-- Verify staff users exist
SELECT * FROM users WHERE role = 'staff' LIMIT 5;

-- Verify ratings populated
SELECT user_id, rating FROM bookings WHERE rating IS NOT NULL LIMIT 5;
```

---

### PASSO 6: Testes Manuais Checklist

```
BACKEND TESTS:
☐ /api/smart/status returns 200
☐ GET /api/smart/staff/available returns 200
☐ POST /api/smart/pricing/calculate returns 200
☐ GET /api/smart/recommendations returns 200
☐ GET /api/smart/bundles returns 200
☐ GET /api/smart/auto-allocate returns 200
☐ GET /api/smart/analytics/dashboard returns 200 (admin)
☐ GET /api/smart/analytics/churn returns 200 (admin)

FRONTEND TESTS:
☐ AvailableStaffWidget renders in agendar.jsx
☐ DynamicPricingDisplay shows price & savings
☐ CrossSellingRecommendations shows services
☐ Admin dashboard loads metrics
☐ Mobile responsive (480px+)
☐ No console errors

INTEGRATION TESTS:
☐ Adicionar componentes muda quando seleciona data/hora
☐ Mudar serviço atualiza recomendações
☐ Adicionar bundle ao carrinho funciona
☐ Admin vê analytics corretamente
☐ Preço final está correto no checkout
```

---

### PASSO 7: Deploy

#### Staging
```bash
# Backend
cd backend
npm test
npm start

# Frontend
cd frontend
npm run build
npm start

# Test em staging
# http://localhost:3000/agendar
# http://localhost:3000/admin/analytics
```

#### Production
```bash
# Commit changes
git add .
git commit -m "feat: implement 5 smart features (availability, pricing, cross-sell, analytics, optimization)"

# Push to main
git push origin main

# Deploy
# Vercel (frontend): Auto-deploy on main
# Railway (backend): Auto-deploy on main
```

---

## 🔥 Troubleshooting

### Problema: "Cannot find module 'SmartFeaturesController'"
**Solução**: Verifique se o arquivo está em `backend/src/controllers/`

### Problema: API returns 404
**Solução**: Confirme que `smartFeaturesRoutes` foi adicionada em `api.js`:
```javascript
const smartFeaturesRoutes = require('./smartFeaturesRoutes');
router.use('/smart', smartFeaturesRoutes);
```

### Problema: Componentes não renderizam
**Solução**: Verifique imports - nomes exatos do arquivo

### Problema: Preço não atualiza
**Solução**: Confirme userId está sendo passado corretamente

### Problema: Admin dashboard vazio
**Solução**: 
1. Confirme token admin válido
2. Verifique dados de booking no DB
3. Verifique error no console

---

## 🎓 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER FLOW                            │
├─────────────────────────────────────────────────────────────┤

CUSTOMER (agendar.jsx)
  ├─ Seleciona Data/Hora/Serviço
  │   └─ AvailableStaffWidget (Feature #1)
  │   └─ DynamicPricingDisplay (Feature #2)
  │   └─ CrossSellingRecommendations (Feature #3)
  └─ Confirma agendamento
      └─ Backend: Auto-allocate (Feature #5)

ADMIN (analytics.jsx)
  ├─ SmartAnalyticsDashboard (Feature #4)
  │   ├─ Revenue Metrics
  │   ├─ Staff Performance
  │   ├─ Churn Analysis
  │   └─ Demand Forecast
  └─ Staff Optimization Reports (Feature #5)

STAFF (performance.jsx)
  └─ Cancellation Reports (Feature #5)


BACKEND API STRUCTURE:
┌──────────────────────┐
│  smartFeaturesRoutes │
├──────────────────────┤
│  /staff/available    │ ──► SmartAvailabilityService
│  /pricing/calculate  │ ──► DynamicPricingService
│  /recommendations    │ ──► IntelligentCrossSellingService
│  /analytics/*        │ ──► AdvancedAnalyticsService
│  /auto-allocate      │ ──► StaffOptimizationService
└──────────────────────┘
```

---

## 📞 Support

Se tiver problemas na integração:

1. **Verifique status de todos endpoints**: `GET /api/smart/status`
2. **Leia logs do backend**: `tail backend/.log`
3. **Verifique console do frontend**: F12 → Console
4. **Confirme dados no BD**: Verifique bookings, users, services

---

**Criado por**: Copilot  
**Data**: February 14, 2026  
**Status**: ✅ Ready for Integration
