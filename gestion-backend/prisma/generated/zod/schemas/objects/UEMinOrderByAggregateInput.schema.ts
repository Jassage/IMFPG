import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const UEMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UEMinOrderByAggregateInput, z.ZodTypeDef, Prisma.UEMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  credits: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  passingGrade: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  objectives: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  createdById: SortOrderSchema.optional()
}).strict();
export const UEMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  credits: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  passingGrade: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  objectives: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  createdById: SortOrderSchema.optional()
}).strict();
