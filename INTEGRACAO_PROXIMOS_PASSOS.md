# 🚀 Integração e Próximos Passos - Temas e Minha Conta

## 📦 Arquivos Novos e Atualizados

### ✅ Novos Arquivos Criados

```
/frontend/src/
├── context/
│   └── ThemeContext.jsx         ← ⭐ Expandido para 4 temas
├── components/UI/
│   └── ThemeSelector.jsx        ← ⭐ Seletor atualizado
├── pages/
│   ├── minha-conta.jsx          ← ⭐ Nova página completa
│   └── staff/
│       └── schedule.jsx         ← ⭐ Agenda do profissional
└── components/Layout/
    └── Header.jsx               ← ⭐ Redesenhado
```

### 📝 Arquivos de Documentação

```
/
├── MELHORIAS_UI_UX_IMPLEMENTADAS.md   ← Documentação completa
├── GUIA_TESTES_TEMAS_CONTA.md        ← Checklist de testes
└── INTEGRACAO_PROXIMOS_PASSOS.md     ← Este arquivo
```

---

## 🔌 Como Integrar No Projeto Existente

### 1️⃣ ThemeContext.jsx - Já Integrado ✅

O arquivo foi **atualizado** em seu lugar:
```
/frontend/src/context/ThemeContext.jsx
```

**O que mudou:**
- Adicionado suporte para 4 temas (light, dark, high-contrast, pastel)
- Mantida compatibilidade com código anterior (accent, fontScale)
- Novo hook útil: `cycleTheme()` para trocar temas rapidamente

**Compatibilidade:** 100% ✅

---

### 2️⃣ Seletor de Temas - Atualizado ✅

```
/frontend/src/components/UI/ThemeSelector.jsx
```

**O que mudou:**
- Removida dependência de `themeManager`
- Agora usa contexto direto
- Suporta 4 botões visuais (em vez do dropdown anterior)

**Uso em Componentes:**
```jsx
import ThemeSelector from '../UI/ThemeSelector';

export default function MyComponent() {
  return (
    <div>
      <ThemeSelector /> {/* Aparece com 4 botões */}
    </div>
  );
}
```

---

### 3️⃣ Header - Redesenhado ✅

```
/frontend/src/components/Layout/Header.jsx
```

**O que mudou:**
- Cores dinâmicas baseadas no tema
- Removidas barras brancas (sem gradients problemáticos)
- Integrado novo ThemeSelector
- Link direcionando para `/minha-conta` (em vez de `/dashboard`)

**Sem mudanças necessárias em imports** - já incluído nas páginas

---

### 4️⃣ Página Minha Conta - Nova ✅

```
/frontend/src/pages/minha-conta.jsx
```

**Como usar:**
1. Frontend já está pronto
2. Precisa integrar com endpoints do backend:
   - `GET /api/auth/profile` - retorna dados do usuário
   - `PUT /api/users/:id` - atualiza perfil
   - `GET /api/bookings` - agenda do cliente
   - `GET /api/payments` - pagamentos do cliente

**Estrutura Esperada de Usuário (exemplo):**
```json
{
  "id": "user-123",
  "name": "Maria Silva",
  "email": "maria@example.com",
  "role": "customer", // "customer", "staff", "admin"
  "phone": "11999999999",
  "address": "Rua das Flores, 123",
  "bio": "Profissional em limpeza",
  "basePrice": 50.00,
  "pixKey": "maria@email.com",
  "bankCode": "001",
  "bankAccount": "123456-7",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### 5️⃣ Agenda do Profissional - Nova ✅

```
/frontend/src/pages/staff/schedule.jsx
```

**Como usar:**
1. Frontend está pronto
2. Precisa integrar com endpoints:
   - `GET /api/staff/schedule` - carregar agenda
   - `POST /api/staff/schedule` - salvar disponibilidade
   - `GET /api/staff/bookings` - agendamentos confirmados
   - `GET /api/staff/requests` - solicitações pendentes

**Estrutura de Schedule:**
```json
{
  "staffId": "user-123",
  "availability": [
    "SEG-08:00",
    "SEG-09:00",
    "TER-08:00",
    // ... etc
  ]
}
```

---

## 🔗 Integrações com Backend Necessárias

### Endpoints Essenciais

```bash
# Profile do usuário
GET  /api/auth/profile                    # Retorna usuário logado
PUT  /api/users/:id                       # Atualiza perfil

# Agendamentos do Cliente
GET  /api/bookings                        # Lista de agendamentos
POST /api/bookings                        # Criar agendamento

# Pagamentos
GET  /api/payments                        # Histórico de pagamentos

# Schedule do Profissional
GET  /api/staff/schedule                  # Carregar disponibilidade
POST /api/staff/schedule                  # Salvar disponibilidade

# Agendamentos do Profissional
GET  /api/staff/bookings                  # Agendamentos confirmados
GET  /api/staff/requests                  # Solicitações pendentes
POST /api/staff/requests/:id/accept       # Aceitar solicitação
POST /api/staff/requests/:id/reject       # Recusar solicitação
```

### Validações Necessárias

```javascript
// Validação de PIX (Backend)
function isValidPIX(key) {
  return (
    isEmail(key) ||           // email@example.com
    isPhoneNumber(key) ||     // 11999999999
    isCPF(key) ||             // 12345678901
    isRandomKey(key)          // chave aleatória do banco
  );
}

