import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema'

export const EnrollmentUncheckedCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.EnrollmentUncheckedCreateWithoutStudentInput, z.ZodTypeDef, Prisma.EnrollmentUncheckedCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  facultyId: z.string(),
  level: z.string(),
  academicYearId: z.string().optional(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const EnrollmentUncheckedCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  facultyId: z.string(),
  level: z.string(),
  academicYearId: z.string().optional(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
