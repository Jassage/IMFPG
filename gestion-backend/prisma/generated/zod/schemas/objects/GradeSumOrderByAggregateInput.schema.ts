import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const GradeSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.GradeSumOrderByAggregateInput, z.ZodTypeDef, Prisma.GradeSumOrderByAggregateInput> = z.object({
  grade: SortOrderSchema.optional()
}).strict();
export const GradeSumOrderByAggregateInputObjectZodSchema = z.object({
  grade: SortOrderSchema.optional()
}).strict();
