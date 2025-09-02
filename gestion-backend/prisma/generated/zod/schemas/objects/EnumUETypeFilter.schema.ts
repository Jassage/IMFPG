import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UETypeSchema } from '../enums/UEType.schema';
import { NestedEnumUETypeFilterObjectSchema } from './NestedEnumUETypeFilter.schema'

export const EnumUETypeFilterObjectSchema: z.ZodType<Prisma.EnumUETypeFilter, z.ZodTypeDef, Prisma.EnumUETypeFilter> = z.object({
  equals: UETypeSchema.optional(),
  in: UETypeSchema.array().optional(),
  notIn: UETypeSchema.array().optional(),
  not: z.union([UETypeSchema, z.lazy(() => NestedEnumUETypeFilterObjectSchema)]).optional()
}).strict();
export const EnumUETypeFilterObjectZodSchema = z.object({
  equals: UETypeSchema.optional(),
  in: UETypeSchema.array().optional(),
  notIn: UETypeSchema.array().optional(),
  not: z.union([UETypeSchema, z.lazy(() => NestedEnumUETypeFilterObjectSchema)]).optional()
}).strict();
