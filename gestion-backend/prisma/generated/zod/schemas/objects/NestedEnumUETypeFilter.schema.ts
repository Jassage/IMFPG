import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UETypeSchema } from '../enums/UEType.schema'

export const NestedEnumUETypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumUETypeFilter, z.ZodTypeDef, Prisma.NestedEnumUETypeFilter> = z.object({
  equals: UETypeSchema.optional(),
  in: UETypeSchema.array().optional(),
  notIn: UETypeSchema.array().optional(),
  not: z.union([UETypeSchema, z.lazy(() => NestedEnumUETypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumUETypeFilterObjectZodSchema = z.object({
  equals: UETypeSchema.optional(),
  in: UETypeSchema.array().optional(),
  notIn: UETypeSchema.array().optional(),
  not: z.union([UETypeSchema, z.lazy(() => NestedEnumUETypeFilterObjectSchema)]).optional()
}).strict();
