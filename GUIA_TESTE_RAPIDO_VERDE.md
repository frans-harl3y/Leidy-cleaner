# 🧪 GUIA RÁPIDO DE TESTE - DESIGN VERDE

## ⚡ 5 MINUTOS DE TESTES ESSENCIAIS

### 🏁 Teste 1: Responsividade Mobile (2 min)

1. **Abra seu navegador**
   ```
   http://localhost:3000
   ```

2. **Pressione F12** para abrir DevTools

3. **Clique em:** Ctrl+Shift+M (Toggle device mode)

4. **Selecione:** iPhone 12 Pro (390x844)

5. **Verifique:**
   - ✅ Padding em 0-4px (não está tocando as bordas)
   - ✅ Título "Sua Casa Impecável" cabe na tela
   - ✅ Botões têm pelo menos 44px de altura
   - ✅ Nenhum scroll horizontal desnecessário
   - ✅ Breadcrumb visível e faz scroll horizontal

**Status**: ✅ PASS / ❌ FAIL

---

### 🎬 Teste 2: Animações (1 min)

1. **Na home page (/):**

2. **Scroll down** lentamente

3. **Observe:**
   - ✅ Cards aparecem com fade-in suave
   - ✅ Nenhuma animação é irritante
   - ✅ Scrollbar está verde, não cinza

4. **Hover em cards:**
   - ✅ Card sobe 4px (lift effect)
   - ✅ Shadow fica verde (`shadow-green-500/50`)
   - ✅ Underline se anima de verde

5. **Clique em botões:**
   - ✅ Scale 1.05 on hover
   - ✅ Scale 0.95 on click (press effect)

**Status**: ✅ PASS / ❌ FAIL

---

### 🌙 Teste 3: Dark Mode (1 min)

1. **Pressione:** Shift+Ctrl+L (emula dark mode no Chrome)

2. **Ou vá a:** Settings → Appearance → Dark

3. **Verifique:**
   - ✅ Fundo escuro (slate-900)
   - ✅ Texto branco legível (não cinza puro)
   - ✅ Botões ainda têm gradiente verde
   - ✅ Cards têm shadow visível
   - ✅ Green mantém saturação
   - ✅ Sem elementos invisíveis

**Status**: ✅ PASS / ❌ FAIL

---

### 🎯 Teste 4: Cores Verde (1 min)

1. **Home (/):**
   - ✅ Botões "Agendar" tem gradiente VERDE
   - ✅ Links em verde com underline
   - ✅ Badges com fundo verde
   - ✅ Shadows em hover VERDES (não azul/cinza)

2. **Agendar Novo (/agendar-novo):**
   - ✅ Steps numerados em círculos VERDES
   - ✅ Progress bar é VERDE
   - ✅ CTA buttons são gradiente VERDE→EMERALD

3. **Dashboard (/dashboard-novo):**
   - ✅ Tabs com underline VERDE quando ativo
   - ✅ Cards têm borders VERDES
   - ✅ Quick actions com verde escuro

**Status**: ✅ PASS / ❌ FAIL

---

### 🧭 Teste 5: Breadcrumbs (1 min)

1. **Vá para:** /agendar-novo

2. **Verifique breadcrumb:**
   - ✅ Mostra: 🏠 Home › 📅 Novo Agendamento
   - ✅ Último item (📅) está em verde/bold
   - ✅ Clique em Home volta para /

3. **Vá para:** /dashboard-novo

4. **Verifique:**
   - ✅ Mostra: 🏠 › 📊 Dashboard
   - ✅ Mobile: scroll horizontal se necessário

**Status**: ✅ PASS / ❌ FAIL

---

## 🎯 VALIDAÇÃO COMPLETA (10-15 min)

### Se todos os testes acima passaram:

1. **Live reload funcionando?**
   ```bash
   npm run dev
   # Mude um arquivo CSS e veja atualizar
   ```

2. **Build sem erros?**
   ```bash
   npm run build
   # Não deve ter erros/warnings
   ```

3. **Testar em diferentes navegadores:**
   - Chrome ✅
   - Firefox ✅
   - Safari ✅
   - Edge ✅

4. **Testar em diferentes telas:**
   - iPhone SE (375px) ✅
   - iPhone 12 (390px) ✅
   - iPhone 14 Pro Max (430px) ✅
   - iPad (768px) ✅
   - Desktop (1080px+) ✅

---

