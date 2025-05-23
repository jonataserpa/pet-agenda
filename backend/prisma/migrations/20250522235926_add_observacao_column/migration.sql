/*
  Warnings:

  - Made the column `observacao` on table `clientes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `clientes` MODIFY `observacao` VARCHAR(191) NOT NULL;
