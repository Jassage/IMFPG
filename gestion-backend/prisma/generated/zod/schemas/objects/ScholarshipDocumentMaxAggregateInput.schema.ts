import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipDocumentMaxAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentMaxAggregateInputType, z.ZodTypeDef, Prisma.ScholarshipDocumentMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  scholarshipApplicationId: z.literal(true).optional(),
  url: z.literal(true).optional()
}).strict();
export const ScholarshipDocumentMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  scholarshipApplicationId: z.literal(true).optional(),
  url: z.literal(true).optional()
}).strict();
