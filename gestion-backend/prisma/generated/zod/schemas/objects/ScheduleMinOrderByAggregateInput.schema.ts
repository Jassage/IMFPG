import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScheduleMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScheduleMinOrderByAggregateInput, z.ZodTypeDef, Prisma.ScheduleMinOrderByAggregateInput> = z.object({
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
export const ScheduleMinOrderByAggregateInputObjectZodSchema = z.object({
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
