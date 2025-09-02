import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { RoomReservationCountOrderByAggregateInputObjectSchema } from './RoomReservationCountOrderByAggregateInput.schema';
import { RoomReservationMaxOrderByAggregateInputObjectSchema } from './RoomReservationMaxOrderByAggregateInput.schema';
import { RoomReservationMinOrderByAggregateInputObjectSchema } from './RoomReservationMinOrderByAggregateInput.schema'

export const RoomReservationOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.RoomReservationOrderByWithAggregationInput, z.ZodTypeDef, Prisma.RoomReservationOrderByWithAggregationInput> = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  purpose: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  _count: z.lazy(() => RoomReservationCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => RoomReservationMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => RoomReservationMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const RoomReservationOrderByWithAggregationInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  purpose: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  _count: z.lazy(() => RoomReservationCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => RoomReservationMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => RoomReservationMinOrderByAggregateInputObjectSchema).optional()
}).strict();
