import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const UECountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.UECountOrderByAggregateInput, z.ZodTypeDef, Prisma.UECountOrderByAggregateInput> = z.object({
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
export const UECountOrderByAggregateInputObjectZodSchema = z.object({
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
