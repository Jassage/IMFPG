import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const UEOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.UEOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.UEOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const UEOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
