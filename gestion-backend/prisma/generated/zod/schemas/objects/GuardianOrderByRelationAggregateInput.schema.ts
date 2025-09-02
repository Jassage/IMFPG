import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const GuardianOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.GuardianOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.GuardianOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const GuardianOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
