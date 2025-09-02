import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema'

export const NestedEnumRetakeStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumRetakeStatusFilter, z.ZodTypeDef, Prisma.NestedEnumRetakeStatusFilter> = z.object({
  equals: RetakeStatusSchema.optional(),
  in: RetakeStatusSchema.array().optional(),
  notIn: RetakeStatusSchema.array().optional(),
  not: z.union([RetakeStatusSchema, z.lazy(() => NestedEnumRetakeStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumRetakeStatusFilterObjectZodSchema = z.object({
  equals: RetakeStatusSchema.optional(),
  in: RetakeStatusSchema.array().optional(),
  notIn: RetakeStatusSchema.array().optional(),
  not: z.union([RetakeStatusSchema, z.lazy(() => NestedEnumRetakeStatusFilterObjectSchema)]).optional()
}).strict();
