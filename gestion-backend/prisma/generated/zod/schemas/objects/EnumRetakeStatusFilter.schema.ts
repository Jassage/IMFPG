import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeStatusSchema } from '../enums/RetakeStatus.schema';
import { NestedEnumRetakeStatusFilterObjectSchema } from './NestedEnumRetakeStatusFilter.schema'

export const EnumRetakeStatusFilterObjectSchema: z.ZodType<Prisma.EnumRetakeStatusFilter, z.ZodTypeDef, Prisma.EnumRetakeStatusFilter> = z.object({
  equals: RetakeStatusSchema.optional(),
  in: RetakeStatusSchema.array().optional(),
  notIn: RetakeStatusSchema.array().optional(),
  not: z.union([RetakeStatusSchema, z.lazy(() => NestedEnumRetakeStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumRetakeStatusFilterObjectZodSchema = z.object({
  equals: RetakeStatusSchema.optional(),
  in: RetakeStatusSchema.array().optional(),
  notIn: RetakeStatusSchema.array().optional(),
  not: z.union([RetakeStatusSchema, z.lazy(() => NestedEnumRetakeStatusFilterObjectSchema)]).optional()
}).strict();
