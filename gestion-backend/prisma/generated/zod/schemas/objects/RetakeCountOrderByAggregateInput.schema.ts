import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RetakeCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RetakeCountOrderByAggregateInput, z.ZodTypeDef, Prisma.RetakeCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: SortOrderSchema.optional(),
  scheduledSemester: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
export const RetakeCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  ueId: SortOrderSchema.optional(),
  originalGrade: SortOrderSchema.optional(),
  retakeGrade: SortOrderSchema.optional(),
  scheduledSemester: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
