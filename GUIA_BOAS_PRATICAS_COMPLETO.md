# 📋 Guia Completo de Boas Práticas - Passo a Passo

**Data:** Fevereiro de 2026  
**Status:** Documento Vivo - Atualizar Conforme Necessário

---

## 📑 Índice
1. [Configuração Inicial do Projeto](#1-configuração-inicial-do-projeto)
2. [Estrutura de Pastas](#2-estrutura-de-pastas)
3. [Backend - Node.js/TypeScript](#3-backend--nodejstypescript)
4. [Frontend - Next.js/React](#4-frontend--nextjsreact)
5. [Banco de Dados](#5-banco-de-dados)
6. [Testes Automatizados](#6-testes-automatizados)
7. [Docker & Containerização](#7-docker--containerização)
8. [Deployment & CI/CD](#8-deployment--cicd)
9. [Git & Versionamento](#9-git--versionamento)
10. [Segurança](#10-segurança)
11. [Performance & Otimização](#11-performance--otimização)
12. [Variáveis de Ambiente](#12-variáveis-de-ambiente)
13. [Monitoramento & Logs](#13-monitoramento--logs)
14. [Documentação](#14-documentação)

---

## 1. Configuração Inicial do Projeto

### 1.1 Pré-requisitos
- [ ] Node.js 18.x ou superior
- [ ] npm ou yarn (versão compatível)
- [ ] Docker e Docker Compose instalados
- [ ] PostgreSQL/Supabase configurado
- [ ] Git configurado com SSH keys

### 1.2 Instalação Inicial
```bash
# 1. Clone o repositório
git clone <repo-url>
cd vammos

# 2. Instale dependências do projeto raiz
npm install

# 3. Instale dependências do backend
cd backend
npm install

# 4. Instale dependências do frontend
cd ../frontend
npm install

# 5. Retorne ao diretório raiz
cd ..
```

### 1.3 Configuração de Variáveis de Ambiente
```bash
# 1. Crie arquivo .env.local na raiz
cp .env.example .env.local

# 2. Crie arquivo .env no backend
cp backend/.env.example backend/.env

# 3. Crie arquivo .env.local no frontend
cp frontend/.env.example frontend/.env.local

# 4. Configure valores específicos para seu ambiente
# - Credenciais de banco de dados
# - Chaves de API
# - URLs de endpoints
```

### 1.4 Inicialização do Banco de Dados
```bash
# 1. Execute arquivos SQL iniciais
npm run db:setup

# 2. Execute migrações
npm run migrate

# 3. Popule dados de seed (desenvolvimento)
npm run seed
```

### 1.5 Inicie Aplicação Localmente
```bash
# Opção 1: Usando Docker Compose
docker-compose -f docker-compose.dev.yml up

# Opção 2: Modo desenvolvimento (sem Docker)
npm run dev
```

---

## 2. Estrutura de Pastas

### 2.1 Estrutura Recomendada do Backend
```
backend/
├── src/
│   ├── controllers/        # Camada de controle
│   ├── services/          # Lógica de negócios
│   ├── models/            # Modelos de dados
│   ├── repositories/      # Acesso a dados
│   ├── middleware/        # Middlewares Express
│   ├── utils/             # Funções utilitárias
│   ├── validators/        # Validação de entrada
│   ├── config/            # Configurações
│   ├── types/             # Tipos TypeScript
│   └── index.ts           # Entrada principal
├── migrations/            # Migrações do banco
├── tests/                 # Testes unitários
├── e2e/                   # Testes e2e
├── scripts/               # Scripts Bash
└── package.json
```

### 2.2 Estrutura Recomendada do Frontend
```
frontend/
├── src/
│   ├── components/        # Componentes React
│   │   ├── common/       # Componentes reutilizáveis
│   │   ├── layout/       # Layout components
│   │   ├── pages/        # Page components
│   │   └── forms/        # Form components
│   ├── pages/            # Rotas Next.js
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilitários e helpers
│   ├── services/         # API calls
│   ├── store/            # State management
│   ├── types/            # TypeScript types
│   ├── styles/           # CSS/Tailwind
│   ├── constants/        # Constantes
│   └── __tests__/        # Testes
├── public/               # Assets estáticos
└── package.json
```

### 2.3 Nomenclatura de Arquivos
- **Componentes React:** PascalCase (`UserProfile.tsx`)
- **Funções/Utilities:** camelCase (`getUserData.ts`)
- **Tipos/Interfaces:** PascalCase (`IUser.ts`)
- **Constantes:** SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Testes:** `*.test.ts` ou `*.spec.ts`

---

## 3. Backend - Node.js/TypeScript

### 3.1 Padrão de Código

#### 3.1.1 Estrutura de Controllers
```typescript
// src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { asyncHandler } from '../utils/asyncHandler';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Métodos do controller
  getUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  });
}
```

#### 3.1.2 Estrutura de Services
```typescript
// src/services/UserService.ts
import { UserRepository } from '../repositories/UserRepository';
import { IUser } from '../types/IUser';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    // Lógica de negócio aqui
    return await this.userRepository.create(data);
  }
}
```

#### 3.1.3 Estrutura de Repositories
```typescript
// src/repositories/UserRepository.ts
import { db } from '../config/database';
import { IUser } from '../types/IUser';

export class UserRepository {
  async findById(id: string): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
    const result = await db.query(query, [data.name, data.email]);
    return result.rows[0];
  }
}
```

### 3.2 Boas Práticas Backend

#### 3.2.1 Validação de Entrada
```typescript
// src/validators/userValidator.ts
import { body, validationResult } from 'express-validator';

export const validateCreateUser = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 8 }).withMessage('Senha deve ter ao menos 8 caracteres'),
];

// Middleware para validação
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
```

#### 3.2.2 Tratamento de Erros
```typescript
// src/utils/asyncHandler.ts
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// src/middleware/errorHandler.ts
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  
  const statusCode = (err as any).statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Erro interno do servidor' 
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
```

#### 3.2.3 Logging
```typescript
// src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

### 3.3 Configuração do ESLint
```javascript
// backend/eslint.config.js
export default [
  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: '@typescript-eslint/parser',
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-types': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
```

### 3.4 TypeScript Configuração
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 4. Frontend - Next.js/React

### 4.1 Padrão de Componentes

#### 4.1.1 Componente com Hooks
```typescript
// src/components/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { IUser } from '@/types/IUser';
import { userService } from '@/services/userService';

interface UserProfileProps {
  userId: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserById(userId);
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-600">Erro: {error}</div>;
  if (!user) return <div className="p-4">Usuário não encontrado</div>;

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-2xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
};
```

#### 4.1.2 Custom Hook
```typescript
// src/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions {
  skip?: boolean;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  url: string,
  options?: UseApiOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options?.skip);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (options?.skip) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        options?.onError?.(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options?.skip]);

  return { data, loading, error };
}
```

### 4.2 Estrutura de Páginas Next.js
```typescript
// src/pages/users/[id].tsx
import { GetServerSideProps } from 'next';
import { UserProfile } from '@/components/UserProfile';
import { IUser } from '@/types/IUser';

interface UserPageProps {
  user: IUser;
}

export default function UserPage({ user }: UserPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile userId={user.id} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
    if (!response.ok) return { notFound: true };
    const user = await response.json();

    return {
      props: { user },
      revalidate: 60, // ISR: revalidate a cada 60s
    };
  } catch (error) {
    return { notFound: true };
  }
};
```

### 4.3 Boas Práticas Frontend

#### 4.3.1 Gerenciamento de Estado com Context API
```typescript
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);

  const login = async (credentials: any) => {
    // Implementar login
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
```

#### 4.3.2 Variáveis de Ambiente
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=VAMMOS
NEXT_PUBLIC_SUPPORT_EMAIL=support@vammos.com

# Não colocar secrets aqui!
```

#### 4.3.3 Otimização de Imagens
```typescript
// src/components/OptimizedImage.tsx
import Image from 'next/image';

export function OptimizedImage({ src, alt, ...props }: any) {
  return (
    <Image
      src={src}
      alt={alt}
      loading="lazy"
      quality={75}
      {...props}
    />
  );
}
```

### 4.4 Tailwind CSS Configuração
```javascript
// frontend/tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
      },
    },
  },
  plugins: [],
};
```

---

## 5. Banco de Dados

### 5.1 Organização de Migrations
```bash
migrations/
├── 001_create_users_table.sql
├── 002_create_posts_table.sql
├── 003_add_index_users_email.sql
└── 004_add_foreign_key_posts.sql
```

### 5.1.1 Exemplo de Migration
```sql
-- migrations/001_create_users_table.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 5.2 Script de Migration
```bash
#!/bin/bash
# run-migrations.sh

set -e

DB_URL="${DATABASE_URL}"

echo "🚀 Iniciando migrações..."

for migration in migrations/*.sql; do
  echo "📝 Executando: $migration"
  psql "$DB_URL" -f "$migration"
done

echo "✅ Migrações concluídas com sucesso!"
```

### 5.3 Boas Práticas de Banco de Dados

#### 5.3.1 Índices
```sql
-- Adicionar índices em colunas frequentemente consultadas
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

#### 5.3.2 Constraints
```sql
-- Usar foreign keys para integridade referencial
ALTER TABLE posts
  ADD CONSTRAINT fk_posts_user_id
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

#### 5.3.3 Soft Deletes
```sql
-- Adicionar coluna deleted_at para soft deletes
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP NULL;

-- Sempre filtrar em queries
SELECT * FROM users WHERE deleted_at IS NULL;
```

---

## 6. Testes Automatizados

### 6.1 Testes Unitários - Jest (Backend)

#### 6.1.1 Estrutura de Teste
```typescript
// backend/tests/services/UserService.test.ts
import { UserService } from '../../src/services/UserService';
import { UserRepository } from '../../src/repositories/UserRepository';

jest.mock('../../src/repositories/UserRepository');

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService();
  });

  describe('getUserById', () => {
    it('deve retornar um usuário existente', async () => {
      const mockUser = { id: '1', name: 'John', email: 'john@test.com' };
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById('1');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('deve retornar null quando usuário não existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await userService.getUserById('999');

      expect(result).toBeNull();
    });
  });
});
```

### 6.2 Testes de Integração (Backend)
```typescript
// backend/tests/integration/users.integration.test.ts
import request from 'supertest';
import app from '../../src/index';
import { db } from '../../src/config/database';

describe('Users API Integration', () => {
  beforeEach(async () => {
    // Setup banco de testes
    await db.query('DELETE FROM users');
  });

  describe('POST /api/users', () => {
    it('deve criar um novo usuário', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          name: 'John Doe',
          email: 'john@test.com',
          password: 'SecurePassword123!',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('john@test.com');
    });

    it('deve rejeitar email duplicado', async () => {
      await request(app)
        .post('/api/users')
        .send({
          name: 'John Doe',
          email: 'john@test.com',
          password: 'SecurePassword123!',
        });

      const response = await request(app)
        .post('/api/users')
        .send({
          name: 'Jane Doe',
          email: 'john@test.com',
          password: 'SecurePassword123!',
        });

      expect(response.status).toBe(400);
    });
  });
});
```

### 6.3 Testes de Componentes - React Testing Library (Frontend)
```typescript
// frontend/src/components/__tests__/UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from '../UserProfile';
import * as userService from '../../services/userService';

jest.mock('../../services/userService');

describe('UserProfile Component', () => {
  it('deve exibir dados do usuário', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@test.com' };
    (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@test.com')).toBeInTheDocument();
    });
  });

  it('deve exibir erro quando serviço falha', async () => {
    (userService.getUserById as jest.Mock).mockRejectedValue(
      new Error('API Error')
    );

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText(/Erro:/)).toBeInTheDocument();
    });
  });
});
```

### 6.4 Testes E2E - Cypress/Playwright

#### 6.4.1 Teste Cypress
```typescript
// frontend/cypress/e2e/user-profile.cy.ts
describe('User Profile Page', () => {
  beforeEach(() => {
    cy.visit('/users/1');
  });

  it('deve carregar e exibir perfil do usuário', () => {
    cy.get('[data-testid="user-name"]').should('be.visible');
    cy.get('[data-testid="user-email"]').should('contain', '@');
  });

  it('deve permitir edição do perfil', () => {
    cy.get('[data-testid="edit-button"]').click();
    cy.get('[data-testid="name-input"]').clear().type('New Name');
    cy.get('[data-testid="save-button"]').click();
    
    cy.get('[data-testid="user-name"]').should('contain', 'New Name');
  });
});
```

#### 6.4.2 Teste Playwright
```typescript
// frontend/e2e/user-profile.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Profile', () => {
  test('deve exibir informações do usuário', async ({ page }) => {
    await page.goto('/users/1');
    
    const userName = await page.textContent('[data-testid="user-name"]');
    expect(userName).toBeTruthy();
    
    const userEmail = await page.locator('[data-testid="user-email"]');
    await expect(userEmail).toContainText('@');
  });

  test('deve permitir logout', async ({ page }) => {
    await page.goto('/users/1');
    
    await page.click('[data-testid="logout-button"]');
    
    await expect(page).toHaveURL('/login');
  });
});
```

### 6.5 Configuração Jest
```javascript
// jest.config.js (Backend)
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### 6.6 Executando Testes
```bash
# Backend - Testes unitários
npm run test

# Backend - Testes com coverage
npm run test:coverage

# Backend - Testes de integração
npm run test:integration

# Frontend - Testes unitários
cd frontend && npm run test

# Frontend - Testes E2E com Cypress
npm run cypress:open

# Frontend - Testes E2E com Playwright
npm run playwright:test
```

---

## 7. Docker & Containerização

### 7.1 Dockerfile Backend
```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Instalar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production

# Copiar código compilado do builder
COPY --from=builder /app/dist ./dist

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

### 7.2 Dockerfile Frontend
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build Next.js
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

CMD ["npm", "start"]
```

### 7.3 Docker Compose Desenvolvimento
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: vammos-postgres-dev
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data_dev:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: vammos-backend-dev
    environment:
      NODE_ENV: development
      DATABASE_URL: ${DATABASE_URL}
      PORT: 3001
    ports:
      - "3001:3001"
    volumes:
      - ./backend/src:/app/src
    depends_on:
      postgres:
        condition: service_healthy
    command: npm run dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: vammos-frontend-dev
    environment:
      NODE_ENV: development
      NEXT_PUBLIC_API_URL: http://localhost:3001
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
    depends_on:
      - backend
    command: npm run dev

volumes:
  postgres_data_dev:
```

### 7.4 Docker Compose Produção
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    image: ${REGISTRY}/vammos-backend:${VERSION}
    container_name: vammos-backend
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      PORT: 3001
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: ${REGISTRY}/vammos-frontend:${VERSION}
    container_name: vammos-frontend
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: ${API_URL}
    restart: always
    ports:
      - "80:3000"
```

---

## 8. Deployment & CI/CD

### 8.1 GitHub Actions - CI/CD Pipeline
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: ./backend
        run: npm ci

      - name: Lint
        working-directory: ./backend
        run: npm run lint

      - name: Run tests
        working-directory: ./backend
        run: npm run test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info

  test-frontend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Lint
        working-directory: ./frontend
        run: npm run lint

      - name: Build
        working-directory: ./frontend
        run: npm run build

      - name: Test
        working-directory: ./frontend
        run: npm run test

  build-and-push:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.REGISTRY_URL }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}

      - name: Build and push backend
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          push: true
          tags: ${{ secrets.REGISTRY_URL }}/vammos-backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push frontend
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          push: true
          tags: ${{ secrets.REGISTRY_URL }}/vammos-frontend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to production
        run: |
          echo "Deploying version ${{ github.sha }}"
          # Adicionar comandos de deploy aqui
```

### 8.2 Boas Práticas de Deployment

#### 8.2.1 Checklist de Pre-Deploy
- [ ] Todos os testes passando
- [ ] Coverage de testes acima de 70%
- [ ] Linting sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações de BD testadas
- [ ] Backups do BD criados
- [ ] Plano de rollback preparado
- [ ] Documentação atualizada

#### 8.2.2 Versioning
```bash
# Usar semantic versioning
npm version patch     # 1.0.0 -> 1.0.1 (bug fixes)
npm version minor     # 1.0.1 -> 1.1.0 (новые features)
npm version major     # 1.1.0 -> 2.0.0 (breaking changes)
```

---

## 9. Git & Versionamento

### 9.1 Configuração de Git
```bash
# Configurar identidade global
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"

# Usar SSH em vez de HTTPS
git config --global url."git@github.com:".insteadOf "https://github.com/"
```

### 9.2 Estratégia de Branching (Git Flow)
```
main (production)
  ↑
release/1.0.0
  ↑
develop (staging)
  ↑
feature/user-authentication
hotfix/critical-bug-fix
```

### 9.3 Convenção de Commits
```bash
# Formato: <tipo>(<escopo>): <descrição>
# Tipos: feat, fix, docs, style, refactor, test, chore, ci

git commit -m "feat(auth): implementar autenticação OAuth"
git commit -m "fix(api): corrigir validação de email"
git commit -m "docs(readme): adicionar instruções de setup"
git commit -m "refactor(user-service): simplificar lógica de criação"
```

### 9.4 Workflow de Pull Request
```bash
# 1. Criar branch feature
git checkout -b feature/nova-funcionalidade

# 2. Fazer commits
git add .
git commit -m "feat: adicionar nova funcionalidade"

# 3. Fazer push
git push origin feature/nova-funcionalidade

# 4. Abrir PR na plataforma
# - Adicionar descrição clara
# - Linkar issues relacionados
# - Solicitar revisor(es)

# 5. Após aprovação, fazer merge
git checkout develop
git pull origin develop
git merge --no-ff feature/nova-funcionalidade
git push origin develop

# 6. Deletar branch local
git branch -d feature/nova-funcionalidade
```

### 9.5 .gitignore Essencial
```
# Node
node_modules/
npm-debug.log
yarn-error.log

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
.next/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Coverage
coverage/
.nyc_output/

# Database
*.sqlite
*.sqlite3
```

---

## 10. Segurança

### 10.1 Autenticação e Autorização

#### 10.1.1 Implementar JWT
```typescript
// src/services/AuthService.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(userId: string, expiresIn: string = '24h'): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn }
    );
  }

  verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }
}
```

#### 10.1.2 Middleware de Autenticação
```typescript
// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = new AuthService().verifyToken(token);
    (req as any).userId = (decoded as any).userId;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
```

### 10.2 Proteção contra Vulnerabilidades Comuns

#### 10.2.1 SQL Injection
```typescript
// ✅ BOM - Usar parameterized queries
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [userEmail]);

// ❌ RUIM - Concatenar strings
const badQuery = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

#### 10.2.2 XSS (Cross-Site Scripting)
```typescript
// ✅ BOM - Sanitizar HTML
import DOMPurify from 'dompurify';

const cleanHtml = DOMPurify.sanitize(userInput);

// Frontend - React automaticamente escapa conteúdo
<div>{userInput}</div> {/* Safe */}

// ❌ RUIM - Usar dangerouslySetInnerHTML sem sanitização
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

#### 10.2.3 CSRF (Cross-Site Request Forgery)
```typescript
// Implementar CSRF tokens
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: false });

app.post('/api/update', csrfProtection, (req, res) => {
  // Token já foi validado
  res.json({ success: true });
});
```

### 10.3 Variáveis de Ambiente Sensíveis
```bash
# Nunca adicionar ao git
.env
.env.local
.env.production.local

# Variáveis críticas
JWT_SECRET=sua-chave-super-segura
DATABASE_PASSWORD=senha-complexa
API_KEY=chave-da-api
```

### 10.4 HTTPS e Certificados
```bash
# Em produção, sempre usar HTTPS
# Usar certificados Let's Encrypt (gratuitos)
# Configurar redirecionamento HTTP -> HTTPS
```

### 10.5 Headers de Segurança
```typescript
// src/middleware/securityHeaders.ts
import helmet from 'helmet';

app.use(helmet());

// Configurar CSP (Content Security Policy)
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
  },
}));
```

### 10.6 Rate Limiting
```typescript
// src/middleware/rateLimitMiddleware.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requests por janela
  message: 'Muitas requisições do seu IP, tente mais tarde',
});

app.use('/api/', limiter);
```

---

## 11. Performance & Otimização

### 11.1 Backend Performance

#### 11.1.1 Caching com Redis
```typescript
// src/services/UserService.ts
import { redis } from '../config/redis';

export class UserService {
  async getUserById(id: string) {
    // Verificar cache
    const cached = await redis.get(`user:${id}`);
    if (cached) return JSON.parse(cached);

    // Buscar do banco
    const user = await this.userRepository.findById(id);

    // Armazenar em cache
    if (user) {
      await redis.setex(`user:${id}`, 3600, JSON.stringify(user));
    }

    return user;
  }
}
```

#### 11.1.2 Paginação
```typescript
// src/repositories/UserRepository.ts
interface PaginationOptions {
  page: number;
  limit: number;
}

async getPaginated(options: PaginationOptions) {
  const offset = (options.page - 1) * options.limit;
  
  const query = `
    SELECT * FROM users
    WHERE deleted_at IS NULL
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;
  
  return await db.query(query, [options.limit, offset]);
}
```

#### 11.1.3 Database Indexes
```sql
-- Criar índices para colunas frequentemente consultadas
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- Índice composto para queries com múltiplas colunas
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);
```

### 11.2 Frontend Performance

#### 11.2.1 Code Splitting
```typescript
// src/pages/admin/dashboard.tsx
import dynamic from 'next/dynamic';

const AnalyticsChart = dynamic(
  () => import('@/components/AnalyticsChart'),
  { loading: () => <LoadingSpinner /> }
);

export default function Dashboard() {
  return (
    <div>
      <AnalyticsChart />
    </div>
  );
}
```

#### 11.2.2 Image Optimization
```typescript
// src/components/OptimizedImage.tsx
import Image from 'next/image';

export function UserAvatar({ src, userId }: any) {
  return (
    <Image
      src={src}
      alt={`Avatar de usuário ${userId}`}
      width={40}
      height={40}
      quality={75}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/png;base64,..." // low quality image
    />
  );
}
```

#### 11.2.3 Web Vitals Monitoring
```typescript
// src/pages/_app.tsx
import { useReportWebVitals } from 'next/web-vitals';

export default function App({ Component, pageProps }: any) {
  useReportWebVitals((metric) => {
    // Enviar para serviço de analytics
    console.log(metric);
  });

  return <Component {...pageProps} />;
}
```

### 11.3 Query Optimization
```typescript
// ✅ BOM - Selecionar apenas colunas necessárias
const query = 'SELECT id, name, email FROM users WHERE id = $1';

// ❌ RUIM - Selecionar todas as colunas
const badQuery = 'SELECT * FROM users WHERE id = $1';
```

---

## 12. Variáveis de Ambiente

### 12.1 Estrutura de .env
```bash
# .env (raiz)
COMPOSE_PROJECT_NAME=vammos
COMPOSE_FILE=docker-compose.dev.yml

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=vammos_user
DB_PASSWORD=secure_password_here
DB_NAME=vammos_db
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
```

### 12.2 Estrutura de .env do Backend
```bash
# backend/.env
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://...
DB_SSL=false

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h

# Redis
REDIS_URL=redis://localhost:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Logging
LOG_LEVEL=debug
```

### 12.3 Estrutura de .env do Frontend
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=VAMMOS
NEXT_PUBLIC_SUPPORT_EMAIL=support@vammos.com
NEXT_PUBLIC_ANALYTICS_ID=UA-...

# Não incluir secrets aqui!
```

### 12.4 Validação de Variáveis de Ambiente
```typescript
// src/config/env.ts
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
};

// Validar na startup
Object.entries(env).forEach(([key, value]) => {
  if (!value && key !== 'NODE_ENV') {
    throw new Error(`Missing environment variable: ${key}`);
  }
});
```

---

## 13. Monitoramento & Logs

### 13.1 Configuração de Logs com Winston
```typescript
// src/config/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'vammos-backend' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

### 13.2 Middleware de Request Logging
```typescript
// src/middleware/requestLogger.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    logger.info({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: (req as any).userId,
    });
  });

  next();
};
```

### 13.3 Health Check Endpoint
```typescript
// src/routes/healthRoutes.ts
import { Router, Request, Response } from 'express';
import { db } from '../config/database';

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
  try {
    // Verificar conexão com banco
    await db.query('SELECT 1');

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Database connection failed',
    });
  }
});

