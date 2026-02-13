# 🧪 Guia de Testes - Sistema de Temas e Minha Conta

## 📋 Checklist de Testes

### 1️⃣ Sistema de Temas

#### Teste 1.1: Seletor de Temas Funciona
```
[ ] Abrir aplicação
[ ] Localizar seletor de temas no header (4 botões: ☀️ 🌙 ◆ 🎨)
[ ] Clicar em cada tema
[ ] Verificar se interface muda de cor
[ ] Reload a página
[ ] Tema selecionado foi mantido? ✅ Sim (localStorage)
```

#### Teste 1.2: Cores por Tema
```
CLARO (☀️):
[ ] Fundo: Branco
[ ] Texto: Cinza escuro/Preto
[ ] Header: Branco com border verde
[ ] Logo: Verde vibrante
[ ] Botões: Verde e Emerald

ESCURO (🌙):
[ ] Fundo: Gray-950 (preto muito escuro)
[ ] Texto: Branco
[ ] Header: Gray-950 com border gray-800
[ ] Logo: Verde claro
[ ] Botões: Verde/branco

ALTO CONTRASTE (◆):
[ ] Fundo: Preto puro (#000000)
[ ] Texto: Branco puro (#FFFFFF)
[ ] Header: Preto com border branca 4px
[ ] Logo: Branco
[ ] Botões: Branco (fundo) com texto preto

PASTEL (🎨):
[ ] Fundo: Rose-50/Pink-50
[ ] Texto: Cinza escuro
[ ] Header: Gradiente roxo→rosa
[ ] Logo: Roxo
[ ] Botões: Roxo/Rosa gradient
```

#### Teste 1.3: Sem Barras Brancas
```
[ ] Abrir header em cada tema
[ ] Verificar:
    - Nenhuma barra branca no topo
    - Nenhuma barra branca no rodapé
    - Cores uniformes da esquerda à direita
    - Sem gradientes causando "vazamento"
[ ] Header ocupa 100% da largura? ✅
[ ] Logo aparece corretamente? ✅
[ ] Navegação legível? ✅
```

---

### 2️⃣ Página de Minha Conta

#### Teste 2.1: Fluxo de Autenticação
```
Cenário 1: Usuário NÃO autenticado
[ ] Acessar /minha-conta
[ ] Deve redirecionar para /login ✅

Cenário 2: Token inválido
[ ] Acessar /minha-conta com token expirado
[ ] Deve limpar token
[ ] Deve redirecionar para /login ✅

Cenário 3: Usuário autenticado
[ ] Login com credentials válidas
[ ] Acessar /minha-conta
[ ] Deve carregar perfil correto ✅
```

#### Teste 2.2: Cliente - Perfil
```
Tipo de Usuário: CLIENTE (role: 'customer')

[ ] Avatar com inicial do nome
[ ] Nome do usuário
[ ] Label "Cliente Premium"

Abas Visíveis:
[ ] 📋 Informações
[ ] 📅 Meus Agendamentos
[ ] 💳 Pagamentos

Tab "Informações":
[ ] Exibir: Nome, Email, Telefone, Endereço
[ ] Botão "✏️ Editar Informações"
[ ] Ao clicar:
    [ ] Nome vira input
    [ ] Email vira input
    [ ] Telefone vira input
    [ ] Endereço vira input
    [ ] Botão muda para "💾 Salvar"
    [ ] Botão "❌ Cancelar" aparece
[ ] Botão "Salvar" envia PUT request
[ ] Sucesso: alert("Perfil atualizado com sucesso!")
```

