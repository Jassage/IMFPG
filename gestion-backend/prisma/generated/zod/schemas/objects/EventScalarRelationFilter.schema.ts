import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EventWhereInputObjectSchema } from './EventWhereInput.schema'

export const EventScalarRelationFilterObjectSchema: z.ZodType<Prisma.EventScalarRelationFilter, z.ZodTypeDef, Prisma.EventScalarRelationFilter> = z.object({
  is: z.lazy(() => EventWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => EventWhereInputObjectSchema).optional()
}).strict();
export const EventScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => EventWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => EventWhereInputObjectSchema).optional()
}).strict();
