import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UETypeSchema } from '../enums/UEType.schema';
import { NestedEnumUETypeWithAggregatesFilterObjectSchema } from './NestedEnumUETypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumUETypeFilterObjectSchema } from './NestedEnumUETypeFilter.schema'

export const EnumUETypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumUETypeWithAggregatesFilter, z.ZodTypeDef, Prisma.EnumUETypeWithAggregatesFilter> = z.object({
  equals: UETypeSchema.optional(),
  in: UETypeSchema.array().optional(),
  notIn: UETypeSchema.array().optional(),
  not: z.union([UETypeSchema, z.lazy(() => NestedEnumUETypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumUETypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumUETypeFilterObjectSchema).optional()
}).strict();
export const EnumUETypeWithAggregatesFilterObjectZodSchema = z.object({
  equals: UETypeSchema.optional(),
  in: UETypeSchema.array().optional(),
  notIn: UETypeSchema.array().optional(),
  not: z.union([UETypeSchema, z.lazy(() => NestedEnumUETypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumUETypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumUETypeFilterObjectSchema).optional()
}).strict();
