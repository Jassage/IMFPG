import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SemesterSchema } from '../enums/Semester.schema'

export const CourseAssignmentUeIdFacultyIdLevelAcademicYearIdSemesterCompoundUniqueInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUeIdFacultyIdLevelAcademicYearIdSemesterCompoundUniqueInput, z.ZodTypeDef, Prisma.CourseAssignmentUeIdFacultyIdLevelAcademicYearIdSemesterCompoundUniqueInput> = z.object({
  ueId: z.string(),
  facultyId: z.string(),
  level: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema
}).strict();
export const CourseAssignmentUeIdFacultyIdLevelAcademicYearIdSemesterCompoundUniqueInputObjectZodSchema = z.object({
  ueId: z.string(),
  facultyId: z.string(),
  level: z.string(),
  academicYearId: z.string(),
  semester: SemesterSchema
}).strict();
