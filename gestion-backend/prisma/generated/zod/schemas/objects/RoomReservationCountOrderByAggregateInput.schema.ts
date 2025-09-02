import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RoomReservationCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RoomReservationCountOrderByAggregateInput, z.ZodTypeDef, Prisma.RoomReservationCountOrderByAggregateInput> = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  purpose: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
export const RoomReservationCountOrderByAggregateInputObjectZodSchema = z.object({
  id: SortOrderSchema.optional(),
  roomId: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  startTime: SortOrderSchema.optional(),
  endTime: SortOrderSchema.optional(),
  purpose: SortOrderSchema.optional(),
  status: SortOrderSchema.optional()
}).strict();
