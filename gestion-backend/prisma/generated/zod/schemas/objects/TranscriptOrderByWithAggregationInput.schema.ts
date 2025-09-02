import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TranscriptCountOrderByAggregateInputObjectSchema } from './TranscriptCountOrderByAggregateInput.schema';
import { TranscriptAvgOrderByAggregateInputObjectSchema } from './TranscriptAvgOrderByAggregateInput.schema';
import { TranscriptMaxOrderByAggregateInputObjectSchema } from './TranscriptMaxOrderByAggregateInput.schema';
import { TranscriptMinOrderByAggregateInputObjectSchema } from './TranscriptMinOrderByAggregateInput.schema';
import { TranscriptSumOrderByAggregateInputObjectSchema } from './TranscriptSumOrderByAggregateInput.schema'

export const TranscriptOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TranscriptOrderByWithAggregationInput, z.ZodTypeDef, Prisma.TranscriptOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  academicYear: SortOrderSchema.optional(),
  gpa: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  totalCredits: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  creditsEarned: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  generatedDate: SortOrderSchema.optional(),
  _count: z.lazy(() => TranscriptCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => TranscriptAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TranscriptMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TranscriptMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => TranscriptSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TranscriptOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  semester: SortOrderSchema.optional(),
  academicYear: SortOrderSchema.optional(),
  gpa: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  totalCredits: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  creditsEarned: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  generatedDate: SortOrderSchema.optional(),
  _count: z.lazy(() => TranscriptCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => TranscriptAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TranscriptMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TranscriptMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => TranscriptSumOrderByAggregateInputObjectSchema).optional()
}).strict();
