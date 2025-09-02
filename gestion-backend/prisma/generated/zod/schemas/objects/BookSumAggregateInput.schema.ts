import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const BookSumAggregateInputObjectSchema: z.ZodType<Prisma.BookSumAggregateInputType, z.ZodTypeDef, Prisma.BookSumAggregateInputType> = z.object({
  quantity: z.literal(true).optional(),
  available: z.literal(true).optional()
}).strict();
export const BookSumAggregateInputObjectZodSchema = z.object({
  quantity: z.literal(true).optional(),
  available: z.literal(true).optional()
}).strict();
