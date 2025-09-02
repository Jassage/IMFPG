/*
  Warnings:

  - You are about to drop the column `signature` on the `guardian` table. All the data in the column will be lost.
  - You are about to drop the `courseassignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faculty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `facultylevel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `courseassignment` DROP FOREIGN KEY `CourseAssignment_facultyId_fkey`;

-- DropForeignKey
ALTER TABLE `courseassignment` DROP FOREIGN KEY `CourseAssignment_levelId_fkey`;

-- DropForeignKey
ALTER TABLE `courseassignment` DROP FOREIGN KEY `CourseAssignment_professeurId_fkey`;

-- DropForeignKey
ALTER TABLE `courseassignment` DROP FOREIGN KEY `CourseAssignment_ueId_fkey`;

-- DropForeignKey
ALTER TABLE `facultylevel` DROP FOREIGN KEY `FacultyLevel_facultyId_fkey`;

-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_assignmentId_fkey`;

-- DropIndex
DROP INDEX `Schedule_assignmentId_fkey` ON `schedule`;

-- AlterTable
ALTER TABLE `guardian` DROP COLUMN `signature`,
    ADD COLUMN `isPrimary` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `professeur` ADD COLUMN `speciality` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `courseassignment`;

-- DropTable
DROP TABLE `faculty`;

-- DropTable
DROP TABLE `facultylevel`;

-- CreateTable
CREATE TABLE `course_assignments` (
    `id` VARCHAR(191) NOT NULL,
    `ueId` VARCHAR(191) NOT NULL,
    `facultyId` VARCHAR(191) NOT NULL,
    `professeurId` VARCHAR(191) NOT NULL,
    `academicYear` VARCHAR(191) NOT NULL,
    `semester` ENUM('S1', 'S2') NOT NULL,
    `level` VARCHAR(191) NOT NULL,
    `facultyLevelId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `course_assignments_ueId_facultyId_level_academicYear_semeste_key`(`ueId`, `facultyId`, `level`, `academicYear`, `semester`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faculties` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `dean` VARCHAR(191) NULL,
    `studentsCount` INTEGER NOT NULL DEFAULT 0,
    `coursesCount` INTEGER NOT NULL DEFAULT 0,
    `studyDuration` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `faculties_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faculty_levels` (
    `id` VARCHAR(191) NOT NULL,
    `facultyId` VARCHAR(191) NOT NULL,
    `level` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `faculty_levels_facultyId_level_key`(`facultyId`, `level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `course_assignments` ADD CONSTRAINT `course_assignments_ueId_fkey` FOREIGN KEY (`ueId`) REFERENCES `UE`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_assignments` ADD CONSTRAINT `course_assignments_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `faculties`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_assignments` ADD CONSTRAINT `course_assignments_professeurId_fkey` FOREIGN KEY (`professeurId`) REFERENCES `Professeur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_assignments` ADD CONSTRAINT `course_assignments_facultyLevelId_fkey` FOREIGN KEY (`facultyLevelId`) REFERENCES `faculty_levels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `faculty_levels` ADD CONSTRAINT `faculty_levels_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `faculties`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `course_assignments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
