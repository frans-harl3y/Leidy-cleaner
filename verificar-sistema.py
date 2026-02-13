#!/usr/bin/env python3
"""
Script de verificação rápida - O sistema roda normalmente?
"""

import subprocess
import time
import json
import sys
import os
from pathlib import Path

def run_cmd(cmd, timeout=5):
    """Executa comando e retorna resultado"""
    try:
        result = subprocess.run(
            cmd, 
            shell=True,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd="/workspaces/chega"
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return -1, "", "Timeout"
    except Exception as e:
        return -1, "", str(e)

print("🔍 VERIFICAÇÃO RÁPIDA - O SISTEMA RODA NORMALMENTE?\n")
print("=" * 60)

# 1. Verificar Docker
print("\n1️⃣  Docker & Docker Compose")
code, out, err = run_cmd("docker --version")
if code == 0:
    print(f"   ✅ Docker: OK")
else:
    print(f"   ❌ Docker: ERRO")
    sys.exit(1)

code, out, err = run_cmd("docker-compose --version")
if code == 0:
    print(f"   ✅ Docker Compose: OK")
else:
    print(f"   ❌ Docker Compose: ERRO")

# 2. Verificar arquivos críticos
print("\n2️⃣  Arquivos Críticos")
files_check = [
    ("/workspaces/chega/docker-compose.yml", "docker-compose.yml"),
    ("/workspaces/chega/backend/package.json", "backend/package.json"),
    ("/workspaces/chega/frontend/package.json", "frontend/package.json"),
    ("/workspaces/chega/.env", ".env"),
    ("/workspaces/chega/backend/backend_data/database.sqlite", "database.sqlite"),
]

for filepath, name in files_check:
    if Path(filepath).exists():
        print(f"   ✅ {name}")
    else:
        print(f"   ❌ {name} - NÃO ENCONTRADO")

# 3. Verificar se há containers rodando
print("\n3️⃣  Status dos Containers")
code, out, err = run_cmd("docker ps -q")
containers = out.strip().split('\n') if out.strip() else []
running_count = len([c for c in containers if c])

if running_count > 0:
    print(f"   ✅ {running_count} container(s) rodando")
else:
    print(f"   ⚠️  Nenhum container rodando (você precisa fazer docker-compose up -d)")

# 4. Listar serviços do docker-compose
print("\n4️⃣  Serviços Definidos no docker-compose.yml")
code, out, err = run_cmd("docker-compose config --services", timeout=10)
if code == 0:
    services = out.strip().split('\n')
    for service in services:
        if service:
            print(f"   ✅ {service}")
else:
    print(f"   ❌ Erro ao ler docker-compose.yml")

# 5. Verificar portas
print("\n5️⃣  Portas Esperadas")
ports_check = [
    ("3001", "Backend"),
    ("3000", "Frontend"),
    ("6379", "Redis"),
    ("5432", "PostgreSQL"),
]

for port, name in ports_check:
    code, out, err = run_cmd(f"netstat -tuln 2>/dev/null | grep :{port} || echo 'closed'")
    if "closed" not in out.lower() and port in out:
        print(f"   ✅ Porta {port} ({name}): ABERTA")
    else:
        print(f"   ⏳ Porta {port} ({name}): fechada")

# 6. Backend health check
print("\n6️⃣  Health Check - Backend")
code, out, err = run_cmd("curl -s http://localhost:3001/api/health 2>/dev/null || echo 'down'", timeout=3)
if code == 0 and "down" not in out.lower():
    print(f"   ✅ Backend respondendo: {out[:100]}")
else:
    print(f"   ⏳ Backend não está respondendo (pode ainda estar iniciando)")

# 7. Frontend check
print("\n7️⃣  Frontend")
code, out, err = run_cmd("curl -s http://localhost:3000 2>/dev/null | head -c 100 || echo 'down'", timeout=3)
if code == 0 and "down" not in out.lower():
    print(f"   ✅ Frontend respondendo")
else:
    print(f"   ⏳ Frontend não está respondendo")

# 8. Verificar node_modules
print("\n8️⃣  Dependências NPM")
backend_nm = Path("/workspaces/chega/backend/node_modules").exists()
frontend_nm = Path("/workspaces/chega/frontend/node_modules").exists()

if backend_nm:
    print(f"   ✅ Backend node_modules")
else:
    print(f"   ⚠️  Backend node_modules não encontrado (instalado via Docker)")

if frontend_nm:
    print(f"   ✅ Frontend node_modules")
else:
    print(f"   ⚠️  Frontend node_modules não encontrado (instalado via Docker)")

# 9. Git status
print("\n9️⃣  Repositório Git")
code, out, err = run_cmd("git status --short", timeout=5)
if code == 0:
    lines = len([l for l in out.split('\n') if l.strip()])
    if lines > 0:
        print(f"   ✅ Git: {lines} arquivo(s) modificado(s)")
    else:
        print(f"   ✅ Git: Limpo (sem modificações)")
else:
    print(f"   ❌ Git: Erro")

# 10. Resumo final
print("\n" + "=" * 60)
print("\n📋 RESUMO")
print("-" * 60)

if running_count > 0:
    print("\n✅ SISTEMA ESTÁ RODANDO!")
    print("\n  URLs de acesso:")
    print("  • Backend:  http://localhost:3001")
    print("  • Frontend: http://localhost:3000")
    print("\n  Credenciais de teste:")
    print("  • Email: admin@leidycleaner.com.br")
    print("  • Senha: AdminPassword123!@#")
else:
    print("\n⏳ SISTEMA NÃO ESTÁ RODANDO")
    print("\n  Para iniciar:")
    print("  $ cd /workspaces/chega")
    print("  $ docker-compose up -d")
    print("\n  Aguarde 2-3 minutos para o build e startup")
    print("  Depois execute este script novamente para verificar")

print("\n" + "=" * 60)
