import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeWhereInputObjectSchema } from './RetakeWhereInput.schema'

export const RetakeListRelationFilterObjectSchema: z.ZodType<Prisma.RetakeListRelationFilter, z.ZodTypeDef, Prisma.RetakeListRelationFilter> = z.object({
  every: z.lazy(() => RetakeWhereInputObjectSchema).optional(),
  some: z.lazy(() => RetakeWhereInputObjectSchema).optional(),
  none: z.lazy(() => RetakeWhereInputObjectSchema).optional()
}).strict();
export const RetakeListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => RetakeWhereInputObjectSchema).optional(),
  some: z.lazy(() => RetakeWhereInputObjectSchema).optional(),
  none: z.lazy(() => RetakeWhereInputObjectSchema).optional()
}).strict();
