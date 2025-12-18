/*
  Warnings:

  - You are about to drop the column `objectives` on the `subjects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `subjects` DROP COLUMN `objectives`,
    ADD COLUMN `coefficient` INTEGER NOT NULL DEFAULT 1;
