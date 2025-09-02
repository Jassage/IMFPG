import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const UEAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UEAvgOrderByAggregateInput, z.ZodTypeDef, Prisma.UEAvgOrderByAggregateInput> = z.object({
  credits: SortOrderSchema.optional(),
  passingGrade: SortOrderSchema.optional()
}).strict();
export const UEAvgOrderByAggregateInputObjectZodSchema = z.object({
  credits: SortOrderSchema.optional(),
  passingGrade: SortOrderSchema.optional()
}).strict();
