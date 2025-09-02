import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const ScheduleCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ScheduleCountOrderByAggregateInput, z.ZodTypeDef, Prisma.ScheduleCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  assignmentId: SortOrderSchema.optional(),
  dayOfWeek: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  classroom: SortOrderSchema.optional(),
  recurrence: SortOrderSchema.optional(),
  exceptions: SortOrderSchema.optional(),
  professeurId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ScheduleCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  assignmentId: SortOrderSchema.optional(),
  dayOfWeek: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  classroom: SortOrderSchema.optional(),
  recurrence: SortOrderSchema.optional(),
  exceptions: SortOrderSchema.optional(),
  professeurId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
