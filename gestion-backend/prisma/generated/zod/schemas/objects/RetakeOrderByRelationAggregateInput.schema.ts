import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RetakeOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.RetakeOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.RetakeOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const RetakeOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
