/*
  Warnings:

  - You are about to drop the `transcript` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `grade` DROP FOREIGN KEY `Grade_transcriptId_fkey`;

-- DropForeignKey
ALTER TABLE `transcript` DROP FOREIGN KEY `Transcript_studentId_fkey`;

-- DropIndex
DROP INDEX `Grade_transcriptId_fkey` ON `grade`;

-- DropTable
DROP TABLE `transcript`;

-- CreateTable
CREATE TABLE `transcripts` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `academicYearId` VARCHAR(191) NOT NULL,
    `semester` ENUM('S1', 'S2') NOT NULL,
    `level` VARCHAR(191) NOT NULL,
    `documentType` ENUM('BULLETIN', 'RELEVE', 'ATTESTATION_NIVEAU', 'ATTESTATION_FIN_ETUDES', 'CERTIFICAT_SCOLARITE') NOT NULL,
    `gpa` DOUBLE NOT NULL,
    `totalCredits` INTEGER NOT NULL,
    `creditsEarned` INTEGER NOT NULL,
    `successRate` DOUBLE NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `pdfData` LONGBLOB NULL,
    `status` ENUM('DRAFT', 'GENERATED', 'PUBLISHED', 'ARCHIVED', 'DELETED') NOT NULL,
    `generatedBy` VARCHAR(191) NULL,
    `generatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `language` ENUM('FR', 'EN') NOT NULL DEFAULT 'FR',
    `metadata` JSON NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `transcripts_studentId_idx`(`studentId`),
    INDEX `transcripts_academicYearId_idx`(`academicYearId`),
    INDEX `transcripts_semester_idx`(`semester`),
    INDEX `transcripts_documentType_idx`(`documentType`),
    INDEX `transcripts_generatedAt_idx`(`generatedAt`),
    INDEX `transcripts_status_idx`(`status`),
    UNIQUE INDEX `transcripts_studentId_academicYearId_semester_documentType_key`(`studentId`, `academicYearId`, `semester`, `documentType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transcript_grades` (
    `id` VARCHAR(191) NOT NULL,
    `transcriptId` VARCHAR(191) NOT NULL,
    `gradeId` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `transcript_grades_transcriptId_idx`(`transcriptId`),
    INDEX `transcript_grades_gradeId_idx`(`gradeId`),
    INDEX `transcript_grades_order_idx`(`order`),
    UNIQUE INDEX `transcript_grades_transcriptId_gradeId_key`(`transcriptId`, `gradeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_history` (
    `id` VARCHAR(191) NOT NULL,
    `transcriptId` VARCHAR(191) NOT NULL,
    `action` ENUM('GENERATED', 'DOWNLOADED', 'MODIFIED', 'VIEWED', 'DELETED') NOT NULL,
    `performedBy` VARCHAR(191) NULL,
    `details` JSON NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `performedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `document_history_transcriptId_idx`(`transcriptId`),
    INDEX `document_history_action_idx`(`action`),
    INDEX `document_history_performedAt_idx`(`performedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transcripts` ADD CONSTRAINT `transcripts_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transcripts` ADD CONSTRAINT `transcripts_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transcript_grades` ADD CONSTRAINT `transcript_grades_transcriptId_fkey` FOREIGN KEY (`transcriptId`) REFERENCES `transcripts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transcript_grades` ADD CONSTRAINT `transcript_grades_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_history` ADD CONSTRAINT `document_history_transcriptId_fkey` FOREIGN KEY (`transcriptId`) REFERENCES `transcripts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
