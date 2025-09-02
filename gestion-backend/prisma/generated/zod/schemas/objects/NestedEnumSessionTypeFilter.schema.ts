import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SessionTypeSchema } from '../enums/SessionType.schema'

export const NestedEnumSessionTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumSessionTypeFilter, z.ZodTypeDef, Prisma.NestedEnumSessionTypeFilter> = z.object({
  equals: SessionTypeSchema.optional(),
  in: SessionTypeSchema.array().optional(),
  notIn: SessionTypeSchema.array().optional(),
  not: z.union([SessionTypeSchema, z.lazy(() => NestedEnumSessionTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumSessionTypeFilterObjectZodSchema = z.object({
  equals: SessionTypeSchema.optional(),
  in: SessionTypeSchema.array().optional(),
  notIn: SessionTypeSchema.array().optional(),
  not: z.union([SessionTypeSchema, z.lazy(() => NestedEnumSessionTypeFilterObjectSchema)]).optional()
}).strict();
