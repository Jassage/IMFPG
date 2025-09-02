import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RetakeSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RetakeSumOrderByAggregateInput, z.ZodTypeDef, Prisma.RetakeSumOrderByAggregateInput> = z.object({
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: SortOrderSchema.optional()
}).strict();
export const RetakeSumOrderByAggregateInputObjectZodSchema = z.object({
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: SortOrderSchema.optional()
}).strict();
