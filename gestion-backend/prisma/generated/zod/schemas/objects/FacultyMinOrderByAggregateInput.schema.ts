import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const FacultyMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.FacultyMinOrderByAggregateInput, z.ZodTypeDef, Prisma.FacultyMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  dean: SortOrderSchema.optional(),
  studentsCount: SortOrderSchema.optional(),
  coursesCount: SortOrderSchema.optional(),
  studyDuration: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const FacultyMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  dean: SortOrderSchema.optional(),
  studentsCount: SortOrderSchema.optional(),
  coursesCount: SortOrderSchema.optional(),
  studyDuration: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
