#!/bin/bash

cd /index || exit

echo "🛑 Parando qualquer servidor em execução..."
pkill -f main.py
pkill -f http.server

sleep 2

echo "🚧 Iniciando modo manutenção..."
cd /index/maintenance || exit
nohup python3 main.py > /maintenance/log.txt 2>&1 &

sleep 3

echo "🧹 Limpando arquivos antigos do site..."
rm -rf /site

echo "📥 Baixando nova versão do site do GitHub..."
cd /index

# 🔥 clona em pasta temporária (mais seguro)
git clone https://github.com/kendrick3004/site.git

echo "📂 Entrando na pasta do site..."
cd /index/site || exit

echo "⚙️ Gerando estrutura de assets..."
if [ -f database/generate_assets_structure.py ]; then
    cd database || exit
    python3 generate_assets_structure.py
    cd .. || exit
else
    echo "⚠️ Script de assets não encontrado!"
fi

echo "🛑 Finalizando modo manutenção..."
pkill -f main.py

sleep 2

echo "🚀 Iniciando servidor principal do site..."
nohup python3 main.py > /site/log_site.txt 2>&1 &

echo "✅ Deploy finalizado! Site online."

# 🔥 Garante que o log existe
touch /site/log_site.txt

# 🔥 Pergunta se quer ver logs
read -p "📜 Deseja abrir o log em tempo real? (s/n): " opcao

if [ "$opcao" = "s" ]; then
    echo "📊 Pressione CTRL+C para sair do log"
    tail -f /site/log_site.txt
fi