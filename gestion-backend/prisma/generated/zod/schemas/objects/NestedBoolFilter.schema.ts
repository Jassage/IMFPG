import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const NestedBoolFilterObjectSchema: z.ZodType<Prisma.NestedBoolFilter, z.ZodTypeDef, Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterObjectSchema)]).optional()
}).strict();
export const NestedBoolFilterObjectZodSchema = z.object({
  equals: z.boolean().optional(),
  not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterObjectSchema)]).optional()
}).strict();
