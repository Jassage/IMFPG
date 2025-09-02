import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const GradeCountAggregateInputObjectSchema: z.ZodType<Prisma.GradeCountAggregateInputType, z.ZodTypeDef, Prisma.GradeCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  grade: z.literal(true).optional(),
  status: z.literal(true).optional(),
  session: z.literal(true).optional(),
  semester: z.literal(true).optional(),
  level: z.literal(true).optional(),
  academicYearId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  transcriptId: z.literal(true).optional(),
  professeurId: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const GradeCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  grade: z.literal(true).optional(),
  status: z.literal(true).optional(),
  session: z.literal(true).optional(),
  semester: z.literal(true).optional(),
  level: z.literal(true).optional(),
  academicYearId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  transcriptId: z.literal(true).optional(),
  professeurId: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
