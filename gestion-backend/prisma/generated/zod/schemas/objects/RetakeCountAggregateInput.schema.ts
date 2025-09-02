import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RetakeCountAggregateInputObjectSchema: z.ZodType<Prisma.RetakeCountAggregateInputType, z.ZodTypeDef, Prisma.RetakeCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  originalGrade: z.literal(true).optional(),
  retakeGrade: z.literal(true).optional(),
  scheduledSemester: z.literal(true).optional(),
  status: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const RetakeCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  ueId: z.literal(true).optional(),
  originalGrade: z.literal(true).optional(),
  retakeGrade: z.literal(true).optional(),
  scheduledSemester: z.literal(true).optional(),
  status: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
