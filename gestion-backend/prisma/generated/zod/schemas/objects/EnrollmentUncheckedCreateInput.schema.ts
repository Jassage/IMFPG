import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema'

export const EnrollmentUncheckedCreateInputObjectSchema: z.ZodType<Prisma.EnrollmentUncheckedCreateInput, z.ZodTypeDef, Prisma.EnrollmentUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  facultyId: z.string(),
  level: z.string(),
  academicYearId: z.string().optional(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const EnrollmentUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  facultyId: z.string(),
  level: z.string(),
  academicYearId: z.string().optional(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
