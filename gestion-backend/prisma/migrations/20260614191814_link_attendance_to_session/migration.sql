/*
  Warnings:

  - A unique constraint covering the columns `[attendanceSessionId,studentId]` on the table `attendance_records` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentId` to the `attendance_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `attendance_records` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `attendance_records` DROP FOREIGN KEY `attendance_records_attendanceSessionId_fkey`;

-- DropIndex
DROP INDEX `attendance_records_attendanceSessionId_attendanceId_key` ON `attendance_records`;

-- AlterTable
ALTER TABLE `attendance_records` ADD COLUMN `checkInTime` DATETIME(3) NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `recordedById` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'HOLIDAY', 'SICK', 'SUSPENDED', 'OTHER') NOT NULL DEFAULT 'PRESENT',
    ADD COLUMN `studentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `attendanceId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `system_settings` MODIFY `phone` VARCHAR(191) NOT NULL DEFAULT '+509 00 00 0000',
    MODIFY `email` VARCHAR(191) NOT NULL DEFAULT 'contact@imfp.ht',
    MODIFY `website` VARCHAR(191) NULL DEFAULT 'https://www.imfp.ht',
    MODIFY `city` VARCHAR(191) NULL DEFAULT 'Port-au-Prince',
    MODIFY `country` VARCHAR(191) NULL DEFAULT 'Haïti',
    MODIFY `currency` VARCHAR(191) NOT NULL DEFAULT 'HTG',
    MODIFY `currencySymbol` VARCHAR(191) NOT NULL DEFAULT 'G',
    MODIFY `taxRate` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `latePaymentFee` DOUBLE NOT NULL DEFAULT 500;

-- CreateIndex
CREATE INDEX `attendance_records_studentId_idx` ON `attendance_records`(`studentId`);

-- CreateIndex
CREATE UNIQUE INDEX `attendance_records_attendanceSessionId_studentId_key` ON `attendance_records`(`attendanceSessionId`, `studentId`);

-- AddForeignKey
ALTER TABLE `attendance_records` ADD CONSTRAINT `attendance_records_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_records` ADD CONSTRAINT `attendance_records_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_records` ADD CONSTRAINT `attendance_records_attendanceSessionId_fkey` FOREIGN KEY (`attendanceSessionId`) REFERENCES `attendance_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
