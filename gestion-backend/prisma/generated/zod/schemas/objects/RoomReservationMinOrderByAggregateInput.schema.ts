import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RoomReservationMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RoomReservationMinOrderByAggregateInput, z.ZodTypeDef, Prisma.RoomReservationMinOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  purpose: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
export const RoomReservationMinOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  purpose: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
