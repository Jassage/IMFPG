/*
  Warnings:

  - Added the required column `academicYearId` to the `student_fees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_fees` ADD COLUMN `academicYearId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `student_fees` ADD CONSTRAINT `student_fees_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
