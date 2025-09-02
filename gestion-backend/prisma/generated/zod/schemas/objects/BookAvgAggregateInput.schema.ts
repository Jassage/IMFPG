import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookAvgAggregateInputObjectSchema: z.ZodType<Prisma.BookAvgAggregateInputType, z.ZodTypeDef, Prisma.BookAvgAggregateInputType> = z.object({
  quantity: z.literal(true).optional(),
  available: z.literal(true).optional()
}).strict();
export const BookAvgAggregateInputObjectZodSchema = z.object({
  quantity: z.literal(true).optional(),
  available: z.literal(true).optional()
}).strict();
