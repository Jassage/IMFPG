import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipDocumentMinAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentMinAggregateInputType, z.ZodTypeDef, Prisma.ScholarshipDocumentMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  scholarshipApplicationId: z.literal(true).optional(),
  url: z.literal(true).optional()
}).strict();
export const ScholarshipDocumentMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  scholarshipApplicationId: z.literal(true).optional(),
  url: z.literal(true).optional()
}).strict();
