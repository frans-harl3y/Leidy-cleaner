# 📚 ÍNDICE MESTRE - Guia de Boas Práticas VAMMOS

**Status:** ✅ Completo | **Data:** Fevereiro 2026 | **Versão:** 1.0

---

## 🎯 Este é seu punto Zero

Bem-vindo ao guia completo de boas práticas do projeto VAMMOS. Este documento serve como **índice mestre** para todos os guias de desenvolvimento.

### ⚡ Comece por aqui:

1. **Novo no projeto?** → Leia [GUIA_SETUP_INICIAL.md](#guia-setup-inicial)
2. **Precisa de comandos rápidos?** → Vá para [GUIA_RAPIDO.md](#guia-rapido)
3. **Quer entender a arquitetura?** → Consulte [RESUMO_VISUAL.md](#resumo-visual)
4. **Precisa de detalhes técnicos?** → Consulte [GUIA_BOAS_PRATICAS_COMPLETO.md](#guia-completo)

---

## 📂 Mapa de Documentos

### 📖 Guias Principais

#### [GUIA_BOAS_PRATICAS_COMPLETO.md](GUIA_BOAS_PRATICAS_COMPLETO.md)
**A Bíblia técnica do projeto** - Guia detalhado de 14 seções

| Seção | Descrição | Público |
|-------|-----------|---------|
| 1. [Configuração Inicial](#1-configuração-inicial-do-projeto) | Setup do projeto | Iniciantes |
| 2. [Estrutura de Pastas](#2-estrutura-de-pastas) | Organização | Todos |
| 3. [Backend - Node.js/TypeScript](#3-backend--nodejstypescript) | Padrões de código backend | Backend devs |
| 4. [Frontend - Next.js/React](#4-frontend--nextjsreact) | Componentes e hooks | Frontend devs |
| 5. [Banco de Dados](#5-banco-de-dados) | Migrations e queries | Backend/DevOps |
| 6. [Testes Automatizados](#6-testes-automatizados) | Jest, Cypress, Playwright | QA/Todos |
| 7. [Docker & Containerização](#7-docker--containerização) | Dockerfiles e Compose | DevOps/Todos |
| 8. [Deployment & CI/CD](#8-deployment--cicd) | GitHub Actions | DevOps |
| 9. [Git & Versionamento](#9-git--versionamento) | Workflow de commits | Todos |
| 10. [Segurança](#10-segurança) | JWT, CORS, Validação | Todos |
| 11. [Performance & Otimização](#11-performance--otimização) | Cache, Índices | Todos |
| 12. [Variáveis de Ambiente](#12-variáveis-de-ambiente) | .env e configurações | Todos |
| 13. [Monitoramento & Logs](#13-monitoramento--logs) | Winston, Health checks | DevOps/Backend |
| 14. [Documentação](#14-documentação) | Swagger, README | Todos |

---

#### [GUIA_RAPIDO.md](GUIA_RAPIDO.md)
**Quick Reference** - Comandos e padrões em uma página

**Ideal para:**
- ⚡ Procurar comandos rápidos
- 🔧 Refrescar padrões de código
- 🐛 Resolver problemas comuns
- 📋 Checklist pré-deploy

**Contém:**
- Comandos essenciais
- Padrões de componentes
- Estrutura de pastas rápida
- Commits convencionais
- Debugging tips
- Checklist para PRs

---

#### [RESUMO_VISUAL.md](RESUMO_VISUAL.md)
**Mapas e Diagramas** - Visualização da arquitetura

**Ideal para:**
- 🏗️ Entender arquitetura
- 🔄 Visualizar workflows
- 📊 Ver stack tecnológico
- 🚀 Entender pipeline CI/CD
- 🎯 Matriz de responsabilidades

**Contém:**
- Arquitetura geral
- Ciclo de desenvolvimento
- Estrutura de diretórios visual
- Stack tecnológico
- Segurança em camadas
- Pirâmide de testes
- Pipeline CI/CD
- Métricas de qualidade

---

#### [GUIA_SETUP_INICIAL.md](GUIA_SETUP_INICIAL.md)
**Para novos membros** - Passo a passo inicial

**Ideal para:**
- 👤 Novo no projeto
- 💻 Configurar ambiente local
- 🔑 Gerar credenciais
- 🧪 Executar primeiro teste

---

### 📚 Documentação Técnica Específica

#### Backend
- **[backend/DEPLOY.md](backend/DEPLOY.md)** - Deployment backend
- **[backend/TESTING.md](backend/TESTING.md)** - Estratégia de testes
- **[backend/README.md](backend/README.md)** - Documentação específica
- **[backend/TESTING_STRATEGY.md](backend/TESTING_STRATEGY.md)** - Planejamento de testes
- **[backend/SUPABASE_SETUP.md](backend/SUPABASE_SETUP.md)** - Configuração do banco
- **[backend/EMAIL_QUEUE_GUIDE.md](backend/EMAIL_QUEUE_GUIDE.md)** - Filas de email

#### Frontend
- **[frontend/README.md](frontend/README.md)** - Documentação específica
- **[frontend/DESIGN_SYSTEM.md](frontend/DESIGN_SYSTEM.md)** - Sistema de design
- **[frontend/TESTING_GUIDE.md](frontend/TESTING_GUIDE.md)** - Guia de testes
- **[frontend/COMPONENT_INDEX.md](frontend/COMPONENT_INDEX.md)** - Índice de componentes

#### Infraestrutura
- **[config/ci-cd/](config/ci-cd/)** - Workflows GitHub Actions
- **[database/](database/)** - Scripts de banco de dados
- **[docker-compose.yml](docker-compose.yml)** - Orquestração local

---

## 🚀 Guias por Caso de Uso

### I. "Estou iniciando no projeto"
```
1. Ler: GUIA_RAPIDO.md (10 min)
2. Ler: GUIA_SETUP_INICIAL.md (15 min)
3. Executar: npm install && docker-compose up (5 min)
4. Ler: RESUMO_VISUAL.md (10 min)
Total: ~40 minutos
```

### II. "Vou fazer um novo feature"
```
1. Ler: GUIA_RAPIDO.md - Git Workflow (5 min)
2. Ler: GUIA_BOAS_PRATICAS_COMPLETO.md - Sua camada (Backend/Frontend) (20 min)
3. Ler: Tests section (5 min)
4. Implementar feature
5. Ler: Checklist pré-PR em GUIA_RAPIDO.md (5 min)
6. Publicar PR
Total: ~Variável (40+ min leitura)
```

### III. "Preciso fazer deploy"
```
1. Ler: RESUMO_VISUAL.md - Pipeline CI/CD (10 min)
2. Ler: GUIA_BOAS_PRATICAS_COMPLETO.md #8 - Deployment (15 min)
3. Ler: backend/DEPLOY.md (5 min)
4. Executar checklist (10 min)
5. Fazer deploy
Total: ~40 minutos
```

### IV. "Encontrei um bug"
```
1. Ler: GUIA_RAPIDO.md - Debugging (5 min)
2. Ler: GUIA_BOAS_PRATICAS_COMPLETO.md - Monitoramento (10 min)
3. Investigar logs
4. Corrigir
5. Adicionar teste para regressão
Total: ~Variável
```

### V. "Preciso de performance"
```
1. Ler: RESUMO_VISUAL.md - Performance checklist (10 min)
2. Ler: GUIA_BOAS_PRATICAS_COMPLETO.md #11 (20 min)
3. Executar profiling
4. Otimizar
5. Medir melhoria
Total: ~Variável
```

---

## 💾 Stack & Contato Rápido

### Versões Obrigatórias
- **Node.js:** 18.x LTS
- **npm/yarn:** Latest
- **PostgreSQL:** 15
- **Docker:** 24.x
- **Docker Compose:** 2.x

### Contatos Importantes
- **Lead Backend:** Ver GitHub
- **Lead Frontend:** Ver GitHub
- **DevOps/Infra:** Ver GitHub
- **Dúvidas Técnicas:** GitHub Issues
- **Emergências:** Slack (canal #dev)

### Links Críticos
- 🔗 **Repositório:** https://github.com/seu-org/vammos
- 📊 **Board:** GitHub Projects
- 📄 **Docs:** Esta pasta
- 🐛 **Issues:** GitHub Issues
- 💬 **Discussions:** GitHub Discussions

---

## 📋 Checklist de Leitura (Recomendado)

### Para Todos (Obrigatório)
- [ ] GUIA_RAPIDO.md
- [ ] RESUMO_VISUAL.md - Arquitetura e Workflow
- [ ] GUIA_BOAS_PRATICAS_COMPLETO.md #9 - Git & Versionamento
- [ ] GUIA_BOAS_PRATICAS_COMPLETO.md #10 - Segurança

### Para Backend Devs
- [ ] GUIA_BOAS_PRATICAS_COMPLETO.md #3 - Backend
- [ ] GUIA_BOAS_PRATICAS_COMPLETO.md #5 - Database
- [ ] GUIA_BOAS_PRATICAS_COMPLETO.md #6 - Testes (Backend)
- [ ] backend/TESTING_STRATEGY.md
- [ ] backend/SUPABASE_SETUP.md

### Para Frontend Devs
- [ ] GUIA_BOAS_PRATICAS_COMPLETO.md #4 - Frontend
- [ ] GUIA_BOAS_PRATICAS_COMPLETO.md #6 - Testes (Frontend)
- [ ] frontend/DESIGN_SYSTEM.md
- [ ] frontend/COMPONENT_INDEX.md
- [ ] frontend/TESTING_GUIDE.md

### Para DevOps/Infra
- [ ] GUIA_BOAS_PRATICAS_COMPLETO.md #7 - Docker
- [ ] GUIA_BOAS_PRATICAS_COMPLETO.md #8 - Deployment
- [ ] RESUMO_VISUAL.md - Pipeline CI/CD
- [ ] backend/DEPLOY.md
- [ ] docker-compose files

### Para QA/Testes
- [ ] GUIA_BOAS_PRATICAS_COMPLETO.md #6 - Testes Completo
- [ ] RESUMO_VISUAL.md - Pirâmide de Testes
- [ ] backend/TESTING_STRATEGY.md
- [ ] frontend/TESTING_GUIDE.md

---

## 🎓 Estrutura Recomendada de Aprendizado

```
SEMANA 1: Fundações
├─ Day 1: GUIA_RAPIDO.md (conhecimento geral)
├─ Day 2: GUIA_SETUP_INICIAL.md (configurar ambiente)
├─ Day 3: RESUMO_VISUAL.md (entender arquitetura)
└─ Day 4-5: Documentação específica da role

SEMANA 2: Hands-on
├─ Fazer task simples
├─ Abrir PR
├─ Receber feedback
└─ Iterar

SEMANA 3+: Confiança
├─ Tasks média complexidade
├─ Mentorear novo membro
├─ Contribuir com documentação
└─ Propor melhorias
```

---

## 🔄 Manutenção & Atualização dos Guides

### Como manter os guides atualizados

1. **Quando mudar algo no projeto:**
   - Atualizar o guia relevante
   - Adicionar data de atualização
   - Notificar o time

2. **Rotina mensal:**
   - Revisar guias
   - Adicionar feedback do time
   - Remover informações obsoletas

3. **Contribuições:**
   - Sugestões via issues
   - Pull requests bem-vindos
   - Discussões construtivas

---

## 🏆 Best Practices sobre Best Practices

✅ **DO:**
- Ler antes de começar uma task
- Bookmark para referência rápida
- Compartilhar conhecimento com novo membro
- Reportar informações desatualizadas
- Contribuir com melhorias

❌ **DON'T:**
- Ignorar documentação
- Fazer trabalho sem entender o padrão
- Deixar documentação desatualizadas
- Ter código sem testes
- Commitar sem mensagem clara

---

## 📞 FAQ Rápido

**P: Por onde começo?**
R: GUIA_RAPIDO.md (5 min) → GUIA_SETUP_INICIAL.md (15 min)

**P: Como faço um feature novo?**
R: GUIA_RAPIDO.md (Git Workflow) + Seção 3/4 do guia completo

**P: Qual é o padrão para testar?**
R: GUIA_BOAS_PRATICAS_COMPLETO.md #6 (Testes Automatizados)

**P: Como submeto um PR?**
R: GUIA_RAPIDO.md - Checklist + GUIA_BOAS_PRATICAS_COMPLETO.md #9

**P: Preciso deployer, e agora?**
R: RESUMO_VISUAL.md (Pipeline) → GUIA_BOAS_PRATICAS_COMPLETO.md #8

**P: Há um guide para MINHA situação?**
R: Consulte este índice ou abra uma issue

---

## 🎯 Métricas de Sucesso

Você saberá que está no caminho certo quando:

- ✅ Consegue iniciar o projeto em < 30 min
- ✅ Faz seu primeiro PR sem dúvidas
- ✅ Seus testes passam na CI/CD
- ✅ Seu código não tem linting errors
- ✅ Consegue mentorar novo membro
- ✅ Propõe melhorias nos guias

---

## 📊 Estatísticas dos Documentos

| Documento | Tamanho | Tempo de Leitura | Público |
|-----------|---------|-----------------|---------|
| GUIA_RAPIDO.md | ~2 páginas | 10-15 min | Todos |
| RESUMO_VISUAL.md | ~4 páginas | 15-20 min | Arquitetura |
| GUIA_BOAS_PRATICAS_COMPLETO.md | ~20 páginas | 2-3 horas | Técnico completo |
| GUIA_SETUP_INICIAL.md | ~5 páginas | 30-45 min | Novos membros |
| **TOTAL** | **~31 páginas** | **3-4 horas** | **Referência completa** |

---

## 📝 Notas Finais

### Para o Time:
Este conjunto de documentos foi criado para **facilitar a vida de todos**. Use como referência, não como burocracia. Se algo não faz sentido, abra uma issue.

### Princípios:
1. **Documentação viva** - Atualize conforme aprende
2. **Simplicidade** - Prefira clareza sobre complexidade
3. **Praticidade** - Exemplos reais de código
4. **Inclusão** - Guias para todos os níveis

### Contribuindo:
- Viu erro? Corrija!
- Aprendeu algo novo? Documente!
- Sugestão de melhoria? Sugira!

---

## 📚 Ordenação de Leitura Recomendada

```
Novato no Projeto
    ↓
GUIA_RAPIDO.md (5 min)
    ↓
GUIA_SETUP_INICIAL.md (15 min)
    ↓
RESUMO_VISUAL.md (15 min)
    ↓
Docker-compose up ✅
    ↓
Escolha sua especialidade:
    ├─ Backend? → GUIA_BOAS_PRATICAS_COMPLETO.md #3,5,6
    ├─ Frontend? → GUIA_BOAS_PRATICAS_COMPLETO.md #4,6
    ├─ DevOps? → GUIA_BOAS_PRATICAS_COMPLETO.md #7,8
    └─ QA? → GUIA_BOAS_PRATICAS_COMPLETO.md #6
    ↓
Fazer primeira task
    ↓
Abrir primeiro PR
    ↓
Mentorear novo membro
    ↓
Master 🎓
```

---

## 🎉 Bem-vindo ao VAMMOS!

Estamos felizes em tê-lo no time. Estes guias foram criados para tornar sua jornada mais suave. Se tiver dúvidas, **sempre há alguém para ajudar**.

**Comece agora:** [GUIA_RAPIDO.md](GUIA_RAPIDO.md)

---

**Última atualização:** Fevereiro de 2026  
**Responsável:** Time de Desenvolvimento  
**Versão:** 1.0  
**Status:** ✅ Ativo e Mantido
