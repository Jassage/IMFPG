import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScheduleMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScheduleMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.ScheduleMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  assignmentId: SortOrderSchema.optional(),
  dayOfWeek: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  classroom: SortOrderSchema.optional(),
  recurrence: SortOrderSchema.optional(),
  professeurId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ScheduleMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  assignmentId: SortOrderSchema.optional(),
  dayOfWeek: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  classroom: SortOrderSchema.optional(),
  recurrence: SortOrderSchema.optional(),
  professeurId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
