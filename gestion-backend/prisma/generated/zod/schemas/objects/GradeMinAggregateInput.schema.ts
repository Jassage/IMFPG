import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const GradeMinAggregateInputObjectSchema: z.ZodType<Prisma.GradeMinAggregateInputType, z.ZodTypeDef, Prisma.GradeMinAggregateInputType> = z.object({
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
  professeurId: z.literal(true).optional()
}).strict();
export const GradeMinAggregateInputObjectZodSchema = z.object({
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
  professeurId: z.literal(true).optional()
}).strict();
