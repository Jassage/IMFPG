import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipApplicationCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCountOrderByAggregateInput, z.ZodTypeDef, Prisma.ScholarshipApplicationCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  scholarshipId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  applicationDate: SortOrderSchema.optional(),
  motivation: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  reviewNotes: SortOrderSchema.optional()
}).strict();
export const ScholarshipApplicationCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  scholarshipId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  applicationDate: SortOrderSchema.optional(),
  motivation: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  reviewNotes: SortOrderSchema.optional()
}).strict();
