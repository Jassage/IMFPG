import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ScheduleCountOrderByAggregateInputObjectSchema } from './ScheduleCountOrderByAggregateInput.schema';
import { ScheduleAvgOrderByAggregateInputObjectSchema } from './ScheduleAvgOrderByAggregateInput.schema';
import { ScheduleMaxOrderByAggregateInputObjectSchema } from './ScheduleMaxOrderByAggregateInput.schema';
import { ScheduleMinOrderByAggregateInputObjectSchema } from './ScheduleMinOrderByAggregateInput.schema';
import { ScheduleSumOrderByAggregateInputObjectSchema } from './ScheduleSumOrderByAggregateInput.schema'

export const ScheduleOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ScheduleOrderByWithAggregationInput, z.ZodTypeDef, Prisma.ScheduleOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  assignmentId: SortOrderSchema.optional(),
  dayOfWeek: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  classroom: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  recurrence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  exceptions: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  professeurId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ScheduleCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ScheduleAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ScheduleMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ScheduleMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ScheduleSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ScheduleOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  assignmentId: SortOrderSchema.optional(),
  dayOfWeek: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  classroom: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  recurrence: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  exceptions: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  professeurId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ScheduleCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ScheduleAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ScheduleMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ScheduleMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ScheduleSumOrderByAggregateInputObjectSchema).optional()
}).strict();
