/*
  Warnings:

  - You are about to drop the column `academicYearId` on the `school_classes` table. All the data in the column will be lost.
  - You are about to drop the column `mainTeacherId` on the `school_classes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `school_classes` DROP FOREIGN KEY `school_classes_academicYearId_fkey`;

-- DropForeignKey
ALTER TABLE `school_classes` DROP FOREIGN KEY `school_classes_mainTeacherId_fkey`;

-- DropIndex
DROP INDEX `school_classes_academicYearId_idx` ON `school_classes`;

-- DropIndex
DROP INDEX `school_classes_mainTeacherId_idx` ON `school_classes`;

-- DropIndex
DROP INDEX `school_classes_name_academicYearId_key` ON `school_classes`;

-- AlterTable
ALTER TABLE `school_classes` DROP COLUMN `academicYearId`,
    DROP COLUMN `mainTeacherId`;
