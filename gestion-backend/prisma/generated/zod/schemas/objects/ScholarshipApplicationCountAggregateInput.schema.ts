import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipApplicationCountAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCountAggregateInputType, z.ZodTypeDef, Prisma.ScholarshipApplicationCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  scholarshipId: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  applicationDate: z.literal(true).optional(),
  motivation: z.literal(true).optional(),
  status: z.literal(true).optional(),
  reviewNotes: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const ScholarshipApplicationCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  scholarshipId: z.literal(true).optional(),
  studentId: z.literal(true).optional(),
  applicationDate: z.literal(true).optional(),
  motivation: z.literal(true).optional(),
  status: z.literal(true).optional(),
  reviewNotes: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
