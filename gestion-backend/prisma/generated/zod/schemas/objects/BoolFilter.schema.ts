import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { NestedBoolFilterObjectSchema } from './NestedBoolFilter.schema'

export const BoolFilterObjectSchema: z.ZodType<Prisma.BoolFilter, z.ZodTypeDef, Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterObjectSchema)]).optional()
}).strict();
export const BoolFilterObjectZodSchema = z.object({
  equals: z.boolean().optional(),
  not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterObjectSchema)]).optional()
}).strict();
