import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema'

export const EnrollmentCreateManyStudentInputObjectSchema: z.ZodType<Prisma.EnrollmentCreateManyStudentInput, z.ZodTypeDef, Prisma.EnrollmentCreateManyStudentInput> = z.object({
  id: z.string().optional(),
  facultyId: z.string(),
  level: z.string(),
  academicYearId: z.string().optional(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const EnrollmentCreateManyStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  facultyId: z.string(),
  level: z.string(),
  academicYearId: z.string().optional(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
