import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const GradeOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.GradeOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.GradeOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const GradeOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
