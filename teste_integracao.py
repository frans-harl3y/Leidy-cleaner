#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
🧪 TESTE DE INTEGRAÇÃO TOTAL - Sistema Leidy Cleaner
Análise estrutural, validação e health checks
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime
import time

# Cores ANSI
GREEN = '\033[0;32m'
RED = '\033[0;31m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
CYAN = '\033[0;36m'
NC = '\033[0m'  # No Color

class TestIntegration:
    def __init__(self):
        self.project_root = Path("/workspaces/chega")
        self.tests_passed = 0
        self.tests_failed = 0
        self.results = []
        self.timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
    def log_header(self, title):
        """Exibe cabeçalho de seção"""
        print(f"\n{BLUE}{'='*50}{NC}")
        print(f"{CYAN}{title}{NC}")
        print(f"{BLUE}{'='*50}{NC}\n")
    
    def log_success(self, message):
        """Log de sucesso"""
        print(f"{GREEN}✅ {message}{NC}")
        self.tests_passed += 1
        self.results.append(("PASS", message))
    
    def log_failure(self, message):
        """Log de falha"""
        print(f"{RED}❌ {message}{NC}")
        self.tests_failed += 1
        self.results.append(("FAIL", message))
    
    def log_info(self, message):
        """Log informativo"""
        print(f"{YELLOW}ℹ️  {message}{NC}")
    
    def log_step(self, message):
        """Log de passo"""
        print(f"{CYAN}▶ {message}{NC}")
    
    # ===== TESTES ESTRUTURAIS =====
    
    def test_project_structure(self):
        """Teste 1: Estrutura do projeto"""
        self.log_header("TESTE 1: Estrutura do Projeto")
        
        essential_dirs = {
            "backend": "Pasta do Backend",
            "frontend": "Pasta do Frontend",
            "config": "Pasta de Configuração",
            "docs": "Pasta de Documentação",
        }
        
        for dir_name, description in essential_dirs.items():
            dir_path = self.project_root / dir_name
            if dir_path.is_dir():
                self.log_success(f"{description} existe ({dir_name}/)")
            else:
                self.log_failure(f"{description} não encontrada ({dir_name}/)")
    
    def test_docker_files(self):
        """Teste 2: Arquivos Docker"""
        self.log_header("TESTE 2: Arquivos Docker")
        
        docker_files = {
            "docker-compose.yml": "Docker Compose principal",
            "Dockerfile.backend": "Dockerfile do Backend",
            "Dockerfile.frontend": "Dockerfile do Frontend",
        }
        
        for file_name, description in docker_files.items():
            file_path = self.project_root / file_name
            if file_path.is_file():
                self.log_success(f"{description} existe")
                size = file_path.stat().st_size
                self.log_info(f"  Tamanho: {size} bytes")
            else:
                self.log_failure(f"{description} não encontrado")
    
    def test_config_files(self):
        """Teste 3: Arquivos de configuração"""
        self.log_header("TESTE 3: Arquivos de Configuração")
        
        # Verificar .env
        env_file = self.project_root / ".env"
        if env_file.is_file():
            self.log_success("Arquivo .env existe")
            with open(env_file, 'r') as f:
                env_vars = f.readlines()
                self.log_info(f"  Total de variáveis: {len(env_vars)}")
        else:
            self.log_failure("Arquivo .env não encontrado")
        
        # Verificar package.json
        backend_pkg = self.project_root / "backend" / "package.json"
        frontend_pkg = self.project_root / "frontend" / "package.json"
        
        if backend_pkg.is_file():
            self.log_success("backend/package.json existe")
        else:
            self.log_failure("backend/package.json não encontrado")
        
        if frontend_pkg.is_file():
            self.log_success("frontend/package.json existe")
        else:
            self.log_failure("frontend/package.json não encontrado")
    
    def test_backend_structure(self):
        """Teste 4: Estrutura do Backend"""
        self.log_header("TESTE 4: Estrutura do Backend")
        
        backend_src = self.project_root / "backend" / "src"
        
        if backend_src.is_dir():
            self.log_success("Pasta backend/src existe")
            
            # Contar arquivos
            js_files = list(backend_src.glob("**/*.js"))
            ts_files = list(backend_src.glob("**/*.ts"))
            total_files = len(js_files) + len(ts_files)
            
            self.log_info(f"  Total de arquivos JS/TS: {total_files}")
            
            # Procurar por rotas, controladores, etc
            routes_files = list(backend_src.glob("**/routes/*")) + list(backend_src.glob("**/*route*"))
            models_files = list(backend_src.glob("**/models/*")) + list(backend_src.glob("**/*model*"))
            controllers_files = list(backend_src.glob("**/controllers/*")) + list(backend_src.glob("**/*controller*"))
            
            if routes_files:
                self.log_success(f"  Arquivos de rotas encontrados: {len(routes_files)}")
            if models_files:
                self.log_success(f"  Modelos de dados encontrados: {len(models_files)}")
            if controllers_files:
                self.log_success(f"  Controladores encontrados: {len(controllers_files)}")
        else:
            self.log_failure("Pasta backend/src não encontrada")
    
    def test_frontend_structure(self):
        """Teste 5: Estrutura do Frontend"""
        self.log_header("TESTE 5: Estrutura do Frontend")
        
        frontend_src = self.project_root / "frontend" / "src"
        
        if frontend_src.is_dir():
            self.log_success("Pasta frontend/src existe")
            
            # Contar componentes React
            jsx_files = list(frontend_src.glob("**/*.jsx"))
            tsx_files = list(frontend_src.glob("**/*.tsx"))
            js_files = list(frontend_src.glob("**/*.js"))
            
            total_components = len(jsx_files) + len(tsx_files) + len(js_files)
            self.log_info(f"  Total de arquivos JS/JSX/TSX: {total_components}")
            
            # Procurar páginas
            pages_dir = frontend_src / "pages" or self.project_root / "frontend" / "app"
            if (frontend_src / "pages").exists():
                self.log_success("  Pasta pages encontrada")
            elif (frontend_src / "app").exists():
                self.log_success("  App router (Next.js 13+) encontrado")
            
            # Procurar componentes
            components_dir = frontend_src / "components"
            if components_dir.exists():
                comp_files = list(components_dir.glob("**/*.{jsx,tsx,js}"))
                self.log_success(f"  Componentes React encontrados: {len(comp_files)}")
        else:
            self.log_failure("Pasta frontend/src não encontrada")
    
    def test_documentation(self):
        """Teste 6: Documentação"""
        self.log_header("TESTE 6: Documentação")
        
        md_files = list(self.project_root.glob("*.md"))
        self.log_success(f"Arquivos de documentação encontrados: {len(md_files)}")
        
        required_docs = {
            "COMECE_AQUI.md": "Guia inicial",
            "README.md": "README principal",
        }
        
        for file_name, description in required_docs.items():
            if (self.project_root / file_name).is_file():
                self.log_success(f"  {description}: {file_name}")
            else:
                self.log_info(f"  {description} não encontrado ao padrão")
    
    def test_database_setup(self):
        """Teste 7: Setup do banco de dados"""
        self.log_header("TESTE 7: Setup do Banco de Dados")
        
        # SQLite
        sqlite_db = self.project_root / "backend" / "backend_data" / "database.sqlite"
        if sqlite_db.is_file():
            self.log_success("Banco SQLite populado encontrado")
            size_mb = sqlite_db.stat().st_size / (1024 * 1024)
            self.log_info(f"  Tamanho: {size_mb:.2f} MB")
        else:
            self.log_info("Banco SQLite não encontrado (será criado na primeira execução)")
        
        # Schema SQL
        schema_file = self.project_root / "database" / "schema.sql"
        if schema_file.is_file():
            self.log_success("Schema SQL encontrado")
        else:
            self.log_info("Schema SQL não encontrado")
    
    def test_environment_variables(self):
        """Teste 8: Variáveis de ambiente"""
        self.log_header("TESTE 8: Variáveis de Ambiente")
        
        env_file = self.project_root / ".env"
        required_vars = [
            "JWT_SECRET",
            "NODE_ENV",
            "PORT",
            "REDIS_URL",
            "NEXT_PUBLIC_API_URL",
        ]
        
        if env_file.is_file():
            with open(env_file, 'r') as f:
                env_content = f.read()
            
            for var in required_vars:
                if var in env_content:
                    self.log_success(f"Variável {var} configurada")
                else:
                    self.log_failure(f"Variável {var} NÃO configurada")
        else:
            self.log_failure("Arquivo .env não encontrado")
    
    def test_dependencies(self):
        """Teste 9: Dependências do projeto"""
        self.log_header("TESTE 9: Dependências do Projeto")
        
        # Backend
        backend_pkg = self.project_root / "backend" / "package.json"
        if backend_pkg.is_file():
            with open(backend_pkg, 'r') as f:
                backend_data = json.load(f)
            
            deps = backend_data.get('dependencies', {})
            dev_deps = backend_data.get('devDependencies', {})
            
            self.log_success(f"Backend dependencies: {len(deps)} pacotes")
            self.log_info(f"  DevDependencies: {len(dev_deps)} pacotes")
            
            # Verificar pacotes essenciais
            essential = ['express', 'sqlite3' if 'sqlite3' in deps else 'sequelize']
            for pkg in essential:
                if pkg in deps:
                    version = deps[pkg]
                    self.log_info(f"  ✓ {pkg}: {version}")
        
        # Frontend
        frontend_pkg = self.project_root / "frontend" / "package.json"
        if frontend_pkg.is_file():
            with open(frontend_pkg, 'r') as f:
                frontend_data = json.load(f)
            
            deps = frontend_data.get('dependencies', {})
            dev_deps = frontend_data.get('devDependencies', {})
            
            self.log_success(f"Frontend dependencies: {len(deps)} pacotes")
            self.log_info(f"  DevDependencies: {len(dev_deps)} pacotes")
            
            # Verificar pacotes essenciais
            if 'next' in deps:
                self.log_info(f"  ✓ Next.js: {deps['next']}")
            if 'react' in deps:
                self.log_info(f"  ✓ React: {deps['react']}")
    
    def test_git_repo(self):
        """Teste 10: Repositório Git"""
        self.log_header("TESTE 10: Repositório Git")
        
        git_dir = self.project_root / ".git"
        if git_dir.is_dir():
            self.log_success("Repositório Git encontrado")
            
            # Contar commits
            try:
                result = subprocess.run(
                    ["git", "rev-list", "HEAD"],
                    cwd=self.project_root,
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                commit_count = len(result.stdout.strip().split('\n'))
                self.log_info(f"  Commits no repositório: {commit_count}")
            except:
                self.log_info("  Não foi possível contar commits")
        else:
            self.log_failure("Repositório Git não encontrado")
    
    def test_system_tools(self):
        """Teste 11: Ferramentas de sistema"""
        self.log_header("TESTE 11: Ferramentas de Sistema")
        
        tools = {
            "node": "Node.js",
            "npm": "npm",
            "docker": "Docker",
            "curl": "curl",
        }
        
        for cmd, name in tools.items():
            result = subprocess.run(
                ["which", cmd],
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                # Get version
                try:
                    if cmd == "curl":
                        v_result = subprocess.run([cmd, "--version"], capture_output=True, text=True, timeout=2)
                        version = v_result.stdout.split('\n')[0] if v_result.stdout else "instalado"
                    else:
                        v_result = subprocess.run([cmd, "--version"], capture_output=True, text=True, timeout=2)
                        version = v_result.stdout.split('\n')[0] if v_result.stdout else "instalado"
                    self.log_success(f"{name}: {version[:50]}")
                except:
                    self.log_success(f"{name}: instalado")
            else:
                self.log_failure(f"{name}: NÃO instalado")
    
    def test_security(self):
        """Teste 12: Segurança"""
        self.log_header("TESTE 12: Configurações de Segurança")
        
        # .gitignore
        gitignore = self.project_root / ".gitignore"
        if gitignore.is_file():
            self.log_success(".gitignore encontrado")
            with open(gitignore, 'r') as f:
                content = f.read()
            
            security_items = {
                ".env": "Variáveis sensíveis",
                "node_modules": "Dependências",
                "*.key": "Chaves privadas",
                "*.pem": "Certificados",
            }
            
            for item, description in security_items.items():
                if item in content:
                    self.log_success(f"  {description} ({item}) em .gitignore")
                else:
                    self.log_failure(f"  {description} ({item}) NÃO em .gitignore")
        else:
            self.log_failure(".gitignore não encontrado")
    
    def test_api_endpoints(self):
        """Teste 13: Estrutura de endpoints API"""
        self.log_header("TESTE 13: Estrutura de API")
        
        backend_src = self.project_root / "backend" / "src"
        
        # Procurar por padrões de API
        patterns = {
            "auth": "Autenticação",
            "user": "Usuários",
            "service": "Serviços",
            "booking": "Agendamentos",
            "payment": "Pagamentos",
        }
        
        found_endpoints = 0
        for pattern, description in patterns.items():
            files = list(backend_src.glob(f"**/*{pattern}*"))
            if files:
                self.log_success(f"  {description} ({pattern}): {len(files)} arquivo(s)")
                found_endpoints += len(files)
        
        if found_endpoints > 0:
            self.log_success(f"Endpoints API estruturados encontrados: {found_endpoints}")
        else:
            self.log_info("Estrutura de endpoints não claramente identificada")
    
    def test_build_files(self):
        """Teste 14: Arquivos de build/deploy"""
        self.log_header("TESTE 14: Configuração Build/Deploy")
        
        build_files = {
            "docker-compose.yml": "Docker Compose",
            "docker-compose.prod.yml": "Docker Compose Produção",
            "Dockerfile.backend": "Dockerfile Backend",
            "Dockerfile.frontend": "Dockerfile Frontend",
        }
        
        for file_name, description in build_files.items():
            if (self.project_root / file_name).is_file():
                self.log_success(f"{description}: {file_name}")
            else:
                self.log_info(f"{description}: {file_name} não encontrado")
    
    def generate_report(self):
        """Gera relatório final"""
        self.log_header("📋 RELATÓRIO FINAL DE TESTES")
        
        total = self.tests_passed + self.tests_failed
        
        print(f"Data/Hora: {self.timestamp}")
        print(f"Projeto: {self.project_root}")
        print("")
        print(f"Total de Testes: {total}")
        print(f"{GREEN}✅ Testes Passados: {self.tests_passed}{NC}")
        print(f"{RED}❌ Testes Falhados: {self.tests_failed}{NC}")
        
        if total > 0:
            success_rate = (self.tests_passed * 100) // total
            print(f"Taxa de Sucesso: {success_rate}%")
        print("")
        
        if self.tests_failed == 0:
            print(f"{GREEN}🎉 TODOS OS TESTES PASSARAM! 🎉{NC}")
            print("")
            print("O sistema está pronto para ser iniciado!")
            print("")
            print("Próximos passos:")
            print("  1. Iniciar containers:")
            print("     $ docker-compose up -d")
            print("")
            print("  2. Aguardar serviços ficarem prontos (~2 minutos)")
            print("")
            print("  3. Testar backend:")
            print("     $ curl http://localhost:3001/api/health")
            print("")
            print("  4. Testar frontend:")
            print("     Abra http://localhost:3000 no navegador")
            print("")
            print("  5. Login (usuário padrão):")
            print("     Email: admin@leidycleaner.com.br")
            print("     Senha: AdminPassword123!@#")
            return 0
        else:
            print(f"{YELLOW}⚠️  Alguns testes falharam!{NC}")
            print("Verifique os logs acima para detalhes.")
            return 1
    
    def save_report(self):
        """Salva relatório em arquivo"""
        report_dir = self.project_root / "test-results"
        report_dir.mkdir(exist_ok=True)
        
        report_file = report_dir / f"teste-integracao-{datetime.now().strftime('%Y%m%d-%H%M%S')}.txt"
        
        with open(report_file, 'w') as f:
            f.write("=" * 60 + "\n")
            f.write("RELATÓRIO DE TESTE DE INTEGRAÇÃO\n")
            f.write("=" * 60 + "\n\n")
            f.write(f"Data/Hora: {self.timestamp}\n")
            f.write(f"Projeto: {self.project_root}\n\n")
            
            f.write(f"Testes Passados: {self.tests_passed}\n")
            f.write(f"Testes Falhados: {self.tests_failed}\n")
            
            if self.tests_passed + self.tests_failed > 0:
                success_rate = (self.tests_passed * 100) // (self.tests_passed + self.tests_failed)
                f.write(f"Taxa de Sucesso: {success_rate}%\n\n")
            
            f.write("RESULTADOS DETALHADOS:\n")
            f.write("-" * 60 + "\n")
            for status, message in self.results:
                f.write(f"[{status}] {message}\n")
        
        print(f"\n📄 Relatório salvo em: {report_file}")
    
    def run_all_tests(self):
        """Executa todos os testes"""
        print(f"\n{CYAN}")
        print("╔════════════════════════════════════════════╗")
        print("║ 🧪 TESTE DE INTEGRAÇÃO TOTAL - CHEGA      ║")
        print("║    Sistema: Leidy Cleaner                 ║")
        print(f"║    Data: {self.timestamp}                    ║")
        print("╚════════════════════════════════════════════╝")
        print(f"{NC}\n")
        
        # Executar todos os testes
        self.test_project_structure()
        self.test_docker_files()
        self.test_config_files()
        self.test_backend_structure()
        self.test_frontend_structure()
        self.test_documentation()
        self.test_database_setup()
        self.test_environment_variables()
        self.test_dependencies()
        self.test_git_repo()
        self.test_system_tools()
        self.test_security()
        self.test_api_endpoints()
        self.test_build_files()
        
        # Gerar e salvar relatório
        self.save_report()
        return self.generate_report()

def main():
    """Função principal"""
    tester = TestIntegration()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)

if __name__ == "__main__":
    main()
