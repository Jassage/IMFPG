import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SessionTypeSchema } from '../enums/SessionType.schema';
import { NestedEnumSessionTypeFilterObjectSchema } from './NestedEnumSessionTypeFilter.schema'

export const EnumSessionTypeFilterObjectSchema: z.ZodType<Prisma.EnumSessionTypeFilter, z.ZodTypeDef, Prisma.EnumSessionTypeFilter> = z.object({
  equals: SessionTypeSchema.optional(),
  in: SessionTypeSchema.array().optional(),
  notIn: SessionTypeSchema.array().optional(),
  not: z.union([SessionTypeSchema, z.lazy(() => NestedEnumSessionTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumSessionTypeFilterObjectZodSchema = z.object({
  equals: SessionTypeSchema.optional(),
  in: SessionTypeSchema.array().optional(),
  notIn: SessionTypeSchema.array().optional(),
  not: z.union([SessionTypeSchema, z.lazy(() => NestedEnumSessionTypeFilterObjectSchema)]).optional()
}).strict();
