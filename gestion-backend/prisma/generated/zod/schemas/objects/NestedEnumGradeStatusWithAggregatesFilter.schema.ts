import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeStatusSchema } from '../enums/GradeStatus.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumGradeStatusFilterObjectSchema } from './NestedEnumGradeStatusFilter.schema'

export const NestedEnumGradeStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumGradeStatusWithAggregatesFilter, z.ZodTypeDef, Prisma.NestedEnumGradeStatusWithAggregatesFilter> = z.object({
  equals: GradeStatusSchema.optional(),
  in: GradeStatusSchema.array().optional(),
  notIn: GradeStatusSchema.array().optional(),
  not: z.union([GradeStatusSchema, z.lazy(() => NestedEnumGradeStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumGradeStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumGradeStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumGradeStatusWithAggregatesFilterObjectZodSchema = z.object({
  equals: GradeStatusSchema.optional(),
  in: GradeStatusSchema.array().optional(),
  notIn: GradeStatusSchema.array().optional(),
  not: z.union([GradeStatusSchema, z.lazy(() => NestedEnumGradeStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumGradeStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumGradeStatusFilterObjectSchema).optional()
}).strict();
