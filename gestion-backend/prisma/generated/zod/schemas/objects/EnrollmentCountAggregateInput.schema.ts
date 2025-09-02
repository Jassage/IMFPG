import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const EnrollmentCountAggregateInputObjectSchema: z.ZodType<Prisma.EnrollmentCountAggregateInputType, z.ZodTypeDef, Prisma.EnrollmentCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  facultyId: z.literal(true).optional(),
  level: z.literal(true).optional(),
  academicYearId: z.literal(true).optional(),
  enrollmentDate: z.literal(true).optional(),
  status: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const EnrollmentCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  facultyId: z.literal(true).optional(),
  level: z.literal(true).optional(),
  academicYearId: z.literal(true).optional(),
  enrollmentDate: z.literal(true).optional(),
  status: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
