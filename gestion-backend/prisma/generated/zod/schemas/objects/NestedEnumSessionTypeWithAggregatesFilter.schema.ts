import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SessionTypeSchema } from '../enums/SessionType.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumSessionTypeFilterObjectSchema } from './NestedEnumSessionTypeFilter.schema'

export const NestedEnumSessionTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumSessionTypeWithAggregatesFilter, z.ZodTypeDef, Prisma.NestedEnumSessionTypeWithAggregatesFilter> = z.object({
  equals: SessionTypeSchema.optional(),
  in: SessionTypeSchema.array().optional(),
  notIn: SessionTypeSchema.array().optional(),
  not: z.union([SessionTypeSchema, z.lazy(() => NestedEnumSessionTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumSessionTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumSessionTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumSessionTypeWithAggregatesFilterObjectZodSchema = z.object({
  equals: SessionTypeSchema.optional(),
  in: SessionTypeSchema.array().optional(),
  notIn: SessionTypeSchema.array().optional(),
  not: z.union([SessionTypeSchema, z.lazy(() => NestedEnumSessionTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumSessionTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumSessionTypeFilterObjectSchema).optional()
}).strict();