#### Teste 2.3: Profissional - Perfil
```
Tipo de Usuário: PROFISSIONAL (role: 'staff' ou 'professional')

[ ] Avatar com ícone 👩‍💼
[ ] Nome do usuário
[ ] Label "Profissional de Limpeza"
[ ] Rating: "⭐ 4.8 (120 avaliações)"
[ ] Botão "📅 Ver Solicitações"

Abas Visíveis:
[ ] 📋 Informações
[ ] 💰 Tabela de Preços
[ ] 📅 Minha Agenda
[ ] 💵 Ganhos

Tab "Informações":
[ ] Nome, Bio, Email visíveis
[ ] Preço Base: "R$ 50.00"
[ ] 💰 Dados para Recebimento (seção destacada em amarelo):
    [ ] Campo "Chave PIX" (com placeholder)
    [ ] Campo "Banco" (código)
    [ ] Campo "Conta" (número)
[ ] Botão "✏️ Editar Informações"
[ ] Modo edição:
    [ ] Campo PIX editável
    [ ] Campo Banco editável
    [ ] Campo Conta editável
    [ ] Botão "💾 Salvar"

Tab "Tabela de Preços":
[ ] Tabela com 5 serviços:
    | Limpeza Básica (1h)        | 1h | R$ 50.00  |
    | Limpeza Padrão (2h)        | 2h | R$ 100.00 |
    | Limpeza Profunda (3h)      | 3h | R$ 150.00 |
    | Organização (2h)           | 2h | R$ 130.00 |
    | Limpeza Pós-Reforma (4h)   | 4h | R$ 300.00 |
[ ] Cálculo correto de preços? ✅
[ ] Todas têm status "Ativo" em verde

Tab "Minha Agenda":
[ ] Tabela com dias da semana (SEG-DOM) nas colunas
[ ] Horários de 08:00 a 18:00 nas linhas
[ ] 56 botões (7 dias × 8 horários)
[ ] Ao clicar botão:
    [ ] Botão muda de "-" para "✓"
    [ ] Cor muda para verde
    [ ] Botão fica "selecionado"
[ ] Botão "💾 Salvar Agenda"
[ ] Botão "🗑️ Limpar Tudo"
[ ] Contador: "Você tem X horários disponíveis por semana"

Tab "Ganhos":
[ ] Card "Este Mês": "R$ 2.450,00"
[ ] Card "Total Acumulado": "R$ 12.890,00"
[ ] Card "Agendamentos": "47"
```

#### Teste 2.4: Admin - Perfil
```
Tipo de Usuário: ADMIN (role: 'admin')

[ ] Avatar com ícone 👨‍💼
[ ] Nome
[ ] Label "Administrador"

Cards Estatísticas:
[ ] 👥 Usuários: "247"
[ ] 📅 Agendamentos: "1,234"
[ ] 👩‍💼 Profissionais: "48"
[ ] 💰 Receita: "R$ 45.2k"

[ ] Botão "🛠️ Painel Admin" redireciona para /admin-dashboard
```

---

### 3️⃣ Agenda do Profissional

#### Teste 3.1: Página de Schedule
```
URL: /staff/schedule

[ ] Header: "📅 Minha Agenda"
[ ] Descrição: "Gerencie sua disponibilidade e horários de trabalho"

Abas:
[ ] 📅 Disponibilidade (ativa por padrão)
[ ] 📋 Agendamentos
[ ] 🔔 Solicitações
```

#### Teste 3.2: Aba Disponibilidade
```
[ ] Tabela visível com:
    Linhas: 08:00, 09:00, 10:00, 11:00, 12:00, 14:00, 15:00, 16:00, 17:00, 18:00
    Colunas: Horário, SEG, TER, QUA, QUI, SEX, SÁB, DOM

[ ] 70 botões (10 horários × 7 dias)

Interação:
[ ] Clicar botão → muda cor para verde
[ ] Texto muda de "-" para "✓"
[ ] Clicar novamente → volta a "-" (deseleciona)
[ ] Contador atualiza em tempo real

[ ] Botão "💾 Salvar Agenda" → alert("Agenda salva com sucesso!")
[ ] Botão "🗑️ Limpar Tudo" → deseleciona todos
[ ] Info box: "Você tem 56 horários disponíveis por semana"
```

#### Teste 3.3: Aba Agendamentos
```
[ ] Lista com 2 agendamentos exemplo:

Agendamento 1:
├─ Cliente: Maria Silva
├─ Serviço: Limpeza Completa
├─ 📅 Data: 15/01/2024
├─ 🕐 Horário: 10:00h
├─ ⏱️ Duração: 2h
├─ 💰 Valor: R$ 150,00
├─ Status: ✅ confirmado (em verde)
└─ Botões: [👁️ Detalhes] [💬 Mensagem]

Agendamento 2:
├─ Cliente: João Santos
├─ Serviço: Organização
├─ 📅 Data: 16/01/2024
├─ 🕐 Horário: 14:00h
├─ ⏱️ Duração: 3h
├─ 💰 Valor: R$ 180,00
├─ Status: ✅ confirmado
└─ Botões: [👁️ Detalhes] [💬 Mensagem]
```

