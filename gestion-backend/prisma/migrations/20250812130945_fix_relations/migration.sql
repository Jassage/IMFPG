/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[professeurId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `grade` ADD COLUMN `professeurId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `schedule` ADD COLUMN `professeurId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `professeurId` VARCHAR(191) NULL,
    ADD COLUMN `studentId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Professeur` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `office` VARCHAR(191) NULL,
    `hireDate` DATETIME(3) NULL,
    `status` ENUM('Actif', 'Inactif') NOT NULL DEFAULT 'Actif',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Professeur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_studentId_key` ON `User`(`studentId`);

-- CreateIndex
CREATE UNIQUE INDEX `User_professeurId_key` ON `User`(`professeurId`);

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_professeurId_fkey` FOREIGN KEY (`professeurId`) REFERENCES `Professeur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_professeurId_fkey` FOREIGN KEY (`professeurId`) REFERENCES `Professeur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_professeurId_fkey` FOREIGN KEY (`professeurId`) REFERENCES `Professeur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
