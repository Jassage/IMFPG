import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const PaymentSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PaymentSumOrderByAggregateInput, z.ZodTypeDef, Prisma.PaymentSumOrderByAggregateInput> = z.object({
  amount: SortOrderSchema.optional()
}).strict();
export const PaymentSumOrderByAggregateInputObjectZodSchema = z.object({
  amount: SortOrderSchema.optional()
}).strict();
