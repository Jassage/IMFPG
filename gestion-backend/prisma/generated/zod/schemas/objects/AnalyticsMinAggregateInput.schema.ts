import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnalyticsMinAggregateInputObjectSchema: z.ZodType<Prisma.AnalyticsMinAggregateInputType, z.ZodTypeDef, Prisma.AnalyticsMinAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  generatedDate: z.literal(true).optional()
}).strict();
export const AnalyticsMinAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  generatedDate: z.literal(true).optional()
}).strict();
