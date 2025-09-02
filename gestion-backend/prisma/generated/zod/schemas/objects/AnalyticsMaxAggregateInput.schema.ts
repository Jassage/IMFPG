import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnalyticsMaxAggregateInputObjectSchema: z.ZodType<Prisma.AnalyticsMaxAggregateInputType, z.ZodTypeDef, Prisma.AnalyticsMaxAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  generatedDate: z.literal(true).optional()
}).strict();
export const AnalyticsMaxAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  generatedDate: z.literal(true).optional()
}).strict();
