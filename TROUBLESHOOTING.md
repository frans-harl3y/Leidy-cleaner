# 🔧 Troubleshooting - Vammos Platform

## Problemas Comuns e Soluções

### 1. Testes do Backend Não Rodam
**Sintoma**: `Jest: a transform must export a process function`
**Causa**: Dependências corrompidas pelo `npm audit fix --force`
**Solução**:
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm test
```

### 2. Erro de Conexão com Banco
**Sintoma**: `Error: connect ECONNREFUSED 127.0.0.1:5432`
**Solução**:
```bash
# Iniciar PostgreSQL
docker-compose -f docker-compose.dev.yml up db -d

# Ou usar o script de teste
docker-compose -f docker-compose.test.yml up -d
```

### 3. Emails Não São Enviados
**Sintoma**: Emails aparecem apenas no console
**Causa**: Variáveis SMTP não configuradas
**Solução**:
```bash
# Editar backend/.env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
```

### 4. Frontend Não Conecta com Backend
**Sintoma**: Erro 500 nas requisições API
**Solução**:
```bash
# Verificar se backend está rodando
curl http://localhost:3001/health

# Verificar NEXT_PUBLIC_API_URL no frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Docker Compose Falha
**Sintoma**: `ERROR: Couldn't connect to Docker daemon`
**Solução**:
```bash
# Iniciar Docker service
sudo systemctl start docker

# Ou no macOS/Windows: abrir Docker Desktop
```

### 6. Porta 80 Já Está em Uso
**Sintoma**: `Port already in use`
**Solução**:
```bash
# Verificar quem está usando a porta
sudo lsof -i :80

# Matar processo ou mudar porta no docker-compose.dev.yml
```

### 7. Migrations Não Executam
**Sintoma**: Tabelas não existem no banco
**Solução**:
```bash
cd backend
npm run migrate
npm run seed
```

## 🐛 Debug Commands

```bash
# Ver logs dos containers
docker-compose -f docker-compose.dev.yml logs -f

# Ver status dos containers
docker-compose -f docker-compose.dev.yml ps

# Reiniciar serviço específico
docker-compose -f docker-compose.dev.yml restart backend

# Limpar containers parados
docker system prune
```

## 📞 Logs Importantes

```bash
# Backend logs
docker-compose -f docker-compose.dev.yml logs backend

# Database logs
docker-compose -f docker-compose.dev.yml logs db

# Nginx access logs
docker-compose -f docker-compose.dev.yml exec nginx tail -f /var/log/nginx/access.log
```

## 🔄 Reset Completo

Se tudo estiver quebrado:

```bash
# Parar tudo
docker-compose -f docker-compose.dev.yml down -v

# Limpar dados
rm -rf backend/postgres_data
rm -rf */node_modules

# Recomeçar
./validate-setup.sh
docker-compose -f docker-compose.dev.yml up -d
```