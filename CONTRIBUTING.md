# 🤝 Guia de Contribuição - VAMMOS

Obrigado por considerar contribuir para VAMMOS! Estamos felizes em ter você aqui. 

Este documento fornece diretrizes e instruções para contribuir de forma eficaz.

---

## 📋 Índice

1. [Código de Conduta](#código-de-conduta)
2. [Como Começar](#como-começar)
3. [Processo de Desenvolvimento](#processo-de-desenvolvimento)
4. [Padrões de Código](#padrões-de-código)
5. [Testes](#testes)
6. [Commits e PRs](#commits-e-prs)
7. [Revisão de Código](#revisão-de-código)
8. [Reportando Issues](#reportando-issues)

---

## 📖 Código de Conduta

### Nossa Promessa

Estamos comprometidos em fornecer um ambiente acolhedor e inspirador para todos, independentemente de:
- Idade, corpo, deficiência visível ou invisível
- Etnia, identidade e expressão de gênero
- Nível de experiência, educação, status socioeconômico
- Nacionalidade, aparência pessoal, raça, religião
- Identidade sexual e orientação

### Nossos Padrões

Exemplos de comportamento que contribuem para um ambiente positivo:
- ✅ Usar linguagem acolhedora e inclusiva
- ✅ Ser respeitoso com pontos de vista e experiências divergentes
- ✅ Aceitar críticas construtivas graciosamente
- ✅ Focar no que é melhor para a comunidade
- ✅ Mostrar empatia com outros membros da comunidade

Comportamentos inaceitáveis:
- ❌ Linguagem ou imagens sexualizadas
- ❌ Trolling, comentários insultuosos ou depreciativos
- ❌ Assédio público ou privado
- ❌ Comportamento agressivo ou condescendente
- ❌ Publicação de informações privadas sem consentimento

### Enforcement

Reportar comportamentos inaceitáveis para: [seu-email@vammos.com](mailto:seu-email@vammos.com)

---

## 🚀 Como Começar

### 1. Fork do Repositório
```bash
# Visite: https://github.com/ahri98h/vammos
# Clique em "Fork" (canto superior direito)
```

### 2. Clone seu Fork
```bash
git clone https://github.com/seu-usuario/vammos.git
cd vammos
git remote add upstream https://github.com/ahri98h/vammos.git
```

### 3. Crie uma Branch Feature
```bash
git checkout -b feature/sua-funcionalidade
# ou
git checkout -b fix/seu-bug
```

### 4. Setup do Projeto
```bash
# Executar setup automático
bash scripts/setup.sh

# Ou manualmente
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
docker-compose -f docker-compose.dev.yml up
```

---

## 💻 Processo de Desenvolvimento

### 1. Antes de Começar
- [ ] Verifique se existe uma issue relacionada
- [ ] Discuta mudanças maiores antes de começar
- [ ] Verifique o branch `develop` para começar

### 2. Durante Desenvolvimento
```bash
# 1. Crie branch from develop
git checkout develop
git pull upstream develop
git checkout -b feature/sua-feature

# 2. Faça mudanças
# ... código aqui ...

# 3. Commit frequente
git add .
git commit -m "feat: descrição"

# 4. Push para seu fork
git push origin feature/sua-feature

# 5. Crie Pull Request no GitHub
```

### 3. Estrutura de Commits

#### Tipos de Commit
```bash
feat:      Novo feature
fix:       Corrigir bug
docs:      Atualizar documentação
style:     Formatação, sem mudança lógica
refactor:  Refatorar código
test:      Adicionar/atualizar testes
chore:     Atualizar deps, config
ci:        CI/CD changes
perf:      Melhorias de performance
```

#### Exemplos Bons
```bash
git commit -m "feat: adicionar autenticação OAuth"
git commit -m "fix(api): corrigir validação de email"
git commit -m "refactor(user-service): simplificar lógica"
git commit -m "test: adicionar testes para novo endpoint"
git commit -m "docs: atualizar guia de setup"
```

#### Exemplos Ruins ❌
```bash
git commit -m "fix stuff"           # Vago
git commit -m "Update code"         # Não específico
git commit -m "WIP"                 # Work in progress
git commit -m "ASDFGH"              # Sem sentido
```

---

## 🎯 Padrões de Código

### Backend (Node.js/TypeScript)

#### Estrutura de Pastas
```
src/
├── controllers/      # Lógica HTTP
├── services/        # Lógica de negócio
├── repositories/    # Acesso a dados
├── middleware/      # Middlewares
├── types/           # TypeScript types
├── utils/           # Utilitários
└── config/          # Configuração
```

#### Padrão de Nomeação
```typescript
// Controllers: PascalCase + Controller
export class UserController {}

// Services: PascalCase + Service
export class UserService {}

// Repositories: PascalCase + Repository
export class UserRepository {}

// Funções: camelCase
function getUserById() {}

// Constantes: SCREAMING_SNAKE_CASE
const API_TIMEOUT = 5000;

// Interfaces: IPrefixoPascalCase
interface IUser {}
type UserDTO = {}
```

#### Exemplo Controller
```typescript
import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { asyncHandler } from '../utils/asyncHandler';

export class UserController {
  constructor(private userService: UserService) {}

  getUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  });
}
```

### Frontend (Next.js/React)

#### Estrutura de Componentes
```typescript
// ✅ BOM - Componente funcional com tipos
interface UserCardProps {
  userId: string;
  onDelete?: (id: string) => void;
}

export function UserCard({ userId, onDelete }: UserCardProps) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  return <div>{user?.name}</div>;
}

// ❌ RUIM - Component sem tipos
export default function UserCard(props) {
  // ...
}
```

#### Nomeação de Componentes
```typescript
// Componentes: PascalCase
export function UserProfile() {}
export const UserCard = () => {}

// Custom Hooks: useCamelCase
export function useApi(url) {}
export const useAuth = () => {}

// Utilitários: camelCase
export function formatDate(date) {}
export const calculateTotal = (items) => {}
```

### Linting e Formatação
```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
npm run format
```

---

## 🧪 Testes

### Obrigatório para Todo PR
- ✅ Testes unitários para lógica nova
- ✅ Testes de integração para APIs
- ✅ Coverage mínimo: 70%
- ✅ Todos os testes devem passar localmente

### Executar Testes

#### Backend
```bash
cd backend
npm test                    # Unit tests
npm run test:coverage      # Com coverage
npm run test:integration   # Testes de integração
```

#### Frontend
```bash
cd frontend
npm test                    # Unit + component tests
npm run test:coverage      # Com coverage
npm run cypress:open       # E2E UI
npm run playwright:test    # E2E headless
```

### Exemplo de Teste
```typescript
describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('deve retornar usuário por ID', async () => {
    const user = await service.getUserById('1');
    expect(user).toBeDefined();
    expect(user.id).toBe('1');
  });

  it('deve lançar erro para ID inválido', async () => {
    await expect(service.getUserById('invalid')).rejects.toThrow();
  });
});
```

---

## 📝 Commits e PRs

### Commit Message Checklist
- [ ] Tipo de commit correto (feat, fix, docs, etc)
- [ ] Descrição clara em português ou inglês
- [ ] Não excede 72 caracteres
- [ ] Não contém "fix #123" (usar em PR description)
- [ ] Minúscula (exceto para iniciais apropriadas)

### Pull Request Checklist
```markdown
## Descrição
Breve descrição do que foi feito

## Tipo
- [ ] Feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Performance
- [ ] Refactoring

## Mudanças
- [ ] Adicionado autenticação JWT
- [ ] Refatorado service de usuários
- [ ] Atualizado documentação

## Issues
Fixes #123

## Testing
- [ ] Testes unitários adicionados
- [ ] Coverage > 70%
- [ ] Testes passando localmente
- [ ] Nenhum breaking change

## Checklist
- [ ] Código segue padrões do projeto
- [ ] Linting passou
- [ ] Documentação atualizada
- [ ] Commits com mensagens claras
- [ ] Sem secrets/credentials
```

### Exemplo de PR Title
```
✅ Bom:
feat: adicionar autenticação OAuth
fix: corrigir validação de email
docs: atualizar guia de setup

❌ Ruim:
Update stuff
Fix bug
WIP - don't merge
Fix #123
```

---

## 👀 Revisão de Código

### O que Esperamos

#### ✅ Aprovação Quando:
- Código segue padrões
- Testes passam em 70%+
- Documentação atualizada
- Sem linting errors
- Commits com mensagens claras

#### ❌ Rejeitado Quando:
- Coverage < 70%
- Breaking changes sem discussão
- Seletores hardcoded
- Console.log em produção
- Secrets/credentials no código

### Respondendo a Reviews
```bash
# Se pedir mudanças
git add .
git commit --amend          # Pode amender último commit
git push --force-with-lease # Force push com segurança

# Não criar novos commits para fixes pequenos
# Amend é melhor para manter histórico limpo
```

---

## 🐛 Reportando Issues

### Antes de Reportar
- [ ] Verifique se issue não existe
- [ ] Atualize para versão mais recente
- [ ] Leia documentation relevante
- [ ] Tente reproduzir em ambiente limpo

### Estrutura de Issue

#### Bug Report
```markdown
**Descrição**
Breve descrição do bug

**Passos para Reproduzir**
1. Vá para...
2. Clique em...
3. Observe o erro

**Comportamento Esperado**
O que deveria acontecer

**Comportamento Atual**
O que está acontecendo

**Logs/Screenshots**
Cole relevante logs ou screenshots

**Environment**
- OS: [Windows/Linux/macOS]
- Node: [versão]
- Docker: [versão]
```

#### Feature Request
```markdown
**Descrição**
O que gostaria de adicionar

**Motivação**
Por que isso seria útil

**Solução Proposta**
Como você imagina implementar

**Alternativas**
Outras formas de resolver
```

---

## 🔗 Recursos Úteis

### Documentação
- [README.md](README.md) - Overview do projeto
- [GUIA_RAPIDO.md](GUIA_RAPIDO.md) - Comandos rápidos
- [GUIA_BOAS_PRATICAS_COMPLETO.md](GUIA_BOAS_PRATICAS_COMPLETO.md) - Detalhes técnicos
- [GUIA_SETUP_INICIAL.md](GUIA_SETUP_INICIAL.md) - Setup completo

### Links do Projeto
- 📖 [Documentação](.)
- 🐛 [Issues](https://github.com/ahri98h/vammos/issues)
- 💬 [Discussions](https://github.com/ahri98h/vammos/discussions)
- 📊 [Projects](https://github.com/ahri98h/vammos/projects)

---

## ❓ FAQ

**P: Como obtenho acesso write?**
A: Normal não precisa. Fork, faça PR, merge automático quando aprovado.

**P: Quanto tempo leva para revisar PR?**
A: 1-3 dias úteis, depende da complexidade.

**P: Posso trabalhar em múltiplas features?**
A: Sim, mas branches separadas para cada uma.

**P: Preciso de permission especial?**
A: Não, fork + PR é suficiente para contribuir.

**P: Como viro maintainer?**
A: Contribuições consistentes e qualidade de código.

---

## 📞 Contato

- 📧 Email: dev@vammos.com
- 💬 Slack: [seu workspace]
- 🐙 GitHub Issues: [Abrir issue](https://github.com/ahri98h/vammos/issues)

---

## 🎉 Agradecimentos

Obrigado por contribuir para VAMMOS! Sua ajuda torna este projeto melhor. 🙌

---

**Última atualização:** Fevereiro, 2026

Happy Coding! 🚀
