import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentStatusSchema } from '../enums/EnrollmentStatus.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumEnrollmentStatusFilterObjectSchema } from './NestedEnumEnrollmentStatusFilter.schema'

export const NestedEnumEnrollmentStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumEnrollmentStatusWithAggregatesFilter, z.ZodTypeDef, Prisma.NestedEnumEnrollmentStatusWithAggregatesFilter> = z.object({
  equals: EnrollmentStatusSchema.optional(),
  in: EnrollmentStatusSchema.array().optional(),
  notIn: EnrollmentStatusSchema.array().optional(),
  not: z.union([EnrollmentStatusSchema, z.lazy(() => NestedEnumEnrollmentStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumEnrollmentStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumEnrollmentStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumEnrollmentStatusWithAggregatesFilterObjectZodSchema = z.object({
  equals: EnrollmentStatusSchema.optional(),
  in: EnrollmentStatusSchema.array().optional(),
  notIn: EnrollmentStatusSchema.array().optional(),
  not: z.union([EnrollmentStatusSchema, z.lazy(() => NestedEnumEnrollmentStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumEnrollmentStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumEnrollmentStatusFilterObjectSchema).optional()
}).strict();
