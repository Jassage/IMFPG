/*
  Warnings:

  - You are about to drop the `ue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ueprerequisite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `course_assignments` DROP FOREIGN KEY `course_assignments_ueId_fkey`;

-- DropForeignKey
ALTER TABLE `grade` DROP FOREIGN KEY `Grade_ueId_fkey`;

-- DropForeignKey
ALTER TABLE `retake` DROP FOREIGN KEY `Retake_ueId_fkey`;

-- DropForeignKey
ALTER TABLE `ue` DROP FOREIGN KEY `UE_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `ueprerequisite` DROP FOREIGN KEY `UEPrerequisite_requiredUEId_fkey`;

-- DropForeignKey
ALTER TABLE `ueprerequisite` DROP FOREIGN KEY `UEPrerequisite_ueId_fkey`;

-- DropIndex
DROP INDEX `Grade_ueId_fkey` ON `grade`;

-- DropIndex
DROP INDEX `Retake_ueId_fkey` ON `retake`;

-- DropTable
DROP TABLE `ue`;

-- DropTable
DROP TABLE `ueprerequisite`;

-- CreateTable
CREATE TABLE `ues` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `credits` INTEGER NOT NULL,
    `type` ENUM('Obligatoire', 'Optionnelle') NOT NULL,
    `passingGrade` INTEGER NOT NULL DEFAULT 60,
    `description` VARCHAR(191) NULL,
    `objectives` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ues_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ue_prerequisites` (
    `id` VARCHAR(191) NOT NULL,
    `ueId` VARCHAR(191) NOT NULL,
    `prerequisiteId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ue_prerequisites_ueId_prerequisiteId_key`(`ueId`, `prerequisiteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ues` ADD CONSTRAINT `ues_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_assignments` ADD CONSTRAINT `course_assignments_ueId_fkey` FOREIGN KEY (`ueId`) REFERENCES `ues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ue_prerequisites` ADD CONSTRAINT `ue_prerequisites_ueId_fkey` FOREIGN KEY (`ueId`) REFERENCES `ues`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ue_prerequisites` ADD CONSTRAINT `ue_prerequisites_prerequisiteId_fkey` FOREIGN KEY (`prerequisiteId`) REFERENCES `ues`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_ueId_fkey` FOREIGN KEY (`ueId`) REFERENCES `ues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Retake` ADD CONSTRAINT `Retake_ueId_fkey` FOREIGN KEY (`ueId`) REFERENCES `ues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
