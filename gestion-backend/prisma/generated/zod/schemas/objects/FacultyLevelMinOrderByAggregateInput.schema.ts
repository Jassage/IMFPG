import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const FacultyLevelMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.FacultyLevelMinOrderByAggregateInput, z.ZodTypeDef, Prisma.FacultyLevelMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional()
}).strict();
export const FacultyLevelMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional()
}).strict();
