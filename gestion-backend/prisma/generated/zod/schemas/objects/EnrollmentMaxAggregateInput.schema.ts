import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EnrollmentMaxAggregateInputObjectSchema: z.ZodType<Prisma.EnrollmentMaxAggregateInputType, z.ZodTypeDef, Prisma.EnrollmentMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  facultyId: z.literal(true).optional(),
  level: z.literal(true).optional(),
  academicYearId: z.literal(true).optional(),
  enrollmentDate: z.literal(true).optional(),
  status: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const EnrollmentMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  facultyId: z.literal(true).optional(),
  level: z.literal(true).optional(),
  academicYearId: z.literal(true).optional(),
  enrollmentDate: z.literal(true).optional(),
  status: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
