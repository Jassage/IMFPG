/*
  Warnings:

  - You are about to drop the column `professeurId` on the `grade` table. All the data in the column will be lost.
  - The values [Valide,AReprendre,EnCours] on the enum `Grade_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [Rattrapage] on the enum `Grade_session` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[studentId,ueId,academicYearId,semester,session]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Grade` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `grade` DROP FOREIGN KEY `Grade_academicYearId_fkey`;

-- DropForeignKey
ALTER TABLE `grade` DROP FOREIGN KEY `Grade_professeurId_fkey`;

-- DropIndex
DROP INDEX `Grade_academicYearId_fkey` ON `grade`;

-- DropIndex
DROP INDEX `Grade_professeurId_fkey` ON `grade`;

-- AlterTable
ALTER TABLE `grade` DROP COLUMN `professeurId`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('Validé', 'Non_validé', 'À_reprendre') NOT NULL,
    MODIFY `session` ENUM('Normale', 'Reprise') NOT NULL;

-- CreateIndex
CREATE INDEX `Grade_studentId_ueId_idx` ON `Grade`(`studentId`, `ueId`);

-- CreateIndex
CREATE INDEX `Grade_academicYearId_semester_idx` ON `Grade`(`academicYearId`, `semester`);

-- CreateIndex
CREATE UNIQUE INDEX `Grade_studentId_ueId_academicYearId_semester_session_key` ON `Grade`(`studentId`, `ueId`, `academicYearId`, `semester`, `session`);

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
