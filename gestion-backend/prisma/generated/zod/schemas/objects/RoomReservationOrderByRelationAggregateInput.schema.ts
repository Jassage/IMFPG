import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

export const RoomReservationOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.RoomReservationOrderByRelationAggregateInput, z.ZodTypeDef, Prisma.RoomReservationOrderByRelationAggregateInput> = z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const RoomReservationOrderByRelationAggregateInputObjectZodSchema = z.object({
  _count: SortOrderSchema.optional()
}).strict();
