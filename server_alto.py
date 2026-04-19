#!/usr/bin/env python3
"""
🚀 Script para atualizar e rodar o servidor Flask
Executa: git pull + python3 main.py
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(cmd, description):
    """Executa um comando e mostra o resultado"""
    print(f"\n{'='*60}")
    print(f"▶️  {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(cmd, shell=True, check=True)
        print(f"✅ {description} concluído com sucesso!\n")
        return result.returncode
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao executar: {description}")
        print(f"   Código de erro: {e.returncode}\n")
        return e.returncode

def main():
    print("\n" + "="*60)
    print("🔧 SERVIDOR SITE - ATUALIZAR E RODAR")
    print("="*60)
    
    # Diretório do projeto
    project_dir = Path(__file__).parent
    os.chdir(project_dir)
    
    # 1. Atualizar repositório
    print(f"\n📁 Diretório: {project_dir}")
    run_command("git pull origin main", "Atualizando repositório")
    
    # 2. Rodar o Flask
    print("\n🌐 Iniciando servidor Flask...\n")
    subprocess.run([sys.executable, "main.py"])

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⛔ Servidor parado pelo usuário (Ctrl+C)")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        sys.exit(1)