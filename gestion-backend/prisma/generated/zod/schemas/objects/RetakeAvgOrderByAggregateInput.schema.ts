import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RetakeAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RetakeAvgOrderByAggregateInput, z.ZodTypeDef, Prisma.RetakeAvgOrderByAggregateInput> = z.object({
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: SortOrderSchema.optional()
}).strict();
export const RetakeAvgOrderByAggregateInputObjectZodSchema = z.object({
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: SortOrderSchema.optional()
}).strict();
