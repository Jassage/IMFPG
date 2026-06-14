-- CreateTable
CREATE TABLE `attendances` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `classId` VARCHAR(191) NOT NULL,
    `academicYearId` VARCHAR(191) NOT NULL,
    `attendance_date` DATETIME(3) NOT NULL,
    `session` ENUM('MORNING', 'AFTERNOON', 'FULL_DAY') NOT NULL DEFAULT 'FULL_DAY',
    `status` ENUM('PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'HOLIDAY', 'SICK', 'SUSPENDED', 'OTHER') NOT NULL DEFAULT 'PRESENT',
    `checkInTime` DATETIME(3) NULL,
    `checkOutTime` DATETIME(3) NULL,
    `expectedCheckIn` VARCHAR(191) NULL,
    `expectedCheckOut` VARCHAR(191) NULL,
    `validationStatus` ENUM('PENDING', 'VALIDATED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `validatedBy` VARCHAR(191) NULL,
    `validatedAt` DATETIME(3) NULL,
    `justification` VARCHAR(191) NULL,
    `justificationType` ENUM('MEDICAL_CERTIFICATE', 'FAMILY_REASON', 'ADMINISTRATIVE', 'TRANSPORT_ISSUE', 'OTHER') NULL,
    `justificationDoc` VARCHAR(191) NULL,
    `justifiedAt` DATETIME(3) NULL,
    `justifiedBy` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `attendances_studentId_idx`(`studentId`),
    INDEX `attendances_classId_idx`(`classId`),
    INDEX `attendances_attendance_date_idx`(`attendance_date`),
    INDEX `attendances_academicYearId_idx`(`academicYearId`),
    INDEX `attendances_status_idx`(`status`),
    INDEX `attendances_validationStatus_idx`(`validationStatus`),
    UNIQUE INDEX `attendances_studentId_classId_academicYearId_attendance_date_key`(`studentId`, `classId`, `academicYearId`, `attendance_date`, `session`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `classId` VARCHAR(191) NOT NULL,
    `subjectId` VARCHAR(191) NOT NULL,
    `professeurId` VARCHAR(191) NOT NULL,
    `academicYearId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `topic` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `isCancelled` BOOLEAN NOT NULL DEFAULT false,
    `cancellationReason` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `attendance_sessions_classId_idx`(`classId`),
    INDEX `attendance_sessions_subjectId_idx`(`subjectId`),
    INDEX `attendance_sessions_professeurId_idx`(`professeurId`),
    INDEX `attendance_sessions_date_idx`(`date`),
    INDEX `attendance_sessions_academicYearId_idx`(`academicYearId`),
    UNIQUE INDEX `attendance_sessions_classId_subjectId_professeurId_date_star_key`(`classId`, `subjectId`, `professeurId`, `date`, `startTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance_records` (
    `id` VARCHAR(191) NOT NULL,
    `attendanceSessionId` VARCHAR(191) NOT NULL,
    `attendanceId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `attendance_records_attendanceSessionId_idx`(`attendanceSessionId`),
    INDEX `attendance_records_attendanceId_idx`(`attendanceId`),
    UNIQUE INDEX `attendance_records_attendanceSessionId_attendanceId_key`(`attendanceSessionId`, `attendanceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance_stats` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `academicYearId` VARCHAR(191) NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `totalDays` INTEGER NOT NULL DEFAULT 0,
    `presentDays` INTEGER NOT NULL DEFAULT 0,
    `absentDays` INTEGER NOT NULL DEFAULT 0,
    `lateDays` INTEGER NOT NULL DEFAULT 0,
    `excusedDays` INTEGER NOT NULL DEFAULT 0,
    `sickDays` INTEGER NOT NULL DEFAULT 0,
    `attendanceRate` DOUBLE NOT NULL DEFAULT 0,
    `punctualityRate` DOUBLE NOT NULL DEFAULT 0,
    `lastCalculated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `attendance_stats_studentId_idx`(`studentId`),
    INDEX `attendance_stats_academicYearId_idx`(`academicYearId`),
    INDEX `attendance_stats_month_year_idx`(`month`, `year`),
    UNIQUE INDEX `attendance_stats_studentId_academicYearId_month_year_key`(`studentId`, `academicYearId`, `month`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance_settings` (
    `id` VARCHAR(191) NOT NULL,
    `schoolId` VARCHAR(191) NOT NULL DEFAULT 'default',
    `defaultMorningStart` VARCHAR(191) NOT NULL DEFAULT '08:00',
    `defaultMorningEnd` VARCHAR(191) NOT NULL DEFAULT '12:00',
    `defaultAfternoonStart` VARCHAR(191) NOT NULL DEFAULT '14:00',
    `defaultAfternoonEnd` VARCHAR(191) NOT NULL DEFAULT '17:00',
    `lateThreshold` INTEGER NOT NULL DEFAULT 15,
    `autoValidateAfter` INTEGER NULL,
    `notifyOnAbsence` BOOLEAN NOT NULL DEFAULT true,
    `notifyParentsOnAbsence` BOOLEAN NOT NULL DEFAULT true,
    `notifyOnLate` BOOLEAN NOT NULL DEFAULT true,
    `requireJustification` BOOLEAN NOT NULL DEFAULT true,
    `maxConsecutiveAbsences` INTEGER NOT NULL DEFAULT 5,
    `alertThreshold` INTEGER NOT NULL DEFAULT 80,
    `updatedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `attendance_settings_schoolId_key`(`schoolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance_holidays` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `recurring` BOOLEAN NOT NULL DEFAULT false,
    `academicYearId` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `attendance_holidays_date_idx`(`date`),
    INDEX `attendance_holidays_type_idx`(`type`),
    INDEX `attendance_holidays_academicYearId_idx`(`academicYearId`),
    UNIQUE INDEX `attendance_holidays_date_academicYearId_key`(`date`, `academicYearId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `school_classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_validatedBy_fkey` FOREIGN KEY (`validatedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_justifiedBy_fkey` FOREIGN KEY (`justifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_sessions` ADD CONSTRAINT `attendance_sessions_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `school_classes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_sessions` ADD CONSTRAINT `attendance_sessions_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_sessions` ADD CONSTRAINT `attendance_sessions_professeurId_fkey` FOREIGN KEY (`professeurId`) REFERENCES `professeurs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_sessions` ADD CONSTRAINT `attendance_sessions_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_sessions` ADD CONSTRAINT `attendance_sessions_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_records` ADD CONSTRAINT `attendance_records_attendanceSessionId_fkey` FOREIGN KEY (`attendanceSessionId`) REFERENCES `attendance_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_records` ADD CONSTRAINT `attendance_records_attendanceId_fkey` FOREIGN KEY (`attendanceId`) REFERENCES `attendances`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_stats` ADD CONSTRAINT `attendance_stats_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_stats` ADD CONSTRAINT `attendance_stats_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance_holidays` ADD CONSTRAINT `attendance_holidays_academicYearId_fkey` FOREIGN KEY (`academicYearId`) REFERENCES `academic_years`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
