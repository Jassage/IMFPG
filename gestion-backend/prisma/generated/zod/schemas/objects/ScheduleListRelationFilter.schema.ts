import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleWhereInputObjectSchema } from './ScheduleWhereInput.schema'

export const ScheduleListRelationFilterObjectSchema: z.ZodType<Prisma.ScheduleListRelationFilter, z.ZodTypeDef, Prisma.ScheduleListRelationFilter> = z.object({
  every: z.lazy(() => ScheduleWhereInputObjectSchema).optional(),
  some: z.lazy(() => ScheduleWhereInputObjectSchema).optional(),
  none: z.lazy(() => ScheduleWhereInputObjectSchema).optional()
}).strict();
export const ScheduleListRelationFilterObjectZodSchema = z.object({
  every: z.lazy(() => ScheduleWhereInputObjectSchema).optional(),
  some: z.lazy(() => ScheduleWhereInputObjectSchema).optional(),
  none: z.lazy(() => ScheduleWhereInputObjectSchema).optional()
}).strict();
