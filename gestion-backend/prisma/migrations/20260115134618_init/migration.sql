/*
  Warnings:

  - The values [Valid_,Non_valid_,Reprendre] on the enum `grades_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [Parent] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `parents` DROP FOREIGN KEY `parents_userId_fkey`;

-- AlterTable
ALTER TABLE `enrollments` MODIFY `enrollmentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `status` ENUM('Active', 'Suspended', 'Completed') NOT NULL DEFAULT 'Active',
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `grades` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `approvedBy` VARCHAR(191) NULL,
    ADD COLUMN `createdBy` VARCHAR(191) NULL,
    ADD COLUMN `publishedAt` DATETIME(3) NULL,
    ADD COLUMN `publishedBy` VARCHAR(191) NULL,
    ADD COLUMN `rejectedAt` DATETIME(3) NULL,
    ADD COLUMN `rejectedBy` VARCHAR(191) NULL,
    ADD COLUMN `rejectionReason` VARCHAR(191) NULL,
    ADD COLUMN `submittedAt` DATETIME(3) NULL,
    ADD COLUMN `submittedBy` VARCHAR(191) NULL,
    MODIFY `status` ENUM('Draft', 'Submitted', 'Approved', 'Rejected', 'Published', 'Archived') NOT NULL;

-- AlterTable
ALTER TABLE `professeurs` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `hireDate` DATETIME(3) NULL,
    ADD COLUMN `qualifications` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('Admin', 'Professeur', 'Secretaire', 'Directeur', 'Comptable', 'Student') NOT NULL;

-- CreateTable
CREATE TABLE `professeur_subjects` (
    `id` VARCHAR(191) NOT NULL,
    `professeurId` VARCHAR(191) NOT NULL,
    `subjectId` VARCHAR(191) NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `yearsOfExperience` INTEGER NULL DEFAULT 0,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `professeur_subjects_professeurId_idx`(`professeurId`),
    INDEX `professeur_subjects_subjectId_idx`(`subjectId`),
    INDEX `professeur_subjects_isPrimary_idx`(`isPrimary`),
    UNIQUE INDEX `professeur_subjects_professeurId_subjectId_key`(`professeurId`, `subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `grades` ADD CONSTRAINT `grades_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grades` ADD CONSTRAINT `grades_submittedBy_fkey` FOREIGN KEY (`submittedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grades` ADD CONSTRAINT `grades_approvedBy_fkey` FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grades` ADD CONSTRAINT `grades_rejectedBy_fkey` FOREIGN KEY (`rejectedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grades` ADD CONSTRAINT `grades_publishedBy_fkey` FOREIGN KEY (`publishedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professeur_subjects` ADD CONSTRAINT `professeur_subjects_professeurId_fkey` FOREIGN KEY (`professeurId`) REFERENCES `professeurs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professeur_subjects` ADD CONSTRAINT `professeur_subjects_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
