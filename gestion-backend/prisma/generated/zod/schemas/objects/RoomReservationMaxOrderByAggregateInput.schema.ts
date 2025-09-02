import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RoomReservationMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RoomReservationMaxOrderByAggregateInput, z.ZodTypeDef, Prisma.RoomReservationMaxOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  purpose: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
export const RoomReservationMaxOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  purpose: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