export default router;
```

### 13.4 Monitoramento de Performance
```typescript
// src/middleware/performanceMonitor.ts
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const startTime = performance.now();
  const startMem = process.memoryUsage();

  res.on('finish', () => {
    const duration = performance.now() - startTime;
    const endMem = process.memoryUsage();

    if (duration > 1000) { // Log se > 1 segundo
      logger.warn({
        message: 'Slow request detected',
        path: req.path,
        duration: `${duration.toFixed(2)}ms`,
        memory: {
          heapUsed: `${((endMem.heapUsed - startMem.heapUsed) / 1024 / 1024).toFixed(2)}MB`,
        },
      });
    }
  });

  next();
};
```

---

## 14. Documentação

### 14.1 Estrutura de Documentação
```
docs/
├── API.md              # Documentação da API
├── SETUP.md            # Instruções de setup
├── ARCHITECTURE.md     # Arquitetura do projeto
├── DATABASE.md         # Schema e migrações
├── DEPLOYMENT.md       # Guia de deployment
├── CONTRIBUTING.md     # Guia de contribuição
├── TESTING.md          # Estratégia de testes
└── TROUBLESHOOTING.md  # Resolução de problemas
```

### 14.2 README.md Essencial
```markdown
# VAMMOS - Sistema Completo

