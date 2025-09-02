import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const TranscriptMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TranscriptMinOrderByAggregateInput, z.ZodTypeDef, Prisma.TranscriptMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  academicYear: SortOrderSchema.optional(),
  gpa: SortOrderSchema.optional(),
  totalCredits: SortOrderSchema.optional(),
  creditsEarned: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional()
}).strict();
export const TranscriptMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  academicYear: SortOrderSchema.optional(),
  gpa: SortOrderSchema.optional(),
  totalCredits: SortOrderSchema.optional(),
  creditsEarned: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional()
}).strict();
