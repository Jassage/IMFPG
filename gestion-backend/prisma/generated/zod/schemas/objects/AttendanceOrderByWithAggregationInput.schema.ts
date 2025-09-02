import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AttendanceCountOrderByAggregateInputObjectSchema } from './AttendanceCountOrderByAggregateInput.schema';
import { AttendanceMaxOrderByAggregateInputObjectSchema } from './AttendanceMaxOrderByAggregateInput.schema';
import { AttendanceMinOrderByAggregateInputObjectSchema } from './AttendanceMinOrderByAggregateInput.schema'

export const AttendanceOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AttendanceOrderByWithAggregationInput, z.ZodTypeDef, Prisma.AttendanceOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  scheduleId: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => AttendanceCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AttendanceMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AttendanceMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const AttendanceOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  studentId: SortOrderSchema.optional(),
  scheduleId: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => AttendanceCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AttendanceMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AttendanceMinOrderByAggregateInputObjectSchema).optional()
}).strict();
