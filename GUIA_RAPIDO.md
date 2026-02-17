# 🚀 Quick Reference - Guia Rápido

## Comandos Essenciais

### Iniciar Projeto
```bash
# Setup inicial
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Com Docker
docker-compose -f docker-compose.dev.yml up

# Sem Docker (modo desenvolvimento)
npm run dev
```

### Desenvolver
```bash
# Backend
cd backend
npm run dev        # Início com nodemon
npm run build      # Compilar TypeScript
npm run lint       # Verificar linting
npm run test       # Executar testes

# Frontend
cd frontend
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run test       # Executar testes
npm run lint       # Verificar linting
```

### Testing
```bash
# Backend
npm run test                    # Testes unitários
npm run test:watch             # Watch mode
npm run test:coverage          # Com cobertura
npm run test:integration       # Testes de integração

# Frontend
npm run test                    # Testes Jest
npm run test:watch             # Watch mode
npm run cypress:open           # Cypress UI
npm run playwright:test        # Playwright
```

### Database
```bash
npm run db:setup               # Inicializar schema
npm run migrate                # Executar migrações
npm run seed                   # Popular dados
npm run db:drop                # Limpar banco (dev only)
```

### Git Workflow
```bash
# Criar feature
git checkout -b feature/nova-funcionalidade

# Fazer commit
git add .
git commit -m "feat: descrição da funcionalidade"

# Push e criar PR
git push origin feature/nova-funcionalidade

# Fazer merge (após aprovação)
git checkout develop
git merge --no-ff feature/nova-funcionalidade
git branch -d feature/nova-funcionalidade
```

---

## Padrões de Código Rápidos

### Backend - Controller Pattern
```typescript
export class UserController {
  constructor(private userService: UserService) {}

  getUser = asyncHandler(async (req, res) => {
    const user = await this.userService.getUserById(req.params.id);
    res.json(user);
  });
}
```

### Frontend - Hook Personalizado
```typescript
export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData).catch(setError);
  }, [url]);

  return { data, loading, error };
}
```

### React Component
```typescript
export function MyComponent() {
  const { data, loading, error } = useApi<User>('/api/user');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.name}</div>;
}
```

---

## Estrutura de Pastas Rápida

```
backend/
├── src/
│   ├── controllers/    → Camada HTTP
│   ├── services/       → Lógica de negócios
│   ├── repositories/   → Acesso a dados
│   ├── middleware/     → Middlewares
│   ├── types/          → Tipos TypeScript
│   └── config/         → Configuração
├── tests/              → Testes unitários
└── e2e/                → Testes e2e

frontend/
├── src/
│   ├── components/     → Componentes React
│   ├── pages/          → Páginas Next.js
│   ├── hooks/          → Custom hooks
│   ├── services/       → API calls
│   ├── types/          → TypeScript types
│   └── styles/         → Tailwind/CSS
├── cypress/            → Testes E2E
└── public/             → Assets estáticos
```

---

## Commits Rápidos

```bash
# Tipos de commit
git commit -m "feat: nova funcionalidade"
git commit -m "fix: corrigir bug"
git commit -m "docs: atualizar documentação"
git commit -m "style: ajustar formatação"
git commit -m "refactor: reorganizar código"
git commit -m "test: adicionar testes"
git commit -m "chore: atualizar dependências"
```

---

## Variáveis de Ambiente Essenciais

### Backend
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=seu-segredo-aqui
REDIS_URL=redis://localhost:6379
```

### Frontend
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=VAMMOS
```

---

## Debugging Rápido

### Backend
```bash
# Debug com Node
node --inspect-brk dist/index.js

# Verificar logs
tail -f logs/combined.log

# Conexão com BD
psql -h localhost -U user -d database
```

### Frontend
```bash
# Chrome DevTools (F12)
# Source Maps habilitado em dev

# Debugar API calls
console.log('request:', request);
console.log('response:', await response.json());
```

---

## Resolvendo Problemas Comuns

### Port já em uso
```bash
# Encontrar e matar processo
lsof -i :3001
kill -9 <PID>
```

### Dependências quebradas
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Migrações falhadas
```bash
# Rollback e executar novamente
npm run migrate:rollback
npm run migrate
```

### Docker com espaço em disco
```bash
# Limpar imagens não utilizadas
docker system prune
docker volume prune
```

---

## Checklist Rápido para PR

- [ ] Branch atualizado com `main/develop`
- [ ] Testes passando localmente
- [ ] Linting sem erros (`npm run lint`)
- [ ] Testes coverage ok
- [ ] Documentação atualizada
- [ ] Commits com mensagens claras
- [ ] Sem console.log() em produção
- [ ] Vars de ambiente documentadas

---

## Links Úteis

- **Documentação Completa:** [GUIA_BOAS_PRATICAS_COMPLETO.md](GUIA_BOAS_PRATICAS_COMPLETO.md)
- **Setup:** [Setup.md](docs/SETUP.md)
- **API:** [API.md](docs/API.md)
- **Deployment:** [DEPLOYMENT.md](backend/DEPLOY.md)

---

## Contato

Dúvidas? Criar uma issue ou consultar a documentação completa.
