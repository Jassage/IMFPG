import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RetakeMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RetakeMinOrderByAggregateInput, z.ZodTypeDef, Prisma.RetakeMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: SortOrderSchema.optional(),
  scheduledSemester: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
export const RetakeMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: SortOrderSchema.optional(),
  scheduledSemester: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
