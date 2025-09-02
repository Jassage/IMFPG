import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { GradeCountOrderByAggregateInputObjectSchema } from './GradeCountOrderByAggregateInput.schema';
import { GradeAvgOrderByAggregateInputObjectSchema } from './GradeAvgOrderByAggregateInput.schema';
import { GradeMaxOrderByAggregateInputObjectSchema } from './GradeMaxOrderByAggregateInput.schema';
import { GradeMinOrderByAggregateInputObjectSchema } from './GradeMinOrderByAggregateInput.schema';
import { GradeSumOrderByAggregateInputObjectSchema } from './GradeSumOrderByAggregateInput.schema'

export const GradeOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.GradeOrderByWithAggregationInput, z.ZodTypeDef, Prisma.GradeOrderByWithAggregationInput> = z.object({
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
  transcriptId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  professeurId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => GradeCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => GradeAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => GradeMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => GradeMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => GradeSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const GradeOrderByWithAggregationInputObjectZodSchema = z.object({
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
  transcriptId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  professeurId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => GradeCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => GradeAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => GradeMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => GradeMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => GradeSumOrderByAggregateInputObjectSchema).optional()
}).strict();
