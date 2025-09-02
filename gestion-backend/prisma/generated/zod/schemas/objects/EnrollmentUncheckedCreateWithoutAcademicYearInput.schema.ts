import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema'

export const EnrollmentUncheckedCreateWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.EnrollmentUncheckedCreateWithoutAcademicYearInput, z.ZodTypeDef, Prisma.EnrollmentUncheckedCreateWithoutAcademicYearInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  facultyId: z.string(),
  level: z.string(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const EnrollmentUncheckedCreateWithoutAcademicYearInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  facultyId: z.string(),
  level: z.string(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