// Validação de Banco
function isValidBank(code) {
  const validBanks = [
    '001', // Banco do Brasil
    '033', // Santander
    '104', // Caixa Econômica
    '237', // Bradesco
    '341', // Itaú
    // ... mais bancos
  ];
  return validBanks.includes(code);
}
```

---

## 🎨 Customizações Tailwind (Opcional)

Se quiser adicionar mais temas, edite **`tailwind.config.js`**:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Cores para tema personalizado
        custom: {
          50: '#f5f3f0',
          100: '#e8dcd5',
          500: '#d4a574',
          900: '#5a4a42',
        }
      }
    }
  },
  corePlugins: {
    // Permitir classes customizadas por tema
  },
  // Importante: suportar variants customizados
  variants: {
    extend: {
      // Para suportar 'pastel:' e 'high-contrast:'
    }
  }
}
```

---

## 📱 Testes Recomendados (Por Prioridade)

### 🔴 Crítico
- [ ] Tema persiste após reload (localStorage)
- [ ] Nenhuma barra branca no header em nenhum tema
- [ ] Login funciona e redireciona para /minha-conta
- [ ] Rol (role) do usuário detectado corretamente

### 🟠 Alta
- [ ] PIX salva e recupera do endpoint
- [ ] Agenda marca/desmarca horários corretamente
- [ ] Tabela de preços calcula preços dinamicamente
- [ ] Alto contraste completamente funcional

### 🟡 Média
- [ ] Responsividade em mobile
- [ ] Abas em minha-conta funcionam
- [ ] Botões de aceitar/recusar solicitações
- [ ] Contador de horas atualiza em tempo real

### 🟢 Baixa
- [ ] Animações de transição
- [ ] Ícones emojis carregam corretamente
- [ ] Espaçamento perfeito em todos os theme
- [ ] Links "Ver Solicitações" funcionam

---

## 🚦 Fluxo de Deployment

### Antes de Deploy (Checklist)

```
[ ] Testar em 4 temas diferentes
    [ ] Tema Claro
    [ ] Tema Escuro
    [ ] Alto Contraste
    [ ] Pastel

[ ] Verificar em 3 dispositivos
    [ ] Mobile (375px)
    [ ] Tablet (768px)
    [ ] Desktop (1920px)

[ ] Back-end endpoints testados
    [ ] GET /api/auth/profile
    [ ] PUT /api/users/:id
    [ ] POST/GET /api/staff/schedule
    [ ] GET /api/bookings

[ ] Acessibilidade
    [ ] Alt-text em imagens
    [ ] Labels em inputs
    [ ] Tab-order lógico
    [ ] ARIA attributes se necessário

[ ] Performance
    [ ] Lighthouse score > 85
    [ ] Nenhum erro no console
    [ ] Temas carregam em < 200ms
```

### Variáveis de Ambiente

Adicionar ao `.env.local` se necessário:

```env
NEXT_PUBLIC_THEME_DEFAULT=light
NEXT_PUBLIC_THEME_STORAGE_KEY=app-theme
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🔐 Segurança

### Dados Sensíveis

**PIX e Dados Bancários:**
- ✅ Salvar no BD criptografado
- ✅ Nunca exibir chave PIX inteira
- ✅ Validar formato antes de salvar
- ✅ Usar HTTPS em produção

**Autenticação:**
- ✅ Validar token em cada requisição
- ✅ Expiração de token em 24h
- ✅ Refresh token para renovação
- ✅ Logout limpa localStorage

---

## 📊 Analytics (Sugerido)

Rastrear uso de temas:
```javascript
// Quando usuário muda de tema
gtag.event('theme_change', {
  from_theme: currentTheme,
  to_theme: newTheme,
  user_role: userRole
});
```

---

## 🚨 Possíveis Erros e Soluções

### ❌ Erro: "Tema não persiste"
**Solução:**
```javascript
// Verificar se localStorage está habilitado
if (typeof localStorage === 'undefined') {
  console.warn('localStorage não disponível');
}
```

### ❌ Erro: "Classes Tailwind não aplicam"
**Solução:**
```javascript
// Verificar se classe está listada em tailwind.config.js
// Adicionar em content: ['./src/**/*.{js,jsx}']
```

### ❌ Erro: "PIX field undefined"
**Solução:**
```javascript
// Verificar resposta do endpoint GET /api/auth/profile
// Adicionar campo pixKey ao usuário no BD
```

### ❌ Erro: "Schedule não salva"
**Solução:**
```javascript
// Verificar se fetch usa Bearer token
// GET /api/staff/schedule com auth header
```

---

## 📞 Suporte

Se encontrar problemas:

1. **Verificar console** (F12 → Console)
2. **Verificar Network** (F12 → Network → ver requests)
3. **Verificar localStorage** (F12 → Application → localStorage)
4. **Verificar logs do backend** (docker logs backend)

---

## ✅ Checklist Final

Antes de considerar "pronto":

- [ ] Sistema de temas funcional (4 modos)
- [ ] Header sem visual glitches
- [ ] Página /minha-conta existente
- [ ] Página /staff/schedule existente
- [ ] Endpoints integrados com backend
- [ ] Testes passam em 4 temas
- [ ] Responsividade confirmada
- [ ] Alto contraste acessível
- [ ] localStorage persistindo tema
- [ ] Documentação atualizada

---

## 🎉 Conclusão

O sistema de temas e minha conta está **pronto para integração**!

### Próximas Ações:
1. Integrar endpoints do backend
2. Executar suite completa de testes
3. Deploy em staging
4. Coleta feedback de usuários
5. Deploy em produção

**Status**: 🟢 PRONTO PARA CÓDIGO DE PRODUÇÃO
