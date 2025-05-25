#!/bin/sh
set -e

echo "⏱️  Aguardando o banco de dados..."
until nc -z db 3306; do
  sleep 1
done
echo "✅  Banco disponível. Rodando migrações..."

# Para ambientes de dev use `prisma migrate dev`; em prod, `prisma migrate deploy`
npx prisma migrate deploy
# npx prisma db seed

echo "🚀  Iniciando a aplicação"
exec npm start
