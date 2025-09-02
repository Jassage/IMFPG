import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const BookLoanSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BookLoanSumOrderByAggregateInput, z.ZodTypeDef, Prisma.BookLoanSumOrderByAggregateInput> = z.object({
  renewalCount: SortOrderSchema.optional(),
  fine: SortOrderSchema.optional()
}).strict();
export const BookLoanSumOrderByAggregateInputObjectZodSchema = z.object({
  renewalCount: SortOrderSchema.optional(),
  fine: SortOrderSchema.optional()
}).strict();
