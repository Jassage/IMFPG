import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { NestedStringNullableFilterObjectSchema } from './NestedStringNullableFilter.schema'

export const StringNullableFilterObjectSchema: z.ZodType<Prisma.StringNullableFilter, z.ZodTypeDef, Prisma.StringNullableFilter> = z.object({
  equals: z.string().nullish(),
  in: z.string().array().nullish(),
  notIn: z.string().array().nullish(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringNullableFilterObjectSchema)]).nullish()
}).strict();
export const StringNullableFilterObjectZodSchema = z.object({
  equals: z.string().nullish(),
  in: z.string().array().nullish(),
  notIn: z.string().array().nullish(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  search: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringNullableFilterObjectSchema)]).nullish()
}).strict();
