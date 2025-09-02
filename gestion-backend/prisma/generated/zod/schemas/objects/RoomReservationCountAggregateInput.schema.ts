import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const RoomReservationCountAggregateInputObjectSchema: z.ZodType<Prisma.RoomReservationCountAggregateInputType, z.ZodTypeDef, Prisma.RoomReservationCountAggregateInputType> = z.object({
  id: z.literal(true).optional(),
  roomId: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  startTime: z.literal(true).optional(),
  endTime: z.literal(true).optional(),
  purpose: z.literal(true).optional(),
  status: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const RoomReservationCountAggregateInputObjectZodSchema = z.object({
  id: z.literal(true).optional(),
  roomId: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  startTime: z.literal(true).optional(),
  endTime: z.literal(true).optional(),
  purpose: z.literal(true).optional(),
  status: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
