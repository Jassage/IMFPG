import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const FacultyMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.FacultyMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.FacultyMaxOrderByAggregateInput> = z.object({
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
export const FacultyMaxOrderByAggregateInputObjectZodSchema = z.object({
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
