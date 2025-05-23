/*
  Warnings:

  - You are about to drop the column `notes` on the `agendamentos` table. All the data in the column will be lost.
  - Added the required column `observacao` to the `agendamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `agendamentos` DROP COLUMN `notes`,
    ADD COLUMN `observacao` VARCHAR(191) NOT NULL;
