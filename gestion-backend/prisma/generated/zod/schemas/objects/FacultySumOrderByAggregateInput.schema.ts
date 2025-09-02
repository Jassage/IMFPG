import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const FacultySumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.FacultySumOrderByAggregateInput, z.ZodTypeDef, Prisma.FacultySumOrderByAggregateInput> = z.object({
  studentsCount: SortOrderSchema.optional(),
  coursesCount: SortOrderSchema.optional(),
  studyDuration: SortOrderSchema.optional()
}).strict();
export const FacultySumOrderByAggregateInputObjectZodSchema = z.object({
  studentsCount: SortOrderSchema.optional(),
  coursesCount: SortOrderSchema.optional(),
  studyDuration: SortOrderSchema.optional()
}).strict();
