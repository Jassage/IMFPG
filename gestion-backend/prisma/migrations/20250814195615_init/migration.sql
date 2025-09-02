/*
  Warnings:

  - Added the required column `studyDuration` to the `Faculty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `faculty` ADD COLUMN `studyDuration` INTEGER NOT NULL;
