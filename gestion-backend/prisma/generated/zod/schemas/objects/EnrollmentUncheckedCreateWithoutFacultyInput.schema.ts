import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema'

export const EnrollmentUncheckedCreateWithoutFacultyInputObjectSchema: z.ZodType<Prisma.EnrollmentUncheckedCreateWithoutFacultyInput, z.ZodTypeDef, Prisma.EnrollmentUncheckedCreateWithoutFacultyInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  level: z.string(),
  academicYearId: z.string().optional(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const EnrollmentUncheckedCreateWithoutFacultyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  level: z.string(),
  academicYearId: z.string().optional(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
