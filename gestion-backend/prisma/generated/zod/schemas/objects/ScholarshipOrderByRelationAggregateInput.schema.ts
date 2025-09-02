import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.ScholarshipOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ScholarshipOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
