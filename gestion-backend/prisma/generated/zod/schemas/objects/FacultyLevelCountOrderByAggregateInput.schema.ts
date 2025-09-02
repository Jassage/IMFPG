import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const FacultyLevelCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.FacultyLevelCountOrderByAggregateInput, z.ZodTypeDef, Prisma.FacultyLevelCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional()
}).strict();
export const FacultyLevelCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  facultyId: SortOrderSchema.optional(),
  level: SortOrderSchema.optional()
}).strict();
