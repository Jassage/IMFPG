import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScheduleOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ScheduleOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.ScheduleOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ScheduleOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
