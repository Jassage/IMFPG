import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScheduleAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScheduleAvgOrderByAggregateInput, z.ZodTypeDef, Prisma.ScheduleAvgOrderByAggregateInput> = z.object({
  dayOfWeek: SortOrderSchema.optional()
}).strict();
export const ScheduleAvgOrderByAggregateInputObjectZodSchema = z.object({
  dayOfWeek: SortOrderSchema.optional()
}).strict();
