/*
  Warnings:

  - A unique constraint covering the columns `[cin]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `student` ADD COLUMN `cin` VARCHAR(191) NULL,
    ADD COLUMN `sexe` ENUM('Masculin', 'Feminin', 'Autre') NULL;

-- CreateIndex
CREATE INDEX `Enrollment_studentId_academicYearId_idx` ON `Enrollment`(`studentId`, `academicYearId`);

-- CreateIndex
CREATE INDEX `Enrollment_facultyId_level_idx` ON `Enrollment`(`facultyId`, `level`);

-- CreateIndex
CREATE INDEX `Grade_studentId_academicYearId_idx` ON `Grade`(`studentId`, `academicYearId`);

-- CreateIndex
CREATE INDEX `Grade_ueId_academicYearId_semester_idx` ON `Grade`(`ueId`, `academicYearId`, `semester`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_cin_key` ON `Student`(`cin`);

-- CreateIndex
CREATE INDEX `User_email_status_idx` ON `User`(`email`, `status`);

-- CreateIndex
CREATE INDEX `User_role_status_idx` ON `User`(`role`, `status`);
