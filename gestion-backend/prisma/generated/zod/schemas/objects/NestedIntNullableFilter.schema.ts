import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const NestedIntNullableFilterObjectSchema: z.ZodType<Prisma.NestedIntNullableFilter, z.ZodTypeDef, Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().int().nullish(),
  in: z.number().int().array().nullish(),
  notIn: z.number().int().array().nullish(),
  lt: z.number().int().optional(),
  lte: z.number().int().optional(),
  gt: z.number().int().optional(),
  gte: z.number().int().optional(),
  not: z.union([z.number().int(), z.lazy(() => NestedIntNullableFilterObjectSchema)]).nullish()
}).strict();
export const NestedIntNullableFilterObjectZodSchema = z.object({
  equals: z.number().int().nullish(),
  in: z.number().int().array().nullish(),
  notIn: z.number().int().array().nullish(),
  lt: z.number().int().optional(),
  lte: z.number().int().optional(),
  gt: z.number().int().optional(),
  gte: z.number().int().optional(),
  not: z.union([z.number().int(), z.lazy(() => NestedIntNullableFilterObjectSchema)]).nullish()
}).strict();
