import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const GradeAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.GradeAvgOrderByAggregateInput, z.ZodTypeDef, Prisma.GradeAvgOrderByAggregateInput> = z.object({
  grade: SortOrderSchema.optional()
}).strict();
export const GradeAvgOrderByAggregateInputObjectZodSchema = z.object({
  grade: SortOrderSchema.optional()
}).strict();
