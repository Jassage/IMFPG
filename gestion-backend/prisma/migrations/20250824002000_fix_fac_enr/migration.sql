/*
  Warnings:

  - You are about to drop the column `faculty` on the `enrollment` table. All the data in the column will be lost.
  - Added the required column `facultyId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `enrollment` DROP COLUMN `faculty`,
    ADD COLUMN `facultyId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `faculties`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_assignments` ADD CONSTRAINT `course_assignments_ueId_fkey` FOREIGN KEY (`ueId`) REFERENCES `ues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