## 📋 Descrição
Breve descrição do projeto...

## 🚀 Quick Start
Instruções para começar rapidamente

## 📁 Estrutura
Explicação da estrutura de pastas

## 🔧 Setup
Passo a passo de instalação

## 📚 Documentação
Links para documentação completa

## 🧪 Testes
Como executar testes

## 🐳 Docker
Como usar Docker

## 📝 Commits
Convenção de commits

## 📄 Licença
```

### 14.3 Documentação da API com Swagger
```typescript
// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VAMMOS API',
      version: '1.0.0',
      description: 'API documentation for VAMMOS',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001',
        description: 'Server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
```

### 14.4 Documentar Rotas
```typescript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar usuários
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', getUsersController);
```

---

## ✅ Checklist de Implementação

### Pré-Deployment
- [ ] Todos os testes passando (backend e frontend)
- [ ] Coverage de testes acima de 70%
- [ ] Linting sem erros
- [ ] Documentação atualizada
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações de BD executadas em staging
- [ ] Backup do BD criado
- [ ] Segurança validada
- [ ] Performance otimizada
- [ ] Logs configurados

### Pós-Deployment
- [ ] Verificar health check
- [ ] Monitorar logs
- [ ] Testar fluxos principais
- [ ] Comunicar com stakeholders
- [ ] Preparar plano de rollback

---

## 📞 Contato & Suporte

Para dúvidas ou problemas:
- Criar issue no repositório
- Consultar documentação
- Contatar time de desenvolvimento

**Última atualização:** Fevereiro de 2026
