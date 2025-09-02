import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipApplicationMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationMinOrderByAggregateInput, z.ZodTypeDef, Prisma.ScholarshipApplicationMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  scholarshipId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  applicationDate: SortOrderSchema.optional(),
  motivation: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  reviewNotes: SortOrderSchema.optional()
}).strict();
export const ScholarshipApplicationMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  scholarshipId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  applicationDate: SortOrderSchema.optional(),
  motivation: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  reviewNotes: SortOrderSchema.optional()
}).strict();
