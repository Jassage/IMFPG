import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const AcademicYearCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AcademicYearCountOrderByAggregateInput, z.ZodTypeDef, Prisma.AcademicYearCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  year: SortOrderSchema.optional(),
  startDate: SortOrderSchema.optional(),
  endDate: SortOrderSchema.optional(),
  isCurrent: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const AcademicYearCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  year: SortOrderSchema.optional(),
  startDate: SortOrderSchema.optional(),
  endDate: SortOrderSchema.optional(),
  isCurrent: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