#### Teste 3.4: Aba Solicitações
```
[ ] Lista com 2 solicitações exemplo:

Solicitação 1 (Alert amarela):
├─ Cliente: Ana Costa
├─ Serviço: Limpeza Pós-Reforma
├─ 📅 Data: 17/01/2024
├─ 🕐 Horário: 09:00h
├─ ⏱️ Duração: 4h
├─ 💰 Valor: R$ 250,00
├─ Status: ⏳ Pendente (amarela)
└─ Botões: [✅ Aceitar (verde)] [❌ Recusar]

Solicitação 2 (Alert amarela):
├─ Cliente: Pedro Oliveira
├─ Serviço: Limpeza Profunda
├─ 📅 Data: 18/01/2024
├─ 🕐 Horário: 14:00h
├─ ⏱️ Duração: 3h
├─ 💰 Valor: R$ 180,00
├─ Status: ⏳ Pendente
└─ Botões: [✅ Aceitar] [❌ Recusar]
```

---

### 4️⃣ Responsividade

#### Teste 4.1: Mobile (< 640px)
```
[ ] Header logo se adapta (menor em mobile)
[ ] Navegação se torna menu hambúrguer
[ ] Seletor de temas aparece em linha horizontal
[ ] Tabelas scrollam horizontalmente se necessário
[ ] Botões com tamanho adequado (toque)
```

#### Teste 4.2: Tablet (640px - 1024px)
```
[ ] Layout mantém bom espaçamento
[ ] Navegação ainda compacta
[ ] Tabelas começam a caber na tela
[ ] Grids de cards (2 colunas)
```

#### Teste 4.3: Desktop (> 1024px)
```
[ ] Layout cheio com espaçamento
[ ] Navegação em linha (não hambúrguer)
[ ] Tabelas com scroll adequado
[ ] Grids com 3-4 colunas
```

---

### 5️⃣ Acessibilidade

#### Teste 5.1: Alto Contraste
```
Modo: high-contrast

[ ] Todas as cores mudam para preto/branco
[ ] Bordas brancas visíveis
[ ] Texto 100% legível
[ ] Botões têm bordas claras
[ ] Nenhuma informação perdida por falta de cor
```

#### Teste 5.2: Keyboard Navigation
```
[ ] Tab navega entre todos os elementos interativos
[ ] Enter ativa botões
[ ] Espaço ativa checkboxes/selects
[ ] Fecha modais com ESC (se houver)
```

---

## 🐛 Errros Comuns a Verificar

- [ ] Tema não persiste após reload? → Verificar localStorage
- [ ] Cores estranhas? → Verificar Tailwind dark/high-contrast classes
- [ ] PIX field não salva? → Verificar endpoint PUT /api/users/:id
- [ ] Agendamentos não aparecem? → Verificar GET /api/bookings
- [ ] Header com barra branca? → Verificar gradients não usados

---

## 📊 Casos de Uso (User Stories)

### Story 1: Cliente Muda de Tema
```gherkin
Given que estou na home page
When clico no botão "🌙" (Escuro)
Then a interface inteira muda para modo escuro
And minha preferência é salva
And ao recarregar a página, continua em modo escuro
```

### Story 2: Profissional Adiciona PIX
```gherkin
Given que sou um profissional logado
When acesso /minha-conta
And clico "✏️ Editar Informações"
Then posso digitar minha chave PIX
And salvo com "💾 Salvar"
And a chave PIX fica salva no meu perfil
```

### Story 3: Profissional Marca Horários
```gherkin
Given que estou em /staff/schedule
When clico nos horários para marcar disponibilidade
Then cada horário clicado muda de cor
And o contador atualiza
And quando clico "💾 Salvar", agenda é enviada ao backend
```

---

## ✨ Conclusão do Teste

Após completar todos os testes acima:
- [ ] Sistema de temas funciona em todos os 4 modos
- [ ] Header sem barras brancas
- [ ] Minha Conta com fluxo correto por tipo de usuário
- [ ] PIX e dados bancários salvos
- [ ] Tabela de preços exibida corretamente
- [ ] Agenda do profissional funcional
- [ ] Responsividade em mobile/tablet/desktop
- [ ] Acessibilidade Alto Contraste
- [ ] Persistência de tema no localStorage

**Status de Testes**: 🟡 PRONTO PARA INICIAR
