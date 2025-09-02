import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const BookLoanAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BookLoanAvgOrderByAggregateInput, z.ZodTypeDef, Prisma.BookLoanAvgOrderByAggregateInput> = z.object({
  renewalCount: SortOrderSchema.optional(),
  fine: SortOrderSchema.optional()
}).strict();
export const BookLoanAvgOrderByAggregateInputObjectZodSchema = z.object({
  renewalCount: SortOrderSchema.optional(),
  fine: SortOrderSchema.optional()
}).strict();
