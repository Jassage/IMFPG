import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema'

export const EnrollmentCreateManyFacultyInputObjectSchema: z.ZodType<Prisma.EnrollmentCreateManyFacultyInput, z.ZodTypeDef, Prisma.EnrollmentCreateManyFacultyInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  level: z.string(),
  academicYearId: z.string().optional(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const EnrollmentCreateManyFacultyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  level: z.string(),
  academicYearId: z.string().optional(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
