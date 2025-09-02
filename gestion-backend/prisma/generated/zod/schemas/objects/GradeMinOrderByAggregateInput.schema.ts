import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const GradeMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.GradeMinOrderByAggregateInput, z.ZodTypeDef, Prisma.GradeMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  grade: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  session: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  transcriptId: SortOrderSchema.optional(),
  professeurId: SortOrderSchema.optional()
}).strict();
export const GradeMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  grade: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  session: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  academicYearId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  transcriptId: SortOrderSchema.optional(),
  professeurId: SortOrderSchema.optional()
}).strict();
