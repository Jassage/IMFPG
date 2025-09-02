import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const TranscriptMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TranscriptMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.TranscriptMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  academicYear: SortOrderSchema.optional(),
  gpa: SortOrderSchema.optional(),
  totalCredits: SortOrderSchema.optional(),
  creditsEarned: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional()
}).strict();
export const TranscriptMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  academicYear: SortOrderSchema.optional(),
  gpa: SortOrderSchema.optional(),
  totalCredits: SortOrderSchema.optional(),
  creditsEarned: SortOrderSchema.optional(),
  generatedDate: SortOrderSchema.optional()
}).strict();
