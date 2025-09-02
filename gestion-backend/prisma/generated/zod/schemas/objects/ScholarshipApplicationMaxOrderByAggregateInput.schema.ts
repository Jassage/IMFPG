import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScholarshipApplicationMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.ScholarshipApplicationMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  scholarshipId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  applicationDate: SortOrderSchema.optional(),
  motivation: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  reviewNotes: SortOrderSchema.optional()
}).strict();
export const ScholarshipApplicationMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  scholarshipId: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  applicationDate: SortOrderSchema.optional(),
  motivation: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  reviewNotes: SortOrderSchema.optional()
}).strict();
