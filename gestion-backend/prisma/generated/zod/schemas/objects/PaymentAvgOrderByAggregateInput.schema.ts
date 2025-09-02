import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const PaymentAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PaymentAvgOrderByAggregateInput, z.ZodTypeDef, Prisma.PaymentAvgOrderByAggregateInput> = z.object({
  amount: SortOrderSchema.optional()
}).strict();
export const PaymentAvgOrderByAggregateInputObjectZodSchema = z.object({
  amount: SortOrderSchema.optional()
}).strict();
