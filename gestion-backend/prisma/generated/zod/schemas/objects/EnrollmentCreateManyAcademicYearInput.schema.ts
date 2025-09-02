import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema'

export const EnrollmentCreateManyAcademicYearInputObjectSchema: z.ZodType<Prisma.EnrollmentCreateManyAcademicYearInput, z.ZodTypeDef, Prisma.EnrollmentCreateManyAcademicYearInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  facultyId: z.string(),
  level: z.string(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
export const EnrollmentCreateManyAcademicYearInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  facultyId: z.string(),
  level: z.string(),
  enrollmentDate: z.date(),
  status: EnrollmentStatusSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}).strict();
