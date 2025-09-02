import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const PaymentOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.PaymentOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.PaymentOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const PaymentOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
