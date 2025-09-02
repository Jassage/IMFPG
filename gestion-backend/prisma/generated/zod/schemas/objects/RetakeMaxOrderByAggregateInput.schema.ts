import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RetakeMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RetakeMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.RetakeMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: SortOrderSchema.optional(),
  scheduledSemester: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
export const RetakeMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: SortOrderSchema.optional(),
  scheduledSemester: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
