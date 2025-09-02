import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const AnalyticsCountAggregateInputObjectSchema: z.ZodType<Prisma.AnalyticsCountAggregateInputType, z.ZodTypeDef, Prisma.AnalyticsCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  data: z.literal(true).optional(),
  generatedDate: z.literal(true).optional(),
  parameters: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const AnalyticsCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  data: z.literal(true).optional(),
  generatedDate: z.literal(true).optional(),
  parameters: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
