import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumRetakeStatusFilterObjectSchema } from './NestedEnumRetakeStatusFilter.schema'

export const NestedEnumRetakeStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumRetakeStatusWithAggregatesFilter, z.ZodTypeDef, Prisma.NestedEnumRetakeStatusWithAggregatesFilter> = z.object({
  equals: RetakeStatusSchema.optional(),
  in: RetakeStatusSchema.array().optional(),
  notIn: RetakeStatusSchema.array().optional(),
  not: z.union([RetakeStatusSchema, z.lazy(() => NestedEnumRetakeStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumRetakeStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumRetakeStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumRetakeStatusWithAggregatesFilterObjectZodSchema = z.object({
  equals: RetakeStatusSchema.optional(),
  in: RetakeStatusSchema.array().optional(),
  notIn: RetakeStatusSchema.array().optional(),
  not: z.union([RetakeStatusSchema, z.lazy(() => NestedEnumRetakeStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumRetakeStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumRetakeStatusFilterObjectSchema).optional()
}).strict();
