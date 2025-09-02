import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const FacultyLevelMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.FacultyLevelMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.FacultyLevelMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional()
}).strict();
export const FacultyLevelMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional()
}).strict();
