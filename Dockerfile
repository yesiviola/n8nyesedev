FROM node:22-alpine

WORKDIR /app

# Aumentar memoria para el build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Instalar dependencias del sistema
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    git

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches

# Instalar pnpm
RUN npm install -g pnpm@10.12.1

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Build con memoria aumentada
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm build:deploy

# Cambiar al directorio CLI
WORKDIR /app/packages/cli

# Exponer puerto
EXPOSE 5678

# Comando de inicio
CMD ["./bin/n8n", "start"]