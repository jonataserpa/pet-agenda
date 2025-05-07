/*
  Warnings:

  - Added the required column `senha` to the `clientes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clientes` ADD COLUMN `senha` VARCHAR(191) NOT NULL DEFAULT '$2b$10$tUVbvTFxZEnXU0PIQ.YbsuErdEV7F1y1qKZACnYXw1F65QKyYKvDe';

-- Este é o hash bcrypt para a senha padrão 'senha123'
-- Após a migração, todos os usuários devem trocar suas senhas
