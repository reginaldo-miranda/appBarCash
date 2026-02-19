#!/bin/bash
# Script para iniciar o sistema via Navegador (Cliente)

# 1. Iniciar API (Backend) em background
echo "Iniciando o servidor (API)..."
cd "$(dirname "$0")/api" || exit
npm start &
API_PID=$!

# Aguardar um pouco para garantir que a API subiu
sleep 5

# 2. Iniciar Aplicação Web
echo "Iniciando o sistema no navegador..."
cd "../mobile" || exit
# Roda o Expo Webna porta 8081 (padrão)
npx expo start --web --host lan

# Quando fechar o processo do web, matar a API também
kill $API_PID
