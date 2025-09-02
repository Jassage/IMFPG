import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipApplicationOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.ScholarshipApplicationOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ScholarshipApplicationOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
