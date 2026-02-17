# Testes de Integração - Vammos Backend

Este diretório contém testes de integração para a API do Vammos Backend.

## Estrutura

```
src/__tests__/
├── integration/
│   └── api.integration.test.ts      # Testes completos da API
└── routes/
    ├── auth.test.ts                 # Testes dos endpoints de autenticação
    └── services.test.ts             # Testes dos endpoints de serviços
```

## Testes Inclusos

### 1. Testes de Integração da API (`api.integration.test.ts`)

Testes end-to-end que validam:

- **Health Check**: Endpoint `/health` retorna status OK
- **Autenticação**:
  - Registro de novo usuário
  - Login com credenciais corretas
  - Obtenção de perfil do usuário (autenticado)
  - Atualização de perfil
  - Refresh de token de acesso
- **Serviços**:
  - Listagem de serviços (público)
  - Filtro por categoria
  - Busca por nome
  - Obtenção de categoria de serviços
  - Criação de serviço (apenas admin)
  - Atualização de serviço (apenas admin)
  - Deleção de serviço (apenas admin)
- **Tratamento de Erros**:
  - Token ausente retorna 401
  - Token inválido retorna 401
  - Campos obrigatórios faltando retorna 400
  - Email duplicado retorna 400
  - Credenciais inválidas retorna 400
- **Segurança**:
  - Headers CORS presentes
  - Headers de segurança presentes
  - Dados sensíveis não expostos em erros

### 2. Testes dos Endpoints de Autenticação (`routes/auth.test.ts`)

Testes unitários focados nos endpoints auth:

- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh-token` - Refresh token
- `GET /api/v1/auth/me` - Obter perfil
- `PUT /api/v1/auth/me` - Atualizar perfil

### 3. Testes dos Endpoints de Serviços (`routes/services.test.ts`)

Testes unitários focados nos endpoints de serviços:

- `GET /api/v1/services` - Listar serviços (com paginação)
- `GET /api/v1/services/:id` - Obter serviço específico
- `GET /api/v1/services/categories` - Obter categorias
- `POST /api/v1/services` - Criar serviço (admin only)
- `PUT /api/v1/services/:id` - Atualizar serviço (admin only)
- `DELETE /api/v1/services/:id` - Deletar serviço (admin only)

## Como Executar

### Todos os testes
```bash
npm test
```

### Testes específicos
```bash
# Apenas testes de integração
npm test -- api.integration.test

# Apenas testes de auth
npm test -- auth.test

# Apenas testes de services
npm test -- services.test
```

### Com cobertura
```bash
npm test -- --coverage
```

### Em modo watch
```bash
npm test -- --watch
```

## Configuração

### Necessário

1. **Banco de dados PostgreSQL** rodando
2. **Variáveis de environment** configuradas (veja `.env.example`)
3. **Migrations executadas** (rodar antes dos testes)

### Setup antes dos testes

```bash
# Instalar dependências
npm install

# Rodar migrations
npm run migrate

# Rodar seed (para dados iniciais)
npm run seed

# Executar testes
npm test
```

## Cobertura Esperada

- **Autenticação**: 95%+
- **Serviços**: 90%+
- **Middleware**: 85%+
- **Utils**: 80%+

## Observações Importantes

1. **Isolamento**: Cada test suite cria seus próprios usuários/dados
2. **Limpeza**: Testes não fazem cleanup automático (usar banco temporário em CI/CD)
3. **Timeout**: Testes têm timeout de 30 segundos (pode ser ajustado)
4. **Admin Role**: Testes assumem que primeiro usuário registrado pode ser promovido a admin

## Troubleshooting

### Erro: "Cannot connect to database"
```bash
# Verificar se PostgreSQL está rodando
psql -U postgres -d postgres

# Rodar migrations novamente
npm run migrate
```

### Erro: "Migrations not found"
```bash
# Verificar se diretório migrations existe
ls -la backend/migrations/

# Rodar seed
npm run seed
```

### Erro: "Timeout exceeded"
```bash
# Aumentar timeout no jest.config.js
testTimeout: 60000
```

## CI/CD Integration

Para usar em GitHub Actions:

```yaml
- name: Run Integration Tests
  run: npm test -- --testPathPattern=integration
  env:
    NODE_ENV: test
    DB_HOST: localhost
    DB_PORT: 5432
    DB_NAME: vammos_test
```

## Próximos Passos

- [ ] E2E tests com Playwright
- [ ] Performance tests com Artillery
- [ ] Security tests (OWASP)
- [ ] Load tests
