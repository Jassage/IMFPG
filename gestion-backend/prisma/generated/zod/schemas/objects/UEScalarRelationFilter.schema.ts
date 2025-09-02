import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEWhereInputObjectSchema } from './UEWhereInput.schema'

export const UEScalarRelationFilterObjectSchema: z.ZodType<Prisma.UEScalarRelationFilter, z.ZodTypeDef, Prisma.UEScalarRelationFilter> = z.object({
  is: z.lazy(() => UEWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
export const UEScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => UEWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => UEWhereInputObjectSchema).optional()
}).strict();
