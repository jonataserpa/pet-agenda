# 1) Builder — instala dependências e faz build completo (inclui seed compilado)
FROM node:18-alpine AS builder
RUN apk add --no-cache \
      openssl \
      zlib \
      libstdc++ \
      libc6-compat \
      bash

WORKDIR /app
COPY package*.json ./
RUN npm ci

# gera Prisma Client para linux-musl
COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# 2) Runner — sem ts-node, só netcat pros migrations
FROM node:18-alpine AS runner
RUN apk add --no-cache \
      gcompat \
      netcat-openbsd \
      openssl \
      zlib \
      libstdc++ \
      libc6-compat \
      bash

WORKDIR /app
COPY --from=builder /app .

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV DATABASE_URL="mysql://petuser:petpassword@db:3306/petagenda"
ENV JWT_SECRET="pet-agenda-secret-key"
ENV PORT=3000
ENV NODE_ENV="development"

EXPOSE 3000
ENTRYPOINT ["entrypoint.sh"]