import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema';
import { NestedEnumEnrollmentStatusWithAggregatesFilterObjectSchema } from './NestedEnumEnrollmentStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumEnrollmentStatusFilterObjectSchema } from './NestedEnumEnrollmentStatusFilter.schema'

export const EnumEnrollmentStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumEnrollmentStatusWithAggregatesFilter, z.ZodTypeDef, Prisma.EnumEnrollmentStatusWithAggregatesFilter> = z.object({
  equals: EnrollmentStatusSchema.optional(),
  in: EnrollmentStatusSchema.array().optional(),
  notIn: EnrollmentStatusSchema.array().optional(),
  not: z.union([EnrollmentStatusSchema, z.lazy(() => NestedEnumEnrollmentStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumEnrollmentStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumEnrollmentStatusFilterObjectSchema).optional()
}).strict();
export const EnumEnrollmentStatusWithAggregatesFilterObjectZodSchema = z.object({
  equals: EnrollmentStatusSchema.optional(),
  in: EnrollmentStatusSchema.array().optional(),
  notIn: EnrollmentStatusSchema.array().optional(),
  not: z.union([EnrollmentStatusSchema, z.lazy(() => NestedEnumEnrollmentStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumEnrollmentStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumEnrollmentStatusFilterObjectSchema).optional()
}).strict();
