import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleWhereInputObjectSchema } from './ScheduleWhereInput.schema'

export const ScheduleScalarRelationFilterObjectSchema: z.ZodType<Prisma.ScheduleScalarRelationFilter, z.ZodTypeDef, Prisma.ScheduleScalarRelationFilter> = z.object({
  is: z.lazy(() => ScheduleWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ScheduleWhereInputObjectSchema).optional()
}).strict();
export const ScheduleScalarRelationFilterObjectZodSchema = z.object({
  is: z.lazy(() => ScheduleWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ScheduleWhereInputObjectSchema).optional()
}).strict();
