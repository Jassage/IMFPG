import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AcademicYearMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AcademicYearMinOrderByAggregateInput, z.ZodTypeDef, Prisma.AcademicYearMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  year: SortOrderSchema.optional(),
  startDate: SortOrderSchema.optional(),
  endDate: SortOrderSchema.optional(),
  isCurrent: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const AcademicYearMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  year: SortOrderSchema.optional(),
  startDate: SortOrderSchema.optional(),
  endDate: SortOrderSchema.optional(),
  isCurrent: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