## 🐛 TROUBLESHOOTING

### ❌ Problema: Botões não têm cor verde

**Solução:**
```bash
# 1. Limpar cache
npm run dev
# Ctrl+Shift+R (hard refresh)

# 2. Verifica classes Tailwind:
# Procure por: from-green-600
# Não deve ser: from-blue-600
```

---

### ❌ Problema: Dark mode não funciona

**Solução:**
```bash
# 1. Chrome DevTools → Settings → Rendering
# Enable: "Emulate CSS media feature prefers-color-scheme"

# 2. Selecione: prefers-color-scheme: dark

# 3. Se ainda não funcionar:
# Verifique: dark: prefix em classes Tailwind
```

---

### ❌ Problema: Animações não funcionam

**Solução:**
```bash
# 1. Verifique: Framer Motion importado
import { motion } from 'framer-motion'

# 2. Verifique: Chrome Settings → Rendering
# Disable: "Reduce motion" se estiver ativado

# 3. Limpe cache:
npm run dev
# Hard refresh: Ctrl+Shift+R
```

---

### ❌ Problema: Mobile com scroll horizontal

**Solução:**
```bash
# 1. DevTools → Console → Ctrl+Shift+J
# Procure por erros

# 2. Verifique classes:
# px-3 sm:px-4 (não px-8)
# w-full (não w-screen)

# 3. Breadcrumb mobile:
# Deve ter overflow-x-auto
# Não width ou padding excessivo
```

---

## ✅ CHECKLIST PER PAGE

### Home (/)
- [ ] Hero com fades
- [ ] Serviços com cards hover
- [ ] "Como funciona" com progress line
- [ ] Features section com ícones grandes
- [ ] CTA final em verde
- [ ] Breadcrumb em topo
- [ ] Responsivo mobile

### Agendar Novo (/agendar-novo)
- [ ] Header + Breadcrumb + Footer
- [ ] Progress bar animada
- [ ] Steps com números verdes
- [ ] ServiceSearch component funciona
- [ ] DemandIndicator mostra ofertas
- [ ] Formulário responsive
- [ ] Confirmação com checkmark

### Dashboard Novo (/dashboard-novo)
- [ ] Header + Breadcrumb + Footer
- [ ] Tabs com underline verde
- [ ] QuickStats mostra corretamente
- [ ] NextBookings com timeline
- [ ] BookingHistory com filtros
- [ ] Mobile com tabs em coluna
- [ ] Dark mode funciona

---

## 🚀 PRÉ-DEPLOYMENT CHECKLIST

**Antes de fazer push:**

```bash
# 1. Limpar arquivos desnecessários
npm run build
# Não deve haver erros

# 2. Verificar exports
npm run lint
# Não deve haver warnings críticos

# 3. Testar mobile uma última vez
# F12 → Device toggle → Mobile

# 4. Verificar produção
npm start
# http://localhost:3000

# 5. Test em incógnito (sem cache)
# Ctrl+Shift+N para incógnito

# 6. Final check
git status
# Só deve ter novos arquivos de componentes + CSS
```

---

## 📱 DEVICES A TESTAR

| Device | Resolução | Teste | Status |
|--------|-----------|--------|--------|
| iPhone SE | 375px | Mobile | [ ] |
| iPhone 12 | 390px | Mobile | [ ] |
| iPhone 14 Pro Max | 430px | Mobile | [ ] |
| iPad | 768px | Tablet | [ ] |
| iPad Pro | 1024px | Tablet | [ ] |
| Desktop | 1366px+ | Full | [ ] |

---

## 🎨 CORES A VALIDAR

| Cor | Hex | Uso | Teste |
|-----|-----|-----|-------|
| Principal | #16a34a | Buttons | [ ] |
| Hover | #15803d | Button hover | [ ] |
| Emerald | #10b981 | Accent | [ ] |
| Teal | #0d9488 | Gradients | [ ] |
| Light | #dcfce7 | Backgrounds | [ ] |

---

## 📊 RESULTADO FINAL

Se todos os testes acima passarem:

```
✅ Responsividade: OK
✅ Animações: OK
✅ Dark Mode: OK
✅ Cores Verde: OK
✅ Breadcrumbs: OK

🚀 PRONTO PARA DEPLOY!
```

---

**Tempo estimado de testes**: 15-20 minutos  
**Tempo de fix se falhar algo**: 5-10 minutos  

**BOA SORTE!** 🎨
