import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema';
import { NestedEnumRetakeStatusWithAggregatesFilterObjectSchema } from './NestedEnumRetakeStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumRetakeStatusFilterObjectSchema } from './NestedEnumRetakeStatusFilter.schema'

export const EnumRetakeStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumRetakeStatusWithAggregatesFilter, z.ZodTypeDef, Prisma.EnumRetakeStatusWithAggregatesFilter> = z.object({
  equals: RetakeStatusSchema.optional(),
  in: RetakeStatusSchema.array().optional(),
  notIn: RetakeStatusSchema.array().optional(),
  not: z.union([RetakeStatusSchema, z.lazy(() => NestedEnumRetakeStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumRetakeStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumRetakeStatusFilterObjectSchema).optional()
}).strict();
export const EnumRetakeStatusWithAggregatesFilterObjectZodSchema = z.object({
  equals: RetakeStatusSchema.optional(),
  in: RetakeStatusSchema.array().optional(),
  notIn: RetakeStatusSchema.array().optional(),
  not: z.union([RetakeStatusSchema, z.lazy(() => NestedEnumRetakeStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumRetakeStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumRetakeStatusFilterObjectSchema).optional()
}).strict();
