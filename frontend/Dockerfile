# 1) Instala dependências
FROM node:18-alpine AS deps
WORKDIR /app

# Copia apenas o package e instala
COPY package.json package-lock.json ./
RUN npm ci --force

# 2) Build da aplicação
FROM node:18-alpine AS builder
WORKDIR /app

# Copia tudo e usa node_modules já instalado
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Faz o build do Next.js
RUN npm run build

# 3) Imagem final de runtime
FROM node:18-alpine AS runner
WORKDIR /app

# Define ambiente de produção
ENV NODE_ENV=production
# Porta onde a app irá escutar
ENV PORT=3001
# Variáveis de ambiente da sua app
ENV NEXT_PUBLIC_API_URL=http://localhost:3000/api
ENV JWT_SECRET=pet-agenda-secret-key

# Copia apenas o necessário
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expõe a porta 3001
EXPOSE 3001

# Comando padrão para iniciar o Next.js em modo production
CMD ["npx", "next", "start", "-p", "3001"]
