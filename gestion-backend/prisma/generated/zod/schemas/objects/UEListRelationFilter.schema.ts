import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema'

export const UEListRelationFilterObjectSchema: z.ZodType<Prisma.UEListRelationFilter, z.ZodTypeDef, Prisma.UEListRelationFilter> = z.object({
  every: z.lazy(() => UEWhereInputObjectSchema).optional(),
  some: z.lazy(() => UEWhereInputObjectSchema).optional(),
  none: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
export const UEListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => UEWhereInputObjectSchema).optional(),
  some: z.lazy(() => UEWhereInputObjectSchema).optional(),
  none: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
