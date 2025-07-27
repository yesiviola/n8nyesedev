#!/bin/bash

# Script optimizado para build en Render
export NODE_OPTIONS="--max-old-space-size=4096"

echo "🔧 Instalando dependencias..."
pnpm install --frozen-lockfile

echo "🏗️ Building n8n para producción..."
pnpm build:deploy

echo "✅ Build completado!"