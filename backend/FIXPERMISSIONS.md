# Solucionando o erro de permissão do Prisma Migrate

Este documento explica como resolver o erro:

```
Error: P3014
Prisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases.
```

## Solução adotada

Para resolver este problema, implementamos uma solução que concede privilégios adicionais ao usuário `petuser` durante a inicialização do container do MariaDB:

1. Adicionamos um arquivo `init-db.sql` ao projeto
2. Configuramos o Docker Compose para executar este script na inicialização do banco de dados

## Como funciona

O arquivo `init-db.sql` contém comandos SQL que concedem ao usuário `petuser` todos os privilégios necessários para criar e gerenciar bancos de dados, incluindo o shadow database que o Prisma Migrate precisa.

O Docker Compose está configurado para montar este arquivo como um volume no caminho `/docker-entrypoint-initdb.d/` do container, fazendo com que ele seja executado automaticamente na inicialização.

## Passos para aplicar a solução

1. **Pare os containers em execução:**
   ```bash
   docker-compose down
   ```

2. **Remova o volume do banco de dados para garantir uma nova inicialização limpa:**
   ```bash
   docker volume rm backend_mariadb_data
   ```

3. **Inicie os containers novamente:**
   ```bash
   docker-compose up -d
   ```

4. **Verifique se o container do MariaDB está rodando:**
   ```bash
   docker-compose ps
   ```

5. **Execute as migrações do Prisma:**
   ```bash
   npm run prisma:migrate
   ```

6. **Popule o banco de dados com dados de teste (opcional):**
   ```bash
   npm run prisma:seed
   ```

## Solução de problemas

Se ainda tiver problemas após seguir estes passos, você pode verificar se o script de inicialização foi executado corretamente acessando o banco de dados:

```bash
docker-compose exec mariadb mysql -uroot -prootpassword -e "SHOW GRANTS FOR 'petuser'@'%';"
```

O resultado deve mostrar que o usuário `petuser` tem o privilégio `GRANT ALL PRIVILEGES ON *.*`. 