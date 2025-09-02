import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const BookAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BookAvgOrderByAggregateInput, z.ZodTypeDef, Prisma.BookAvgOrderByAggregateInput> = z.object({
  quantity: SortOrderSchema.optional(),
  available: SortOrderSchema.optional()
}).strict();
export const BookAvgOrderByAggregateInputObjectZodSchema = z.object({
  quantity: SortOrderSchema.optional(),
  available: SortOrderSchema.optional()
}).strict();
