import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const UESumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UESumOrderByAggregateInput, z.ZodTypeDef, Prisma.UESumOrderByAggregateInput> = z.object({
  credits: SortOrderSchema.optional(),
  passingGrade: SortOrderSchema.optional()
}).strict();
export const UESumOrderByAggregateInputObjectZodSchema = z.object({
  credits: SortOrderSchema.optional(),
  passingGrade: SortOrderSchema.optional()
}).strict();
