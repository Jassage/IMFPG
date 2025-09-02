/*
  Warnings:

  - You are about to drop the column `coursesCount` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `studentsCount` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `studyDuration` on the `faculty` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `facultylevel` table. All the data in the column will be lost.
  - You are about to drop the column `academicYear` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `faculty` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `professorId` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `ueId` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `faculty` on the `ue` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `ue` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `ue` table. All the data in the column will be lost.
  - You are about to drop the column `professeurId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `prerequisite` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[facultyId,code]` on the table `FacultyLevel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Professeur` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `FacultyLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `FacultyLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignmentId` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `UE` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UE` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `prerequisite` DROP FOREIGN KEY `Prerequisite_ueId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_ueId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_professeurId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_studentId_fkey`;

-- DropIndex
DROP INDEX `Schedule_ueId_fkey` ON `schedule`;

-- DropIndex
DROP INDEX `User_professeurId_key` ON `user`;

-- DropIndex
DROP INDEX `User_studentId_key` ON `user`;

-- AlterTable
ALTER TABLE `faculty` DROP COLUMN `coursesCount`,
    DROP COLUMN `studentsCount`,
    DROP COLUMN `studyDuration`;

-- AlterTable
ALTER TABLE `facultylevel` DROP COLUMN `level`,
    ADD COLUMN `code` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `professeur` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `academicYear`,
    DROP COLUMN `faculty`,
    DROP COLUMN `level`,
    DROP COLUMN `professorId`,
    DROP COLUMN `semester`,
    DROP COLUMN `ueId`,
    ADD COLUMN `assignmentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `exceptions` JSON NULL,
    ADD COLUMN `recurrence` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ue` DROP COLUMN `faculty`,
    DROP COLUMN `level`,
    DROP COLUMN `semester`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdById` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `objectives` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `passingGrade` INTEGER NOT NULL DEFAULT 60;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `professeurId`,
    DROP COLUMN `studentId`;

-- DropTable
DROP TABLE `prerequisite`;

-- CreateTable
CREATE TABLE `CourseAssignment` (
    `id` VARCHAR(191) NOT NULL,
    `ueId` VARCHAR(191) NOT NULL,
    `facultyId` VARCHAR(191) NOT NULL,
    `levelId` VARCHAR(191) NOT NULL,
    `professeurId` VARCHAR(191) NOT NULL,
    `academicYear` VARCHAR(191) NOT NULL,
    `semester` ENUM('S1', 'S2') NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CourseAssignment_ueId_facultyId_levelId_academicYear_semeste_key`(`ueId`, `facultyId`, `levelId`, `academicYear`, `semester`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UEPrerequisite` (
    `id` VARCHAR(191) NOT NULL,
    `ueId` VARCHAR(191) NOT NULL,
    `requiredUEId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `UEPrerequisite_ueId_requiredUEId_key`(`ueId`, `requiredUEId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `FacultyLevel_facultyId_code_key` ON `FacultyLevel`(`facultyId`, `code`);

-- CreateIndex
CREATE UNIQUE INDEX `Professeur_userId_key` ON `Professeur`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_userId_key` ON `Student`(`userId`);

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Professeur` ADD CONSTRAINT `Professeur_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UE` ADD CONSTRAINT `UE_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseAssignment` ADD CONSTRAINT `CourseAssignment_ueId_fkey` FOREIGN KEY (`ueId`) REFERENCES `UE`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseAssignment` ADD CONSTRAINT `CourseAssignment_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `Faculty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseAssignment` ADD CONSTRAINT `CourseAssignment_levelId_fkey` FOREIGN KEY (`levelId`) REFERENCES `FacultyLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseAssignment` ADD CONSTRAINT `CourseAssignment_professeurId_fkey` FOREIGN KEY (`professeurId`) REFERENCES `Professeur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UEPrerequisite` ADD CONSTRAINT `UEPrerequisite_ueId_fkey` FOREIGN KEY (`ueId`) REFERENCES `UE`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UEPrerequisite` ADD CONSTRAINT `UEPrerequisite_requiredUEId_fkey` FOREIGN KEY (`requiredUEId`) REFERENCES `UE`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `CourseAssignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
