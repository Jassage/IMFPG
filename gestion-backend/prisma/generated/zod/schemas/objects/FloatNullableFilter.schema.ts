import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { NestedFloatNullableFilterObjectSchema } from './NestedFloatNullableFilter.schema'

export const FloatNullableFilterObjectSchema: z.ZodType<Prisma.FloatNullableFilter, z.ZodTypeDef, Prisma.FloatNullableFilter> = z.object({
  equals: z.number().nullish(),
  in: z.number().array().nullish(),
  notIn: z.number().array().nullish(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedFloatNullableFilterObjectSchema)]).nullish()
}).strict();
export const FloatNullableFilterObjectZodSchema = z.object({
  equals: z.number().nullish(),
  in: z.number().array().nullish(),
  notIn: z.number().array().nullish(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedFloatNullableFilterObjectSchema)]).nullish()
}).strict();
