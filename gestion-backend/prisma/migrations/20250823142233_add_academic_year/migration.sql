/*
  Warnings:

  - You are about to drop the column `academicYear` on the `course_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `academicYear` on the `enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `academicYear` on the `grade` table. All the data in the column will be lost.
  - You are about to drop the column `academicYear` on the `scholarship` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ueId,facultyId,level,academicYearId,semester]` on the table `course_assignments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academicYearId` to the `course_assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicYearId` to the `Grade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academicYearId` to the `Scholarship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `course_assignments` DROP FOREIGN KEY `course_assignments_ueId_fkey`;

-- DropIndex
DROP INDEX `course_assignments_ueId_facultyId_level_academicYear_semeste_key` ON `course_assignments`;

-- AlterTable
ALTER TABLE `course_assignments` DROP COLUMN `academicYear`,
    ADD COLUMN `academicYearId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `enrollment` DROP COLUMN `academicYear`,
    ADD COLUMN `academicYearId` VARCHAR(191) NOT NULL DEFAULT '2024-2025';

-- AlterTable
ALTER TABLE `grade` DROP COLUMN `academicYear`,
    ADD COLUMN `academicYearId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `scholarship` DROP COLUMN `academicYear`,
    ADD COLUMN `academicYearId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `academic_years` (
    `id` VARCHAR(191) NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `academic_years_year_key`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `course_assignments_ueId_facultyId_level_academicYearId_semes_key` ON `course_assignments`(`ueId`, `facultyId`, `level`, `academicYearId`, `semester`);

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_assignments` ADD CONSTRAINT `course_assignments_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scholarship` ADD CONSTRAINT `Scholarship_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
