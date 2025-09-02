import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const FacultyAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.FacultyAvgOrderByAggregateInput, z.ZodTypeDef, Prisma.FacultyAvgOrderByAggregateInput> = z.object({
  studentsCount: SortOrderSchema.optional(),
  coursesCount: SortOrderSchema.optional(),
  studyDuration: SortOrderSchema.optional()
}).strict();
export const FacultyAvgOrderByAggregateInputObjectZodSchema = z.object({
  studentsCount: SortOrderSchema.optional(),
  coursesCount: SortOrderSchema.optional(),
  studyDuration: SortOrderSchema.optional()
}).strict();
