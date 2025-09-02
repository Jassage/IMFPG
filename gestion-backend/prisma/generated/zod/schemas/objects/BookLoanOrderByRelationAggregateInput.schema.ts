import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const BookLoanOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.BookLoanOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.BookLoanOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const BookLoanOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
