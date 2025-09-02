import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipDocumentCountAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentCountAggregateInputType, z.ZodTypeDef, Prisma.ScholarshipDocumentCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  scholarshipApplicationId: z.literal(true).optional(),
  url: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const ScholarshipDocumentCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  scholarshipApplicationId: z.literal(true).optional(),
  url: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
