import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentUeIdFacultyIdLevelAcademicYearIdSemesterCompoundUniqueInputObjectSchema } from './CourseAssignmentUeIdFacultyIdLevelAcademicYearIdSemesterCompoundUniqueInput.schema'

export const CourseAssignmentWhereUniqueInputObjectSchema: z.ZodType<Prisma.CourseAssignmentWhereUniqueInput, z.ZodTypeDef, Prisma.CourseAssignmentWhereUniqueInput> = z.object({
  id: z.string(),
  ueId_facultyId_level_academicYearId_semester: z.lazy(() => CourseAssignmentUeIdFacultyIdLevelAcademicYearIdSemesterCompoundUniqueInputObjectSchema)
}).strict();
export const CourseAssignmentWhereUniqueInputObjectZodSchema = z.object({
  id: z.string(),
  ueId_facultyId_level_academicYearId_semester: z.lazy(() => CourseAssignmentUeIdFacultyIdLevelAcademicYearIdSemesterCompoundUniqueInputObjectSchema)
}).strict();
